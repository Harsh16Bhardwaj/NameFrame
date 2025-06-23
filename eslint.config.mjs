import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1) include Next.js defaults
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // allow unescaped ' and " in JSX without build failure
      "react/no-unescaped-entities": "warn",

      // unused vars/imports become warnings; underscore‑prefixed args/vars are ignored
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true
        }
      ],

      // allow plain <img> tags without breaking build
      "@next/next/no-img-element": "warn",

      // permit use of `any` type without error
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
