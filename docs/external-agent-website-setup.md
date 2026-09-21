# 建站 Agent 新服务器交接手册（非 Hermes）

本文用于在一台新服务器上给任意可执行 Shell、Git、Node.js 和浏览器检查的 Agent 配置企业建站能力。它不依赖 Hermes Gateway、飞书渠道或旧会话。

## 1. 需要迁移什么

```text
客户资料
  ↓
company-site-bootstrap Skill：资料收集、补齐 P0、选模板、创建客户仓库
  ↓
website catalog：复制 lumen / forge / nexus 中的一套完整模板
  ↓
company-website Skill：写内容、做页面、验证、桌面验收、Commit、Push
  ↓
客户自己的 Gitee 私有仓库
```

新 Agent 需要以下四类能力：

| 项目 | 用途 | 是否秘密 |
|---|---|---|
| Gitee SSH 密钥 | Clone catalog、Clone/Push 客户仓库 | 私钥是秘密 |
| `GITEE_TOKEN` | 仅在 Agent 需要通过 API 创建客户仓库时使用 | 是 |
| `company-site-bootstrap` | 第一次建站的资料接收、模板选择和项目初始化 | 否 |
| `company-website` | 页面实现、检查、提交和交付 | 否 |
| `website` catalog | 三套模板、生成脚本和验证脚本 | 否（仓库权限另算） |

如果客户仓库由运营人员提前创建，新 Agent 不需要 `GITEE_TOKEN`，SSH 就足够完成 Clone 和 Push。

## 2. SSH 为什么会生效

Git 访问下面的地址时：

```text
git@gitee-website-bot:website-bot/website.git
```

SSH 会先在执行 Agent 的操作系统账户下读取 `~/.ssh/config`，找到 `Host gitee-website-bot`，再把它解析为真实主机 `gitee.com`，并强制使用指定私钥：

```sshconfig
Host gitee-website-bot
    HostName gitee.com
    User git
    IdentityFile ~/.ssh/id_ed25519_gitee_website
    IdentitiesOnly yes
```

完整链路是：

```text
Git SSH URL
  → Host 别名 gitee-website-bot
  → ~/.ssh/config
  → ~/.ssh/id_ed25519_gitee_website 私钥签名
  → Gitee 用账户中登记的 .pub 公钥验签
  → 获得该 Gitee 账户拥有的仓库权限
```

私钥只证明“你是谁”，不能创建不存在的 Gitee 仓库。创建仓库需要 Gitee Token 或由运营人员提前建立空仓库。

SSH 配置必须属于真正执行 Git 的用户。如果 Agent 在容器内运行，宿主机 root 的 `~/.ssh` 不会自动生效；必须把密钥、config 和 known_hosts 安全地提供给容器内的 Agent 用户，并保持私钥权限为 `600`。

## 3. 新服务器基础要求

- Linux 服务器或等价的容器环境；
- Git 和 OpenSSH Client；
- Node.js 22 或更高；
- npm 10 或更高；
- Agent 能读写自己的任务工作区并执行 Shell；
- Agent 能读取用户上传的 PDF、Word、PPT、表格和图片；
- 最终验收阶段能启动本地网页并做浏览器检查。

确认版本：

```bash
git --version
ssh -V
node --version
npm --version
```

## 4. 在新服务器重新配置 Gitee SSH

以下命令必须由“实际运行 Agent 的 Linux 用户”执行，不要先切到其他用户生成密钥。

### 4.1 创建独立密钥

先确认目标文件不存在；不要覆盖其他业务正在使用的密钥：

```bash
test ! -e ~/.ssh/id_ed25519_gitee_website
install -d -m 700 ~/.ssh
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_gitee_website -C "website-builder@gitee"
chmod 600 ~/.ssh/id_ed25519_gitee_website
chmod 644 ~/.ssh/id_ed25519_gitee_website.pub
```

把公钥内容添加到 Gitee 的 `website-bot` 账户：

```bash
cat ~/.ssh/id_ed25519_gitee_website.pub
```

只复制 `.pub` 公钥。私钥 `id_ed25519_gitee_website` 永远留在新服务器，不通过聊天、Git、网盘或旧服务器传输。

### 4.2 合并 SSH config

用编辑器打开 `~/.ssh/config`，合并下面的 Host 段。不要用重定向覆盖整个 config：

```sshconfig
Host gitee-website-bot
    HostName gitee.com
    User git
    IdentityFile ~/.ssh/id_ed25519_gitee_website
    IdentitiesOnly yes
```

然后执行：

```bash
chmod 600 ~/.ssh/config
ssh -T git@gitee-website-bot
```

首次连接需要核对 Gitee 官方公布的主机指纹，再写入 `known_hosts`。不要用 `StrictHostKeyChecking=no` 绕过核验。

### 4.3 验证仓库权限

```bash
git ls-remote git@gitee-website-bot:website-bot/website.git HEAD
```

命令必须输出一个完整 commit，并且无 `Permission denied`。这一步通过，说明 SSH config、私钥、公钥账户和 catalog 仓库权限已经连通。

## 5. 安装 catalog 和两套 Skill

在 Agent 自己的工作区 Clone catalog：

```bash
git clone git@gitee-website-bot:website-bot/website.git /opt/website-agent/catalog
git -C /opt/website-agent/catalog fetch origin --tags
git -C /opt/website-agent/catalog checkout --detach <APPROVED_FULL_COMMIT_OR_TAG>
git -C /opt/website-agent/catalog status --short
```

把 Skill 安装到新 Agent 框架能发现的目录：

