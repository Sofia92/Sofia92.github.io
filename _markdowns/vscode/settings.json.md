---
title: vscode 配置 settings.json
date: 2023-08-16 10:37:59
category: vscode
tags:
  - vscode
---

# vscode 配置文件，实用的配置项

<!-- more -->

```json
{
  "typescript.tsdk": "node_modules\\typescript\\lib",
  "editor.tabSize": 2,
  "html.format.preserveNewLines": false,
  "html-fmt-vscode.attributeQuoteStyle": "preserve",
  "html-fmt-vscode.multilineAttributeThreshold": 1,
  "html-fmt-vscode.voidTagsTrailingSlashStyle": "preserve",
  "javascript.format.semicolons": "insert",
  "javascript.preferences.quoteStyle": "single",
  "[scss]": {
    "editor.defaultFormatter": "vscode.css-language-features"
  },
  "git.confirmSync": false,
  "gitlens.views.remotes.files.layout": "list",
  "workbench.startupEditor": "none",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "explorer.confirmDelete": false,
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "scss.lint.duplicateProperties": "error",
  "scss.lint.boxModel": "warning",
  "scss.lint.emptyRules": "error",
  "scss.lint.float": "error",
  "scss.lint.propertyIgnoredDueToDisplay": "error",
  "scss.lint.zeroUnits": "warning",
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  }
}

```
