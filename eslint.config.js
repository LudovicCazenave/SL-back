import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: {...globals.node} }},
  pluginJs.configs.recommended,
  {
    rules: {
      "semi": "error",
      "indent": ["error", 2],
      "no-unused-vars": "off",
      "no-undef": "off",
    }
  }
];