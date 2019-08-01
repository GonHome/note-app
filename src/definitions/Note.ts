import * as joi from 'joi';
import { definition } from "../decorators";
import BaseSchema from './BaseSchema';

@definition('Note', 'Note Entity')
export default class NoteSchema extends BaseSchema {
  name = joi.string().description('笔记名称')
  isFavourite = joi.boolean().description('是否关注')
  language = joi.string().description('语言')
  isPin = joi.boolean().description('是否置顶')
}