module.exports = {
  globals: {
    React: true
  },
  plugins: [
    "@stylistic",
    "next-on-pages"
  ],
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:@stylistic/recommended-extends",
    "plugin:next-on-pages/recommended"
  ],
  rules: {
    "next-on-pages/no-unsupported-configs": "warn",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "@stylistic/no-mixed-operators": "off",
    "@stylistic/quote-props": [
      "error",
      "as-needed"
    ]
  }
};
