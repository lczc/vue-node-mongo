'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller,
  } = app;
  router.get('/', controller.home.index);
  // 登录接口
  router.get('/user/login', controller.user.login);
  // 注册接口
  router.post('/user/register', controller.user.register);
  /* 用户修改信息接口 */
  router.post('/user/updataUser', controller.user.updataUser);
  // 获取日志列表接口
  router.get('/home/diary/list', controller.home.diaryList);
  // 添加工作记录接口
  router.post('/home/diary/add', controller.home.postDiary);
  // 完成项目接口
  router.get('/home/diary/finish', controller.home.finishDiary);
  // 删除项目
  router.get('/home/diary/deleteDiary', controller.home.deleteDiary);
  // 获取编辑信息接口
  router.get('/home/diary/getEditDiaryInfo', controller.home.getEditDiaryInfo);
  // 更新任务信息接口
  router.post('/home/diary/editDiary', controller.home.editDiary);
  // 获取搜索列表接口
  router.get('/home/diary/getSearchList', controller.home.getSearchList);
};
