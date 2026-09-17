import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const catalogDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(catalogDirectory, "agent-skills");
const args = process.argv.slice(2);

function readOption(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

const targetInput = readOption("--target");
const force = args.includes("--force");

if (!targetInput || targetInput.startsWith("--")) {
  console.error("Usage: npm run install:agent-skills -- --target <agent-skills-directory> [--force]");
  process.exit(1);
}

const targetDirectory = path.resolve(process.cwd(), targetInput);
const relativeToSource = path.relative(sourceDirectory, targetDirectory);
if (relativeToSource === "" || (!relativeToSource.startsWith("..") && !path.isAbsolute(relativeToSource))) {
  console.error("Target must be outside the catalog's agent-skills source directory.");
  process.exit(1);
}

const skills = fs.readdirSync(sourceDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(sourceDirectory, entry.name, "SKILL.md")))
  .map((entry) => entry.name)
  .sort();

const existing = skills.filter((skill) => fs.existsSync(path.join(targetDirectory, skill)));
if (existing.length > 0 && !force) {
  console.error(`Refusing to overwrite existing skills: ${existing.join(", ")}. Re-run with --force to replace them.`);
  process.exit(1);
}

fs.mkdirSync(targetDirectory, { recursive: true });
for (const skill of skills) {
  const source = path.join(sourceDirectory, skill);
  const target = path.join(targetDirectory, skill);
  if (force && fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true, force });
  console.log(`Installed ${skill} -> ${target}`);
}

console.log(`Installed ${skills.length} Agent skills.`);
