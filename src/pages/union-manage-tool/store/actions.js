import axios from '@/http/index'
export default {
  getDemo ({ commit }) {
    return axios.get('/getgetDemo')
  }
}
