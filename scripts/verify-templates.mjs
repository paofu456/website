import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const catalogDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatesDirectory = path.join(catalogDirectory, "templates");
const templateIds = fs.readdirSync(templatesDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

let failed = false;
for (const templateId of templateIds) {
  const directory = path.join(templatesDirectory, templateId);
  if (!fs.existsSync(path.join(directory, "template.json"))) {
    console.error(`[fail] ${templateId}: missing template.json`);
    failed = true;
    continue;
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
