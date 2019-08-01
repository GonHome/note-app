import {
  tag,
  get,
  post,
  summary,
  parameter,
  controller,
  ENUM_PARAM_IN,
  login_required,
  response,
  del,
} from "../decorators";
import * as md5 from 'md5';
import * as joi from 'joi';
import { Like } from "typeorm";
import * as omit from 'omit.js';
import * as jwt from "jsonwebtoken";
import { User } from '../entity/User';
import { AppConfig } from '../utils/config';
import NoteSchema from "../definitions/Note";
import { IContext } from '../decorators/interface';
import { Note } from "../entity/Note";

@controller('/note')
export default class NoteController {

  /**
   * 新增笔记
   */
  @post('/add')
  @tag('笔记管理')
  @parameter(
    'body', 
    joi.object().keys({
      name: joi.string().required().description('笔记名称'),
      language: joi.string().required().description('语言').default('markdown'),
    }), ENUM_PARAM_IN.body
  )
  @summary('添加笔记')
  @login_required()
  @response(200, { $ref: NoteSchema })
  async addNote(ctx: IContext) {
    const noteInfo: Note = ctx.$getParams();
    const username = ctx.cookies.get('username');
    const user: User = await User.findOne({ name: username });
    if (user) {
      noteInfo.user = user;
    }
    await Note.save(noteInfo);
    return noteInfo;
  }

  /**
   * 修改笔记
   */
  @post('/update')
  @tag('笔记管理')
  @parameter(
    'body', 
    joi.object().keys({
      ids: joi.string().required().description('笔记IDS'),
      name: joi.string().description('笔记名称'),
      language: joi.string().description('语言'),
      content: joi.string().description('内容'),
      isFavourite: joi.boolean().description('是否关注'),
      isPin: joi.boolean().description('是否置顶'),
      isDelete: joi.boolean().description('是否逻辑删除'),
    }), ENUM_PARAM_IN.body
  )
  @summary('修改笔记')
  @login_required()
  @response(200, { $ref: NoteSchema })
  async updateNote(ctx: IContext) {
    const {
      ids, 
      name,
      language,
      content,
      isFavourite,
      isPin,
      isDelete,
    } = ctx.$getParams();
    const notes: Note[] = await Note.findByIds(ids.split(','));
    if (notes.length > 0) {
      notes.forEach((note: Note) => {
        name !== undefined ? note.name = name : null;
        language !== undefined ? note.language = language : null;
        content !== undefined ? note.content = content : null;
        isFavourite !== undefined ? note.isFavourite = isFavourite : null;
        isPin !== undefined ? note.isPin = isPin : null;
        isDelete !== undefined ? note.isDelete = isDelete : null;
      });
      ctx.manager.save(notes);
    }
    return notes;
  }

  /**
   * 删除笔记
   */
  @post('/delete')
  @tag('笔记管理')
  @parameter(
    'body', 
    joi.object().keys({
      ids: joi.string().required().description('笔记IDS')
    })
  )
  @summary('删除笔记')
  @login_required()
  @response(200, { $ref: NoteSchema })
  async deleteNote(ctx: IContext) {
    const {
      ids, 
    } = ctx.$getParams();
    console.log(ctx.$getParams());
    const notes: Note[] = await Note.findByIds(ids.split(','));
    await ctx.manager.remove(notes);
    return 'ok';
  }

  /**
   * 清空回收站
   */
  @post('/clear')
  @tag('笔记管理')
  @summary('清空回收站')
  @login_required()
  @response(200, { $ref: NoteSchema })
  async dclearNote(ctx: IContext) {
    const notes: Note[] = await Note.find({
      where: {
        isDelete: true,
      }
    });
    await ctx.manager.remove(notes);
    return 'ok';
  }

  @get('/search')
  @tag('笔记管理')
  @summary('全量查询笔记')
  @parameter('search', joi.string().description('搜索关键字').default(''))
  @parameter('sortName', joi.string().description('排序字段').default('createTime'))
  @parameter('sortOrder', joi.string().valid(['ASC', 'DESC']).description('排序方法').default('ASC'))
  @response(200, {
    notes: { type: 'array', $ref: NoteSchema, desc: '笔记列表' },
  })
  @login_required()
  async queryNotes(ctx: IContext) {
    const {
      sortName,
      sortOrder,
      search
    } = ctx.$getParams();
    const notes = await Note.find({
      order: {
        isPin: 'DESC',
        [sortName] : sortOrder,
      },
      where: search ? { content: Like(`%${search}%`) } : null ,
      relations: ['tags', 'annexs']
    });
    return {
      notes,
    };
  }
}