import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
            rollupTypes: true,
            tsconfigPath: "./tsconfig.build.json",
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "ReactDraw",
            formats: ["es", "cjs"],
            fileName: (format) =>
                `index.${format === "es" ? "esm" : format}.js`,
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
        sourcemap: true,
        minify: "terser",
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
});
