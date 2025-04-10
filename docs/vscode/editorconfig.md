
# vscode 配置文件，实用的配置项

<!-- more -->

# .editorconfig

https://editorconfig.org/

.editorconfig 文件 example

```bash
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*]
indent_style = space
indent_size = 4
insert_final_newline = true
trim_trailing_whitespace = true
end_of_line = lf
charset = utf-8

# Docstrings and comments use max_line_length = 79
[*.py]
max_line_length = 119

# Use 2 spaces for the HTML files
[*.html]
indent_size = 2

# The JSON files contain newlines inconsistently
[*.json]
indent_size = 2
insert_final_newline = ignore

[**/admin/js/vendor/**]
indent_style = ignore
indent_size = ignore

# Minified JavaScript files shouldn't be changed
[**.min.js]
indent_style = ignore
insert_final_newline = ignore

# Makefiles always use tabs for indentation
[Makefile]
indent_style = tab

# Batch files use tabs for indentation
[*.bat]
indent_style = tab

[docs/**.txt]
max_line_length = 79

[*.yml]
indent_size = 2
```

## .editorconfig 支持的属性配置

Note that not all properties are supported by every plugin. The wiki has a [complete list of properties](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties).
