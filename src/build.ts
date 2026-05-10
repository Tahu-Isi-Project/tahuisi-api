console.log("Starting build process...");

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
  minify: true,
  external: ["sharp"],
});

console.log("Build complete!");