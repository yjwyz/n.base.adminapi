export class UtilsCommon {
  // todo 是否存在中文
  static includeChinese(str: string): boolean {
    const pattern_Ch = new RegExp('[\u4E00-\u9FA5]');
    return pattern_Ch.test(str);
  }
}
