import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const catalogDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatesDirectory = path.join(catalogDirectory, "templates");
const args = process.argv.slice(2);

function isInside(directory, candidate) {
  const relative = path.relative(directory, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function removeOwnedStagingDirectory(directory, marker) {
  if (!fs.existsSync(directory) || !fs.existsSync(marker)) return;
  fs.rmSync(directory, { recursive: true, force: true });
}

function readOption(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const templateId = readOption("--template");
const targetInput = readOption("--target");
const available = fs.readdirSync(templatesDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(templatesDirectory, entry.name, "template.json")))
  .map((entry) => entry.name)
  .sort();

if (!templateId || !targetInput) {
  console.error(`Usage: npm run create-site -- --template <${available.join("|")}> --target <directory>`);
  process.exit(1);
}

if (!available.includes(templateId)) {
  console.error(`Unknown template "${templateId}". Available: ${available.join(", ")}`);
  process.exit(1);
}

const source = path.join(templatesDirectory, templateId);
const target = path.resolve(catalogDirectory, targetInput);
if (isInside(catalogDirectory, target)) {
  console.error("Target must be outside the catalog and its templates directory.");
  process.exit(1);
}

if (fs.existsSync(target) && (!fs.statSync(target).isDirectory() || fs.readdirSync(target).length > 0)) {
  console.error(`Target already exists and is not an empty directory: ${target}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(source, "template.json"), "utf8"));
const targetParent = path.dirname(target);
const targetName = path.basename(target);
fs.mkdirSync(targetParent, { recursive: true });

const staging = fs.mkdtempSync(path.join(targetParent, `.${targetName}.create-site-`));
const marker = path.join(staging, ".create-site-staging.json");
fs.writeFileSync(marker, JSON.stringify({ target, templateId, pid: process.pid }), "utf8");

try {
  fs.cpSync(source, staging, {
    recursive: true,
    filter: (entry) => !["node_modules", "dist", ".astro"].includes(path.basename(entry)),
  });

  const requiredFiles = [
    "AGENTS.md",
    "README.md",
    "package.json",
    "package-lock.json",
    "site.config.ts",
    "template.json",
    path.join("skills", "company-website", "SKILL.md"),
  ];
  const missingFiles = requiredFiles.filter((file) => !fs.existsSync(path.join(staging, file)));
  if (missingFiles.length > 0) {
    throw new Error(`Copied template is incomplete; missing: ${missingFiles.join(", ")}`);
  }

  if (fs.existsSync(target)) fs.rmdirSync(target);
  fs.renameSync(staging, target);
  fs.rmSync(path.join(target, ".create-site-staging.json"));
} catch (error) {
  removeOwnedStagingDirectory(staging, marker);
  console.error(`[create-site] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

console.log(`Created ${manifest.name} in ${target}`);
console.log("Next: npm ci --include=optional, then npm run dev");
