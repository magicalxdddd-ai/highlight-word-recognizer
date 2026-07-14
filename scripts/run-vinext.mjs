import { spawn } from "node:child_process";

const command = process.argv[2] ?? "dev";
const env = { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" };

if (process.platform === "win32") {
  const seen = new Set();
  for (const key of Object.keys(env)) {
    const normalized = key.toLowerCase();
    if (seen.has(normalized)) {
      delete env[key];
    } else {
      seen.add(normalized);
    }
  }
}

const child = spawn("vinext", [command], {
  env,
  shell: process.platform === "win32",
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
