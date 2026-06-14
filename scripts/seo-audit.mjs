import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const PREVIEW_PORT = process.env.SEO_PREVIEW_PORT || "4173";
const PREVIEW_ORIGIN =
  process.env.SEO_PREVIEW_ORIGIN || `http://localhost:${PREVIEW_PORT}`;

function getArgTarget() {
  const t = process.argv[2];
  if (t !== "frontend" && t !== "backend") {
    throw new Error("Usage: node scripts/seo-audit.mjs <frontend|backend>");
  }
  return t;
}

function getUrl(target) {
  if (target === "frontend") {
    return process.env.SEO_FRONTEND_URL || "https://www.piueducation.org/";
  }
  return process.env.SEO_BACKEND_URL || "https://www.piueducation.org/";
}

function run(cmd, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: true });
    child.on("exit", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

async function getFrontendAuditPaths() {
  try {
    const sitemapPath = resolve(process.cwd(), "public", "sitemap.xml");
    const sitemap = await readFile(sitemapPath, "utf8");
    const matches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)];
    const paths = matches
      .map((match) => {
        try {
          return new URL(match[1]).pathname || "/";
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return paths.length > 0 ? [...new Set(paths)] : ["/"];
  } catch {
    return ["/"];
  }
}

const target = getArgTarget();
const url = getUrl(target);
const outDir = target === "frontend" ? ".lhci/frontend" : ".lhci/backend";

if (target === "frontend") {
  const paths = await getFrontendAuditPaths();
  const previewCommand = `npm run preview -- --port ${PREVIEW_PORT} --strictPort`;

  // Use vite preview so client-side routes from sitemap.xml resolve instead of 404.
  await run("npm", ["run", "build"]);
  await run("npx", [
    "lhci",
    "autorun",
    "--config=./lighthouserc.cjs",
    `--collect.startServerCommand=${JSON.stringify(previewCommand)}`,
    "--collect.startServerReadyPattern=Local:",
    ...paths.map((path) => `--collect.url=${PREVIEW_ORIGIN}${path}`),
    "--collect.numberOfRuns=1",
    "--collect.settings.preset=desktop",
    `--upload.outputDir=${outDir}`,
  ]);
} else {
  await run("npx", [
    "lhci",
    "autorun",
    "--config=./lighthouserc.cjs",
    `--collect.url=${url}`,
    "--collect.numberOfRuns=1",
    "--collect.settings.preset=desktop",
    `--upload.outputDir=${outDir}`,
  ]);
}