```bash
cd /opt/website-agent/catalog
npm run install:agent-skills -- --target /path/to/new-agent/skills
```

安装后应有：

```text
/path/to/new-agent/skills/
├── company-site-bootstrap/
│   ├── SKILL.md
│   └── scripts/create-gitee-repo.mjs
└── company-website/
    ├── SKILL.md
    └── references/
```

如果新 Agent 原生支持 `SKILL.md`，把该目录加入它的 Skill 搜索路径。如果不支持 Skill 自动发现，则在首次建站任务的系统说明中要求它先完整读取：

```text
/path/to/new-agent/skills/company-site-bootstrap/SKILL.md
```

生成客户项目后，再读取项目内的：

```text
skills/company-website/SKILL.md
```

不要把两个 Skill 的全文永久塞进每次提示词；按阶段读取可以减少上下文和误操作。

## 6. 配置非秘密运行参数

在 Agent 可读、普通用户不可随意修改的位置创建 `site-builder.json`：

```json
{
  "catalogUrl": "git@gitee-website-bot:website-bot/website.git",
  "catalogRef": "<APPROVED_FULL_COMMIT_OR_TAG>",
  "catalogVerification": "operator-verified",
  "giteeOwner": "website-bot",
  "giteeSshHost": "gitee-website-bot"
}
```

例如放在：

```text
/etc/website-agent/site-builder.json
```

把绝对路径提供给 Agent 服务：

```bash
export SITE_BUILDER_CONFIG=/etc/website-agent/site-builder.json
```

生产环境应把该环境变量写入 Agent 的服务管理配置，而不是依赖交互式 Shell。`site-builder.json` 不包含 Token、密码、SSH 私钥、飞书凭据或客户资料。

`catalogVerification` 只有在运营方对同一个 `catalogRef` 执行过 catalog 根目录的 `npm run verify` 后才能设置为 `operator-verified`。版本变化后必须重新验证并更新该字段对应的 ref。

## 7. 可选：允许 Agent 创建 Gitee 客户仓库

只有需要自动创建客户私有仓库时，才为 Agent 配置 `GITEE_TOKEN`。Token 必须：

- 属于 `website-bot`；
- 只授予所需的仓库创建权限；
- 存在服务端 Secret 或权限为 `600` 的环境文件中；
- 只通过环境变量注入；
- 不写进 `site-builder.json`、项目 `.env`、Skill、命令参数、日志或 Git。

Skill 中的 `create-gitee-repo.mjs` 会校验 Token 所属账户、拒绝同名仓库，并默认创建私有空仓库。没有 Token 时，让运营人员先建好仓库并把 SSH URL 交给 Agent。

## 8. 新 Agent 的五步建站流程

1. 接收并读取公司资料；资料不足时一次性询问缺失的 P0 信息和公开授权。
2. 根据业务选择 `lumen`、`forge` 或 `nexus`，从固定 catalog 版本创建独立客户项目和客户仓库。
3. 按内容契约填写真实公司数据、业务内容、授权素材和品牌样式。
4. 编辑批次运行 `npm run verify:quick`；最终只运行一次 `npm run verify`，生产发布才改用 `npm run verify:delivery`，然后完成桌面浏览器验收。
5. Commit、Push 到客户仓库，并运行 `npm run verify:handoff` 确认远端 commit 与本地一致。

客户资料、OCR、截图和客户代码不得放进 catalog。每个客户必须拥有自己的项目目录和 Git 仓库。

## 9. 首次冒烟测试

配置完成后依次检查：

```bash
git ls-remote git@gitee-website-bot:website-bot/website.git HEAD
test -r "$SITE_BUILDER_CONFIG"
test -r /path/to/new-agent/skills/company-site-bootstrap/SKILL.md
test -r /path/to/new-agent/skills/company-website/SKILL.md
```

然后向新 Agent 发起一个测试任务，但先只验证资料接收阶段：

```text
我要建立一个新的公司网站。请使用 company-site-bootstrap，先读取我上传的资料，
只汇总已确认事实、资料事实、待确认推断和缺口；P0 未齐全前不要创建项目或远程仓库。
```

确认它不会在资料不足时提前 Clone、建仓库或编造内容后，再进行一次完整测试。

## 10. 交接验收清单

- [ ] 新服务器独立生成了 SSH 私钥，只把 `.pub` 加入 Gitee。
- [ ] `ssh -T git@gitee-website-bot` 能完成账户认证。
- [ ] `git ls-remote` 能读取 catalog HEAD。
- [ ] catalog 固定到运营方批准的完整 commit/tag。
- [ ] 两套 Skill 已进入新 Agent 的搜索路径。
- [ ] `SITE_BUILDER_CONFIG` 指向非秘密配置文件。
- [ ] 如需自动建仓库，`GITEE_TOKEN` 通过 Secret 环境注入且未写入磁盘项目。
- [ ] Agent 能读客户附件、执行 Git/npm、启动网页并做桌面浏览器检查。
- [ ] 测试任务会在 P0 未齐全时停止，不会提前建站。
- [ ] 完整测试的客户代码只进入独立客户仓库，不进入 catalog。

## 11. 不需要迁移的内容

新的非 Hermes Agent 不需要：

- Hermes Gateway 或 s6 服务槽位；
- 飞书机器人 App ID、Secret 或配对记录；
- 当前服务器的会话、memory、workspace 或日志；
- 当前服务器的 SSH 私钥；
- 已删除客户项目的历史资料。

只迁移公开 catalog、两套 Skill、非秘密参数，并在新服务器重新建立凭据即可。
