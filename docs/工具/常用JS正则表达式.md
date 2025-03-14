
## 常用 JS 正则表达式

使用说明，再用到的地方 `import { REG_INT } from '@core/utils';`

## REG_INT

- 说明：校验 value 是否是正整数（正整数不包含 0）
- 用法： `REG_INT.test(control.value)`
- 正则：`export const REG_INT = new RegExp(/^\[1-9\]\\d\*$/);`

## REG_INT_INCLUDE_ZERO

- 说明：校验 value 是否是整数（整数包含 0）
- 用法：`REG_INT_INCLUDE_ZERO.test(control.value)`
- 正则：`export const REG_INT_INCLUDE_ZERO = new RegExp(/^\[0-9\]\*$/);`

## REG_ICD_10

- 说明：ICD-10 编码格式校验
- 用法：请直接使用封装类 ICD10Code 判断：ICD10Code.parse(str).valid
- 正则：`/^\[A-Z\]\[0-9\]{2}\\.\[0-9X\]\[0-9\]{1,2}/i`

## REG_PAPER_RECYCLE_LOGIN_VERIFY

- 说明：病案提交管理纸质回收操作校验登录的账号和密码是否合法
- 用法：`REG_PAPER_RECYCLE_LOGIN_VERIFY.test(control.value)`
- 正则：`export const REG_PAPER_RECYCLE_LOGIN_VERIFY = new RegExp(/^\[\\w!@#$%^&\*()\_+-=\]+$/);`

```Typescript
export const REG_INPUT_INTEGER_NUMBER = new RegExp(/[^0-9]/g);    // 输入框限制>=0的整数
export const REG_CHINA_MOBILE = /1\d{10}/;  // 电话号码校验正则fallback
export const REG_SERVER_TIME = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{3})/;  // 服务端同步时间格式
```
