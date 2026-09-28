import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const catalogDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatesDirectory = path.join(catalogDirectory, "templates");
const portableCompanyWebsiteSkill = path.join(catalogDirectory, "agent-skills", "company-website");
const forbiddenCatalogWorkspaces = [".tmp", "materials"];
const templateIds = fs.readdirSync(templatesDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let failed = false;

for (const relative of forbiddenCatalogWorkspaces) {
  const candidate = path.join(catalogDirectory, relative);
  if (fs.existsSync(candidate)) {
    console.error(`[fail] catalog contains forbidden customer workspace: ${relative}`);
    failed = true;
  }
}

function listFiles(directory, prefix = "") {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(prefix, entry.name);
    return entry.isDirectory()
      ? listFiles(path.join(directory, entry.name), relative)
      : [relative];
  }).sort();
}

function skillsMatch(left, right) {
  if (!fs.existsSync(left) || !fs.existsSync(right)) return false;
  const leftFiles = listFiles(left);
  const rightFiles = listFiles(right);
  return leftFiles.length === rightFiles.length
    && leftFiles.every((file, index) => file === rightFiles[index])
    && leftFiles.every((file) => fs.readFileSync(path.join(left, file)).equals(fs.readFileSync(path.join(right, file))));
}

for (const templateId of templateIds) {
  const directory = path.join(templatesDirectory, templateId);
  if (!fs.existsSync(path.join(directory, "template.json"))) {
    console.error(`[fail] ${templateId}: missing template.json`);
    failed = true;
    continue;
  }

  if (!fs.existsSync(path.join(directory, ".gitignore"))) {
    console.error(`[fail] ${templateId}: missing .gitignore`);
    failed = true;
  }

  const packageManifest = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8"));
  if (packageManifest.scripts?.["verify:quick"] !== "astro check") {
    console.error(`[fail] ${templateId}: missing no-build verify:quick package script`);
    failed = true;
  }
  if (packageManifest.scripts?.verify !== "npm run build && node scripts/verify.mjs") {
    console.error(`[fail] ${templateId}: verify must perform exactly one build before static checks`);
    failed = true;
  }
  if (packageManifest.scripts?.["verify:delivery"] !== "npm run build && node scripts/verify.mjs --delivery") {
    console.error(`[fail] ${templateId}: verify:delivery must perform exactly one build before delivery checks`);
    failed = true;
  }
  if (packageManifest.scripts?.["verify:handoff"] !== "node scripts/verify-handoff.mjs") {
    console.error(`[fail] ${templateId}: missing verify:handoff package script`);
    failed = true;
  }
  if (!fs.existsSync(path.join(directory, "scripts", "verify-handoff.mjs"))) {
    console.error(`[fail] ${templateId}: missing scripts/verify-handoff.mjs`);
    failed = true;
  }

  const templateSkill = path.join(directory, "skills", "company-website");
  if (!skillsMatch(portableCompanyWebsiteSkill, templateSkill)) {
    console.error(`[fail] ${templateId}: company-website skill differs from agent-skills/company-website`);
    failed = true;
  }

  console.log(`\n=== Verifying ${templateId} ===`);
  const npmCli = process.env.npm_execpath;
  const result = npmCli
    ? spawnSync(process.execPath, [npmCli, "run", "verify"], { cwd: directory, stdio: "inherit" })
    : spawnSync("npm", ["run", "verify"], { cwd: directory, stdio: "inherit", shell: process.platform === "win32" });
  if (result.error) console.error(`[fail] ${templateId}: ${result.error.message}`);
  if (result.status !== 0) failed = true;
}

if (failed) process.exit(1);
console.log(`\n[verify] ${templateIds.length} templates passed.`);
