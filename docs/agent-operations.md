# 多 Agent 建站操作流程

本仓库只维护三套通用 Astro + Tailwind 基座，不保存任何客户资料或客户页面。

## 仓库关系

```text
运营方维护的统一基座仓库 website
          ↓ 每台 Agent 服务器 Clone
固定批准的 commit/tag，并验证基座
          ↓ 读取该 Agent 手中的客户资料
选择 lumen / forge / nexus，create-site
          ↓ 在基座目录之外生成
一家客户一个独立项目、一个独立 Git 仓库
          ↓
company-website Skill 完成内容、页面和验收
```

十个 Agent 可以 Clone 同一个只读基座；十家公司必须产生十个互不相干的客户仓库。客户项目不要求与基座保持 Git Fork 关系。

## 首次准备 Agent

将本仓库 `agent-skills/` 中的两个 Skill 安装到 Agent 的技能目录：

```bash
npm run install:agent-skills -- --target <agent-skills-directory>
```

安装内容：

- `company-site-bootstrap`：定位或 Clone 基座、固定版本、消化资料、选模板并创建客户项目；
- `company-website`：在客户项目中替换真实内容、修改页面、验证并交付。

安装脚本只复制 Skill 文件，不读取或写入 Git 凭据、SSH 密钥、Token 或 Agent 配置。

## 每个客户任务

1. 为任务准备独立工作目录，例如 `<jobs>/<client-slug>/`，把原始资料放入其中；不要放进基座。
2. Agent Clone 或复用本机的 `website` catalog，检出运营方批准的 commit/tag，运行 `npm ci` 和 `npm run verify`。
3. 按 `docs/onboarding.md` 消化资料、补齐 P0 输入，并选择一个模板。
4. 从 catalog 运行：

   ```bash
   npm run create-site -- --template <lumen|forge|nexus> --target <absolute-customer-project-path>
   ```

5. 把允许进入工作区的资料和内部记录放到客户项目的 `materials/`、`notes/`；`materials/` 默认不进入 Git。
6. 进入客户项目，读取 `AGENTS.md` 和 `skills/company-website/SKILL.md`，继续做到完整 MVP，不能停在复制模板。
7. 通过普通验证，执行并解释交付验证；只报告实际完成的视觉检查。
8. 在客户项目内初始化 Git，并推送到该客户自己的空仓库。客户仓库的 `origin` 不能指向基座仓库。

## 变更归属

| 变更 | 提交位置 |
|---|---|
| 某公司的内容、图片、页面和主题 | 该公司的独立仓库 |
| 三套模板都应获得的通用修复 | 基座仓库的独立分支/合并请求 |
| 原始画册、内部文件、凭据 | 不提交 Git |

不自动创建 Gitee Fork，也不在仓库内保存共享账号。服务器凭据由运行环境单独配置，仓库地址作为任务输入提供。
