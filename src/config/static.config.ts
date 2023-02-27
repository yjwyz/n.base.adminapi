import { join } from 'path';

export const File = {
  imageFilePath: join(__dirname, '../files/images'), //图片存储路径
  imageFileMimeType: 'image', // image MIME类型限制
  imageFileFormDataId: 'image', // 图片文件传输formdata id
  imageAccessProffix: '/images', // image文件访问前缀
  imageMaxSizeLimit: 3, // // 文件大小限制(单位m)
  excelFilePath: join(__dirname, '../files/excels'), // excel文件存储路径
  excelFileMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // excel MIME类型限制
  excelFileFormDataId: 'xlsx',
  excelAccessProffix: '/excel', // 资源访问前缀
  excelMaxSizeLimit: 3,
  toHttp: 'localhost:3000', // 录入数据库是否要添加一个ip
};
