import process from "node:process";

const args = process.argv.slice(2);

function option(name) {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`);
  return value;
}

function validSlug(value) {
  return /^[a-z0-9][a-z0-9._-]*$/i.test(value);
}

const owner = option("--owner") ?? process.env.GITEE_OWNER;
const repository = option("--repo");
const sshHost = option("--ssh-host") ?? process.env.GITEE_SSH_HOST ?? "gitee.com";
const description = option("--description") ?? "Customer company website";
const dryRun = args.includes("--dry-run");
const checkAuth = args.includes("--check-auth");

if (!owner || !repository || !validSlug(owner) || !validSlug(repository)) {
  console.error("Usage: node create-gitee-repo.mjs --owner <owner> --repo <repo> [--ssh-host <host-alias>] [--description <text>] [--check-auth|--dry-run]");
  process.exit(1);
}

const sshUrl = `git@${sshHost}:${owner}/${repository}.git`;

if (dryRun) {
  console.log(`[dry-run] Would verify Gitee owner ${owner}, refuse an existing ${owner}/${repository}, and create a private repository.`);
  console.log(`[dry-run] Customer SSH URL: ${sshUrl}`);
  process.exit(0);
}

const token = process.env.GITEE_TOKEN;
if (!token) {
  console.error("GITEE_TOKEN is not present in the process environment.");
  process.exit(1);
}

const apiBase = "https://gitee.com/api/v5";
const headers = {
  Accept: "application/json",
  Authorization: `token ${token}`,
  "Content-Type": "application/json",
};

async function request(path, init = {}) {
  return fetch(`${apiBase}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(20000),
  });
}

try {
  const identityResponse = await request("/user");
  if (!identityResponse.ok) throw new Error(`Gitee identity check failed with HTTP ${identityResponse.status}`);
  const identity = await identityResponse.json();
  if (identity.login !== owner) {
    throw new Error(`GITEE_TOKEN belongs to ${identity.login ?? "an unknown account"}, not ${owner}`);
  }
  if (checkAuth) {
    console.log(`Gitee token owner verified: ${identity.login}`);
    process.exit(0);
  }

  const existingResponse = await request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`);
  if (existingResponse.ok) throw new Error(`Repository already exists: ${owner}/${repository}`);
  if (existingResponse.status !== 404) {
    throw new Error(`Repository collision check failed with HTTP ${existingResponse.status}`);
  }

  const createResponse = await request("/user/repos", {
    method: "POST",
    body: JSON.stringify({ name: repository, description, private: true }),
  });
  if (!createResponse.ok) throw new Error(`Repository creation failed with HTTP ${createResponse.status}`);

  const created = await createResponse.json();
  const fullName = created.full_name ?? `${created.namespace?.path ?? ""}/${created.path ?? created.name ?? ""}`;
  if (fullName.toLowerCase() !== `${owner}/${repository}`.toLowerCase()) {
    throw new Error(`Gitee returned an unexpected repository: ${fullName}`);
  }

  console.log(`Created private Gitee repository: ${fullName}`);
  console.log(`Customer SSH URL: ${sshUrl}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
