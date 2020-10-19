/**
 * Created by 47822 on 2019/8/2.
 */
import axios from 'axios';
import qs from 'qs';
import configUrl from '../config';
import { Loading } from 'element-ui';

const Common = {};
Date.prototype.format = function(format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}


//图片上传公用
Common.uploadImg = function (data) {
  let loadingInstance = Loading.service({text:'文件上传中...'});
  let config = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }
  return new Promise((resolve, reject) =>{
    var reader = new FileReader();
    reader.readAsDataURL(data.file || data);
    reader.onload = function(){
      axios.post(configUrl.baseUrl+'/file/upload', qs.stringify({base64:reader.result, fileName:'a.jpg'}), config).then(response => {
        if(response.data.code == 0){
          resolve(response.data);
          loadingInstance.close();
        }else{
          reject(response);
          loadingInstance.close();
        }
      })
    };
  });
}
//图片上传公用
Common.uploadPdf = function (data) {
  // let loadingInstance = Loading.service({text:'文件上传中...'});
  let config = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }
  console.log(data)
  return new Promise((resolve, reject) =>{
    console.log(111)
    var reader = new FileReader();
    reader.readAsDataURL(data.file || data);
    reader.onload = function(){
      console.log(reader.result)
      axios.post(configUrl.baseUrl+'/file/upload', qs.stringify({base64:reader.result, fileName:'sa.pdf'}), config).then(response => {
        if(response.data.code == 0){
          resolve(response.data);
          loadingInstance.close();
        }else{
          reject(response);
          loadingInstance.close();
        }
      })
    };
  });
}
//成功弹窗
Common.sMessage = function (string) {
  this.$message({
    message:string,
    type: 'success'
  })
}
//时间戳转换
Common.formatTimeToDay = function (time) {
  return new Date(time).format("yyyy.MM.dd hh:mm");
}
Common.formatTimeToDate = function (time) {
  return new Date(time).format("yyyy.MM.dd");
}
//警告弹窗
Common.wMessage = function (string) {
  this.$message({
    message:string,
    type: 'error'
  })
}
Common.install = function(Vue){
  Vue.prototype.$successMessage = Common.sMessage;
  Vue.prototype.$errorMessage = Common.wMessage;
  Vue.prototype.$uploadImg = Common.uploadImg;
  Vue.prototype.$uploadPdf = Common.uploadPdf;
  Vue.prototype.formatTimeToDay = Common.formatTimeToDay;
  Vue.prototype.formatTimeToDate = Common.formatTimeToDate;
}


export default Common;
