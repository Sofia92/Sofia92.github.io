
# 从Tslint+Codelyzer迁移到EsLint

Tslint与Codelyzer因重复造轮子等原因停止维护，目前这两个项目的功能已经作为插件迁移到Eslint项目上。



要迁移到EsLint只需要进行如下的步骤：

1. 删除项目目录下的`tslint.json`

2. 修改`package.json`中`lint-staged`部分

   ```json
     "lint-staged": {
       "**/*.ts": "tslint -c ./src/tslint.json"
     }
   ```

   修改为

   ```json
     "lint-staged": {
       "**/*.ts": "eslint"
     }
   ```

3. 删除`package.json`中对`tslint`以及`codelyzer`的依赖。

4. 安装npm包：

   ```
   npm install eslint eslint-plugin-rxjs @typescript-eslint/eslint-plugin @typescript-eslint/parser @sy/eslint-config eslint-config-prettier --save-dev
   ```

5. 在项目目录下创建文件`tsconfig.eslint.json`，并输入以下内容

   ```
   {
       "extends": "./tsconfig.json",
       "include": [
           // adjust "includes" to what makes sense for you and your project
           "src/**/*.ts",
           "e2e/**/*.ts"
       ]
   }
   ```

6. 在项目目录下创建文件`.eslintrc.json`，并输入以下内容

   ```json
   {
     "root": true,
     "ignorePatterns": [
       "projects/**/*"
     ],
     "overrides": [
       {
         "files": [
           "*.ts"
         ],
         "parserOptions": {
           "project": [
             "tsconfig.eslint.json"
           ]
         },
         "extends": [
           "eslint:recommended",
           "plugin:@typescript-eslint/recommended",
           "plugin:@angular-eslint/recommended",
           "plugin:@angular-eslint/template/process-inline-templates",
           "@sy/eslint-config"
         ],
         "rules": {
           "@angular-eslint/directive-selector": [
             "error",
             {
               "type": "attribute",
               "prefix": "app",
               "style": "camelCase"
             }
           ],
           "@angular-eslint/component-selector": [
             "error",
             {
               "type": "element",
               "prefix": "app",
               "style": "kebab-case"
             }
           ]
         }
       },
       {
         "files": [
           "*.html"
         ],
         "extends": [
           "plugin:@angular-eslint/template/recommended"
         ],
         "rules": {}
       }
     ]
   }
   ```

7. 执行`ng lint`即可

