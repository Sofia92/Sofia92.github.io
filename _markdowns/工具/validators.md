---
 title: validators
 category: Tools
---

## validators

### CommonValidators

```Typescript
enum IDTypeCode {
  MainLandId = '01',
  HongkongOrMacouPassport = '06',
  TaiwanPassport = '07',
  TaiwanId = '08',
  HongkongId = '09',
  MacouId = '10',
}

export class CommonValidators {
  public validateIdNo(idNo: string, typeCode: string): string {
    if (typeCode === IDTypeCode.HongkongId) {
      return this.validateHonkongId(idNo);
    }
    if (typeCode === IDTypeCode.MacouId) {
      return this.validateMacouId(idNo);
    }
    if (typeCode === IDTypeCode.TaiwanId) {
      return this.validateTaiwanId(idNo);
    }
    if (typeCode === IDTypeCode.MainLandId) {
      return this.validateMainLandId(idNo);
    }
    if (typeCode === IDTypeCode.HongkongOrMacouPassport) {
      return this.validateHongkongMOrMacouPassport(idNo);
    }
    if (typeCode === IDTypeCode.TaiwanPassport) {
      return this.validateTaiwanPassportId(idNo);
    }
    // 其他证件不校验，认为正确
    return '';
  }

  public validateHonkongId(idNo: string): string {
    return /^[A-Z][0-9]{6}(\([0-9A-Z]\)|（[0-9A-Z]）)$/.test(idNo)
      ? ''
      : '香港身份证格式错误';
  }

  public validateMacouId(idNo: string): string {
    return /^[0-9]{7}(\([0-9]\)|（[0-9]）)$/.test(idNo)
      ? ''
      : '澳门身份证格式错误';
  }

  public validateTaiwanId(idNo: string): string {
    return /^[A-Z][0-9]{9}$/.test(idNo) ? '' : '台湾身份证格式错误';
  }

  public validateHongkongMOrMacouPassport(idNo: string): string {
    return /^[HM][0-9]{8}$/.test(idNo) ? '' : '港澳通行证格式错误';
  }

  public validateTaiwanPassportId(idNo: string): string {
    return /^[0-9]{8}$/.test(idNo) ? '' : '台湾通行证格式错误';
  }

  public validateMainLandId(idNo: string): string {
    return /^[0-9]{17}[0-9X]$/.test(idNo) || /^[0-9]{15}$/.test(idNo)
      ? ''
      : '大陆身份证格式错误';
  }

  public validatePostalCode(code: string): string {
    return /^[0-9]{6}$/.test(code) ? '' : '邮政编码格式错误';
  }
}

```
