import { createRequire } from "node:module";
import { babel } from "@rollup/plugin-babel";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

// rollup-plugin-ts (deprecated, kept for now) is loaded through its CommonJS build: its ES module
// build imports browserslist-generator's, which uses `import … assert { type: "json" }`, a syntax
// Node 22 and later no longer parse.
const typescript = createRequire(import.meta.url)("rollup-plugin-ts");

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        // Rollup 2's defaults, which Rollup 3 changed: keep the `__esModule` marker and the
        // `"default" in module` interop for `import React from "react"`, so the CJS build
        // behaves as before.
        esModule: true,
        interop: "compat",
      },
      {
        file: "dist/index.esm.js",
        format: "es",
        exports: "named",
      },
    ],
    plugins: [
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
      }),
      external(),
      resolve({ extensions: [".js", ".ts"] }),
      typescript({
        sourceMap: true,
        declaration: true,
        declarationMap: true,
      }),
      terser(),
    ],
  },
];
