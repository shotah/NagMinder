module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
    node: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "script"
  },
  globals: {
    chrome: "readonly"
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
    "valid-jsdoc": "warn",
    "require-jsdoc": ["off", {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: false,
        ClassDeclaration: false,
        ArrowFunctionExpression: false,
        FunctionExpression: false
      }
    }]
  },
  overrides: [
    {
      // Node.js scripts
      files: ["scripts/**/*.js", "test/**/*.js", ".eslintrc.js"],
      env: {
        node: true,
        browser: false,
        webextensions: false
      },
      rules: {
        "require-jsdoc": "off"
      }
    }
  ]
};
