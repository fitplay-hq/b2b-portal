import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(__dirname);

async function main() {
  try {
    console.log("📦 Starting Chromium pack build...");

    // Resolve the installed @sparticuz/chromium entry file
    const chromiumResolved = import.meta.resolve("@sparticuz/chromium");

    // Convert file:// URL to filesystem path
    const chromiumEntry = chromiumResolved.replace(/^file:\/\//, "");

    // Walk up to the package root
    // build/esm/index.js -> build/esm -> build -> package root
    const chromiumPkgRoot = dirname(dirname(dirname(chromiumEntry)));
    const binDir = join(chromiumPkgRoot, "bin");

    if (!existsSync(binDir)) {
      console.log("⚠️  Chromium bin directory not found, skipping archive creation");
      return;
    }

    const publicDir = join(projectRoot, "public");
    const outputTar = join(publicDir, "chromium-pack.tar");

    console.log("📦 Creating chromium-pack.tar");
    console.log("   Source:", binDir);
    console.log("   Output:", outputTar);

    execSync(
      `mkdir -p "${publicDir}" && tar -cf "${outputTar}" -C "${binDir}" .`,
      {
        stdio: "inherit",
        cwd: projectRoot,
      }
    );

    console.log("✅ Chromium archive created successfully");
  } catch (err) {
    console.error("❌ Failed to create Chromium archive:", err.message);
    console.log("⚠️  This is not critical for local development");
    process.exit(0);
  }
}

main();
