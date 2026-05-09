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

const migrationTasks = domains.map(async (domain) => {
  const schemaPath = `./src/domain/${domain}/db/schema.ts`;
  const outPathRelative = `./migrations/${domain}`;
  const outPathAbsolute = path.join(root, "migrations", domain);

  if (existsSync(schemaPath)) {
    console.log(`- Checking/Generating migrations for: ${domain}`);
    await mkdir(outPathAbsolute, { recursive: true });
    return $`bunx drizzle-kit generate --name ${domain}_init --schema ${schemaPath} --out ${outPathRelative} --dialect sqlite`;
  }
  
  return Promise.resolve(); // Return empty task if no schema exists
});

await Promise.all(migrationTasks);

console.log("Bundling code...");
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
  minify: true,
  external: ["sharp"],
});

console.log("Build complete!");