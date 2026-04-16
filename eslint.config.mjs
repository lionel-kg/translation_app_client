import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import { rules } from "eslint-plugin-react-hooks";

const eslintConfig = defineConfig([
  ...nextVitals,
  (rules["exhaustive-deps"] = "warn"),
  (rules["rules-of-hooks"] = "error"),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
