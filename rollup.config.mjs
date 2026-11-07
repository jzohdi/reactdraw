import { babel } from "@rollup/plugin-babel";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

export default [
  // The JavaScript: one CommonJS and one ES module bundle.
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
      // tslib's helpers are bundled: the plugin resolves `tslib` itself, and only the peer
      // dependencies (react, react-dom) are external.
      typescript({
        // The root tsconfig.json also covers the example app, which has its own dependencies.
        include: ["src/**/*"],
        // Fail the build on a type error. Without it the plugin only warns.
        noEmitOnError: true,
        // Declarations come from the second config below.
        declaration: false,
        declarationMap: false,
        declarationDir: undefined,
        // Rollup writes the files (with `outDir`, TypeScript 6 asks for an explicit `rootDir`).
        outDir: undefined,
        // dist/ ships no JS source maps.
        sourceMap: false,
      }),
      terser(),
    ],
  },
  // The declarations, bundled into one file per JS entry, each with its declaration map.
  {
    input: "./src/index.ts",
    output: [
      { file: "dist/index.d.ts", format: "es", sourcemap: true },
      { file: "dist/index.esm.d.ts", format: "es", sourcemap: true },
    ],
    plugins: [dts({ sourcemap: true })],
  },
];
