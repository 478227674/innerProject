import router from '../router';
import configUrl from '../config';
import QS from 'qs';
import store from '../store';
import axios from 'axios';
import { Message } from 'element-ui';  //element库的消息提示，可以不用
// var token = store.state.user.user.token
//创建axios实例
var token = localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo')).token : '';
console.log(token)
var service = axios.create({
  baseURL: configUrl.baseUrl,
  timeout: 50000,
  withCredentials:false,
  headers: {
    'content-type': 'application/json',
    'token':token || ''
  }
})
export default {
  //get请求，其他类型请求复制粘贴，修改method
  get(url, param) {
    return new Promise((cback, reject) => {
      service({
        method: 'get',
        url,
        params: param,
      }).then(res => {
        if(res.data.code == 2){
          Message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          });
        }
        if(res.data.code == 1){
          Message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          });
        }
      }).catch(err => {
        if (!err.response) {
          console.log('请求错误')
          //Message是element库的组件，可以去掉
          Message({
            showClose: true,
            message: '请求错误',
            type: 'error'
          });
        } else {
          reject(err.response);
          console.log(err.response, '异常2')
        }
      })

    })
  },
  // 封装post方法
  post(url, params){
    params.token = store.state.user.user.token;
    return new Promise((resolve, reject) =>{
      service({
        method: 'post',
        url,
        data:params
      }).then(res => {
        if(res.data.code == 1){
          if(res.data.msg == 401){
            Message({
              showClose: true,
              message: '登录超时，请重新登录',
              type: 'error'
            });
            localStorage.clear('userinfo')
            setTimeout(function () {
              router.push('/login')
              location.reload();
              // console.log()
            },1000)
            return;
          }
        }
        if(res.data.code == 2 || res.data.code == 1){
          Message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          });
          return;
        }
        resolve(res.data)
      }).catch(err => {
        if (!err.response) {
          console.log('请求错误')
          //Message是element库的组件，可以去掉
          Message({
            showClose: true,
            message: '请求错误',
            type: 'error'
          });
        } else {
          reject(err.response);
          console.log(err.response, '异常2')
        }
      })

    });
  },
  uploadImg(file){
    let param = new FormData(); //创建form对象
    param.append('file',file,'img');//通过append向form对象添加数据
    let config = {
      headers:{'Content-Type':'application/application/x-www-form-urlencoded'}
    };  //添加请求头
    axios.post(configUrl.baseUrl+'/file/upload',param,config)
      .then(response=>{
        return response;
        // console.log(response.data);
      })
  },
}
