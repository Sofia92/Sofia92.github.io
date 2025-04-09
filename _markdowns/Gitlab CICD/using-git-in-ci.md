---
title: using git in gitlab-ci
date: 2021-08-17 18:59:37
category: DevOps
tags:
  - DevOps
  - GitLab CICD
  - GitLab CICD git
---

# 记录在 gitlab-ci 里面运行 Git

<!-- more -->

```yml
documentation:
  stage: documentation
  image: node:12
  before_script:
    - mkdir -pvm 0700 .ssh
    - echo "$SSH_PRIVATE_KEY" > .ssh/id_rsa
    - chmod 0400 .ssh/id_rsa
    - ssh-keyscan -t rsa git.sy >> .ssh/known_hosts
    - git config --global user.name "${GITLAB_USER_NAME}"
    - git config --global user.email "${GITLAB_USER_EMAIL}"
    - git clone http://gitlab-ci-token:${CI_JOB_TOKEN}@git.sy/Apollo/emr/front/emr-app-doc.git docApp
  script:
    - rm package-lock.json || true
    - rm .gitignore || true
    - npm i @compodoc/compodoc --registry https://registry.npm.taobao.org
    - npm i typescript --registry https://registry.npm.taobao.org
    - npx --max_old_space_size=8192 compodoc -p tsconfig.json

    - rm -rf docApp/documentation
    - cp -R documentation/ docApp/
    - cd docApp
    - git remote set-url --push origin git@git.sy:Apollo/emr/front/emr-app-doc.git
    - git remote -v
    - git add .
    - git commit -am "CI Runner runner by ${GITLAB_USER_NAME} in job ${$CI_BUILD_ID}" || true
    - git push http://gitlab-ci-token:${GITLAB_TOKEN}@git.sy/Apollo/emr/front/emr-app-doc.git HEAD:master
```
