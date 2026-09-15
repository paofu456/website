import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const catalogDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templatesDirectory = path.join(catalogDirectory, "templates");
const args = process.argv.slice(2);

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
if (target === catalogDirectory || target.startsWith(`${templatesDirectory}${path.sep}`)) {
  console.error("Target must be outside the catalog and its templates directory.");
  process.exit(1);
}

if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
  console.error(`Target is not empty: ${target}`);
  process.exit(1);
}

fs.mkdirSync(target, { recursive: true });
fs.cpSync(source, target, {
  recursive: true,
  filter: (entry) => !["node_modules", "dist", ".astro"].includes(path.basename(entry)),
});

const manifest = JSON.parse(fs.readFileSync(path.join(source, "template.json"), "utf8"));
console.log(`Created ${manifest.name} in ${target}`);
console.log("Next: npm install, then npm run dev");
