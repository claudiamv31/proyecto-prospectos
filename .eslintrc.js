module.exports = {
  plugins: ["prettier"],
  extends: ["plugin:prettier/recommended"],
  env: {
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
};
