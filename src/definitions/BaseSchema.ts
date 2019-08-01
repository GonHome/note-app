import * as joi from 'joi';
import { definition } from "../decorators";

@definition('Base', 'Base Entity')
export default class BaseSchema {
  id = joi.number().integer().description('主键')
  createTime = joi.date().description('创建时间')
  updateTime = joi.date().description('更新时间')
  isDelete = joi.boolean().description('是否删除');
}