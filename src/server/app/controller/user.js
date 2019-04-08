'use strict';
const Controller = require('egg').Controller;
const ObjectId = require('mongodb').ObjectId;
/* 校验表单 */
const createRule = {
  username: {
    type: 'email',
  },
  password: {
    type: 'password',
    compare: 're-password',
  },
};
exports.create = async ctx => {
  ctx.validate(createRule);
  ctx.body = ctx.request.body;
};
class UserController extends Controller {
  // 登录
  async login() {
    const {
      ctx,
    } = this;
    const data = ctx.query;
    const res = await this.app.mongo.findOne('users', {
      query: {
        username: data.registerUserName,
        password: data.registerPassword,
      },
    });
    if (res) {
      ctx.body = {
        data: res,
        success: true,
        code: 200,
        errorMessage: null,
      };
    } else {
      ctx.body = {
        data: '',
        success: false,
        code: 400,
        errorMessage: '会员不存在',
        msg: '会员不存在',
      };
    }
  }
  // 注册
  async register() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const findUser = await this.app.mongo.findOne('users', {
      query: {
        username: data.registerUserName,
      },
    });
    if (findUser) {
      ctx.body = {
        data: '',
        success: false,
        code: 400,
        errorMessage: '会员已存在',
        msg: '会员已存在',
      };
    } else {
      await this.app.mongo.insertOne('users', {
        doc: {
          username: data.registerUserName,
          password: data.registerPassword,
        },
      });
      ctx.body = {
        data: '',
        success: true,
        code: 200,
        errorMessage: '注册成功',
        msg: '注册成功',
      };
    }

  }
  /* 用户修改信息 */
  async updataUser() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;

    const changeInformation = await this.app.mongo.findOneAndUpdate('users', {
      filter: {
        _id: ObjectId(data._id),
      },
      update: {
        $set: {
          username: data.updateUserName,
          password: data.updatePassword,
        },
      },
      options: {
        upsert: true,
      },
    });
    if (changeInformation) {
      ctx.body = {
        data: '',
        success: true,
        code: 200,
        errorMessage: '修改成功',
        msg: '修改成功',
      };
    } else {
      ctx.body = {
        data: '',
        success: false,
        code: 400,
        errorMessage: '修改失败',
        msg: '修改失败',
      };
    }
  }
}
module.exports = UserController;
