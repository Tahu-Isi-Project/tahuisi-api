import { mkdir } from "node:fs/promises";
import path from "node:path";
import { readdirSync, existsSync } from "node:fs";
import { $ } from "bun";

const root = process.cwd();
const domainRoot = path.join(root, "src/domain");

console.log("Starting build process...");

const domains = readdirSync(domainRoot, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

for (const domain of domains) {
  const schemaPath = `./src/domain/${domain}/db/schema.ts`;
  
  const outPathRelative = `./migrations/${domain}`;
  const outPathAbsolute = path.join(root, "migrations", domain);

  if (existsSync(schemaPath)) {
    console.log(`- Checking/Generating migrations for: ${domain}`);
    await mkdir(outPathAbsolute, { recursive: true });
    await $`bunx drizzle-kit generate --name ${domain}_init --schema ${schemaPath} --out ${outPathRelative} --dialect sqlite`;
  }
}

console.log("Bundling code...");
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
  minify: true,
});

console.log("Build complete!");