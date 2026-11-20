import eslint from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import path from "node:path";
import tseslint from "typescript-eslint";

export default defineConfig(
  includeIgnoreFile(path.join(import.meta.dirname, ".gitignore")),
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    // For typed linting.
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintReact.configs["recommended-typescript"],
);
