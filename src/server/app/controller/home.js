'use strict';
const Controller = require('egg').Controller;
const ObjectId = require('mongodb').ObjectId;
class HomeController extends Controller {
  async index() {
    const {
      ctx,
    } = this;
    const result = await this.app.mongo.find('users');
    ctx.body = result;
  }

  // 获取任务列表接口
  async diaryList() {
    const {
      ctx,
    } = this;
    const data = ctx.query;
    const page = (data.page - 1) * 10;
    const userlist = await this.app.mongo.find('users');
    const total = await this.app.mongo.find('diary');
    const reslut = await this.app.mongo.find('diary', {
      skip: page,
      limit: 10,
      sort: {
        _id: 1,
      },
    });
    for (let i = 0; i < reslut.length; i++) {
      const element = reslut[i];
      if (element.endTime) {
        element.useDay = element.endTime - element.createTime;
        const status = element.planTime - element.endTime;
        if (status > 0) {
          element.status = 2;
        } else {
          element.status = 3;
        }
      } else {
        element.status = 1;
      }
      const user = await this.app.mongo.findOne('users', {
        query: {
          _id: ObjectId(reslut[i].userid),
        },
      });
      const createUser = await this.app.mongo.findOne('users', {
        query: {
          _id: ObjectId(reslut[i].createId),
        },
      });
      reslut[i].username = user.username;
      reslut[i].createUserName = createUser.username;
    }
    ctx.body = {
      data: {
        data: reslut,
        userlist,
        total: total.length,
        page: Number(data.page),
      },
      success: true,
      code: 200,
      errorMessage: null,
    };
  }
  // 获取搜索列表
  async getSearchList() {
    const {
      ctx,
    } = this;
    const data = ctx.query;
    const page = (data.page - 1) * 10;
    const total = await this.app.mongo.find('diary', {
      query: {
        userid: data.userid,
      },
    });
    const reslut = await this.app.mongo.find('diary', {
      skip: page,
      limit: 10,
      sort: {
        _id: 1,
      },
      query: {
        userid: data.userid,
      },
    });
    for (let i = 0; i < reslut.length; i++) {
      const element = reslut[i];
      if (element.endTime) {
        element.useDay = element.endTime - element.createTime;
        const status = element.planTime - element.endTime;
        if (status > 0) {
          element.status = 2;
        } else {
          element.status = 3;
        }
      } else {
        element.status = 1;
      }
      const user = await this.app.mongo.findOne('users', {
        query: {
          _id: ObjectId(reslut[i].userid),
        },
      });
      const createUser = await this.app.mongo.findOne('users', {
        query: {
          _id: ObjectId(reslut[i].createId),
        },
      });
      reslut[i].username = user.username;
      reslut[i].createUserName = createUser.username;
    }
    ctx.body = {
      data: {
        data: reslut,
        total: total.length,
        page: Number(data.page),
      },
      success: true,
      code: 200,
      errorMessage: null,
    };
  }
  // 发布任务接口
  async postDiary() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const res = await this.app.mongo.insertOne('diary', {
      doc: data,
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
        errorMessage: '添加失败',
        msg: '添加失败',
      };
    }
  }

  // 完成任务接口
  async finishDiary() {
    const {
      ctx,
    } = this;
    const date = new Date().getTime() / 1000;
    const id = ctx.query.id;
    const finishDiary = await this.app.mongo.findOneAndUpdate('diary', {
      filter: {
        _id: ObjectId(id),
      },
      update: {
        $set: {
          endTime: date,
        },
      },
      options: {
        upsert: true,
      },
    });
    if (finishDiary) {
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
  // 删除任务接口
  async deleteDiary() {
    const {
      ctx,
    } = this;
    const id = ctx.query.id;
    const deleeteDiary = await this.app.mongo.findOneAndDelete('diary', {
      filter: {
        _id: ObjectId(id),
      },
    });
    if (deleeteDiary) {
      ctx.body = {
        data: '',
        success: true,
        code: 200,
        errorMessage: '删除成功',
        msg: '删除成功',
      };
    } else {
      ctx.body = {
        data: '',
        success: false,
        code: 400,
        errorMessage: '删除失败',
        msg: '删除失败',
      };
    }
  }

  // 获取编辑任务信息接口
  async getEditDiaryInfo() {
    const {
      ctx,
    } = this;
    const id = ctx.query.id;
    const diaryInfo = await this.app.mongo.findOne('diary', {
      query: {
        _id: ObjectId(id),
      },
    });
    if (diaryInfo) {
      ctx.body = {
        data: diaryInfo,
        success: true,
        code: 200,
        errorMessage: '',
        msg: '',
      };
    } else {
      ctx.body = {
        data: '',
        success: false,
        code: 400,
        errorMessage: '',
        msg: '',
      };
    }
  }

  // 编辑任务接口
  editDiary() {
    const {
      ctx,
    } = this;
    const data = ctx.request.body;
    const editStatus = this.app.mongo.findOneAndUpdate('diary', {
      filter: {
        _id: ObjectId(data.editid),
      },
      update: {
        $set: {
          userid: data.userid,
          detail: data.detail,
          desc: data.desc,
          version: data.version,
          endTime: '',
          projectName: data.projectName,
          createTime: data.createTime,
          planTime: data.planTime,
          createId: data.createId,
        },
      },
    });
    if (editStatus) {
      ctx.body = {
        data: '',
        success: true,
        code: 200,
        errorMessage: '更新成功！',
        msg: '更新成功！',
      };
    } else {
      ctx.body = {
        data: '',
        success: false,
        code: 400,
        errorMessage: '更新失败',
        msg: '更新失败',
      };
    }
  }
}
module.exports = HomeController;
