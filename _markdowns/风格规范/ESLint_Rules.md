---
title: ESLint rules
category: CodeQuality
tags:
  - 前端代码检查ESLint配置
  - ESLint
---

# ESLint 规则

```Javascript
module.exports = {
  plugins: ["rxjs"],
  extends: ["prettier"],
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      // 0105
      {
        selector: "interface",
        format: ["PascalCase"],
        prefix: ["I"],
      },
      // 0102
      {
        selector: ["class", "enum"],
        format: ["PascalCase"],
      },
      // 0103
      {
        selector: [
          "function",
          "classMethod",
          "variable",
          "accessor",
          "typeProperty",
          "parameterProperty",
        ],
        format: ["camelCase"],
      },
      // 0104
      {
        selector: ["variable"],
        modifiers: ["const", "exported"],
        format: ["UPPER_CASE"],
      },
    ],
    "@typescript-eslint/naming-convention": [
      "warn",
      // 106
      {
        selector: ["classProperty"],
        modifiers: ["private"],
        leadingUnderscore: "require",
        format: ["camelCase"],
      },
      {
        selector: ["classProperty"],
        modifiers: ["protected"],
        leadingUnderscore: "require",
        format: ["camelCase"],
      },
      // 107 No
    ],
    // 108
    "rxjs/finnish": "warn",
    // 201
    "one-var": ["error", "never"],
    // 202
    "@typescript-eslint/explicit-function-return-type": "error",
    // 203
    "@typescript-eslint/explicit-member-accessibility": "error",
    // 204 no

    // 301
    indent: ["error", 2],
    // 401 402 403
    "brace-style": ["error", "1tbs"],
    semi: "error",
    "max-len": [
      "error",
      {
        code: 120,
        tabWidth: 2,
      },
    ],
    "newline-per-chained-call": "error",
    // 501
    "no-inner-declarations": "warn",
    // 502
    "max-lines-per-function": [
      "warn",
      {
        max: 75,
      },
    ],
    // 601 602
    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: [
          // Index signature
          "signature",
          "call-signature",

          // Static Fields
          "public-static-field",
          "protected-static-field",
          "private-static-field",
          "#private-static-field",
          // Static Methods
          "public-static-method",
          "protected-static-method",
          "private-static-method",
          "#private-static-method",

          // Static initialization
          "static-initialization",

          "public-decorated-field",
          "protected-decorated-field",
          "private-decorated-field",

          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",
          "#private-instance-field",

          "public-abstract-field",
          "protected-abstract-field",

          "public-field",
          "protected-field",
          "private-field",
          "#private-field",

          "static-field",
          "instance-field",
          "abstract-field",

          "decorated-field",

          "field",

          // Getters
          "public-static-get",
          "protected-static-get",
          "private-static-get",
          "#private-static-get",

          "public-decorated-get",
          "protected-decorated-get",
          "private-decorated-get",

          "public-instance-get",
          "protected-instance-get",
          "private-instance-get",
          "#private-instance-get",

          "public-abstract-get",
          "protected-abstract-get",

          "public-get",
          "protected-get",
          "private-get",
          "#private-get",

          "static-get",
          "instance-get",
          "abstract-get",

          "decorated-get",

          "get",

          // Setters
          "public-static-set",
          "protected-static-set",
          "private-static-set",
          "#private-static-set",

          "public-decorated-set",
          "protected-decorated-set",
          "private-decorated-set",

          "public-instance-set",
          "protected-instance-set",
          "private-instance-set",
          "#private-instance-set",

          "public-abstract-set",
          "protected-abstract-set",

          "public-set",
          "protected-set",
          "private-set",
          "#private-set",

          "static-set",
          "instance-set",
          "abstract-set",

          "decorated-set",

          "set",

          // Constructors
          "public-constructor",
          "protected-constructor",
          "private-constructor",
          "constructor",

          // Methods

          "public-decorated-method",
          "protected-decorated-method",
          "private-decorated-method",

          "public-instance-method",
          "protected-instance-method",
          "private-instance-method",
          "#private-instance-method",

          "public-abstract-method",
          "protected-abstract-method",

          "public-method",
          "protected-method",
          "private-method",
          "#private-method",

          "static-method",
          "instance-method",
          "abstract-method",

          "decorated-method",

          "method",
        ],
      },
    ],
    "@typescript-eslint/no-inferrable-types": 0,
    // 603
    "padding-line-between-statements": [
      "warn",
      {
        blankLine: "always",
        prev: "block-like",
        next: "*",
      },
    ],

    // 701

    // 708
    "max-lines": [
      "warn",
      {
        max: 400,
      },
    ],

    curly: "error",

    "@typescript-eslint/object-literal-sort-keys": 0,
    "@typescript-eslint/no-string-literal": 0,
    "@typescript-eslint/ordered-imports": 0,
    "max-classes-per-file": ["error", 2],
    "@typescript-eslint/no-bitwise": 0,
    "@typescript-eslint/trailing-comma": 0,

    // angular
    "@angular-eslint/no-output-rename": "error",
    "@angular-eslint/no-output-on-prefix": "error",
    "@angular-eslint/no-input-rename": "error",
    "@angular-eslint/use-lifecycle-interface": "error",
    "@angular-eslint/component-class-suffix": [
      "error",
      { suffixes: ["Component"] },
    ],
    "@angular-eslint/directive-class-suffix": [
      "error",
      { suffixes: ["Directive"] },
    ],
  },
};
```