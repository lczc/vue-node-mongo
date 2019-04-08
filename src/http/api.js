import $http from './index.js'
/* 注册 */
export const userRegister = data => {
  return $http.post('/user/register', data)
}
/* 登录 */
export const userLogin = data => {
  return $http.get('/user/login', data)
}

/* 获取工作日志列表 */
export const getDiaryList = data => {
  return $http.get('/home/diary/list', data)
}
/* 修改用户信息 */
export const updateUserMessage = data => {
  return $http.post('/user/updataUser', data)
}

/* 发布工作日志接口 */
export const postDiary = data => {
  return $http.post('/home/diary/add', data)
}

/* 完成工作接口 */

export const finishDiary = data => {
  return $http.get('/home/diary/finish', data)
}

/* 删除项目接口 */

export const deleteDiary = data => {
  return $http.get('/home/diary/deleteDiary', data)
}

/* 编辑项目获取信息 */

export const getEditDiaryInfo = data => {
  return $http.get('/home/diary/getEditDiaryInfo', data)
}

/* 编辑更新任务接口 */

export const editDiary = data => {
  return $http.post('/home/diary/editDiary', data)
}

/* 获取搜索列表 */
export const getSearchList = data => {
  return $http.get('/home/diary/getSearchList', data)
}
