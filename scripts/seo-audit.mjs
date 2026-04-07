import { spawn } from "node:child_process";

function getArgTarget() {
  const t = process.argv[2];
  if (t !== "frontend" && t !== "backend") {
    throw new Error('Usage: node scripts/seo-audit.mjs <frontend|backend>');
  }
  return t;
}

function getUrl(target) {
  if (target === "frontend") {
    return process.env.SEO_FRONTEND_URL || "https://www.piueducation.org/";
  }
  // SEO audits are intended for HTML pages. If your backend is API-only (JSON),
  // point this to a human-facing page (docs/landing) instead of the API root.
  return process.env.SEO_BACKEND_URL || "https://www.piueducation.org/";
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: true });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

const target = getArgTarget();
const url = getUrl(target);
const outDir = target === "frontend" ? ".lhci/frontend" : ".lhci/backend";

if (target === "frontend") {
  // For frontend, audit the built SPA directly (no dependency on dev server binding/loopback).
  await run("npm", ["run", "build"]);
  await run("npx", [
    "lhci",
    "autorun",
    "--collect.staticDistDir=dist",
    "--collect.url=/",
    "--collect.numberOfRuns=1",
    "--collect.settings.preset=desktop",
    "--upload.target=filesystem",
    `--upload.outputDir=${outDir}`,
  ]);
} else {
  await run("npx", [
    "lhci",
    "autorun",
    `--collect.url=${url}`,
    "--collect.numberOfRuns=1",
    "--collect.settings.preset=desktop",
    "--upload.target=filesystem",
    `--upload.outputDir=${outDir}`,
  ]);
}

