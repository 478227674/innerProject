const url = {};

url.wxUrl = ''; // 项目地址
url.baseUrl = ''; // 接口地址
url.ossUrl = ''; // oss cdn地址
url.app_version = '1.0.0'; // oss cdn地址

if(process.env.NODE_ENV == 'production'){  //生产环境
  url.baseUrl = 'http://qk.taiqiedu.com/tqshoop/org';//打包后测试地址
  url.wxUrl = 'http://qk.taiqiedu.com/h5/';
}else{ //测试环境
  url.baseUrl = 'http://192.168.1.209:8085/tqky_war_exploded/org';//测试地址
  // url.baseUrl = 'http://qk.taiqiedu.com/tqshoop/org';//打包后测试地址
  url.wxUrl = 'http://qk.taiqiedu.com/h5/';

  // url.baseUrl = 'http://192.168.83.105 :8080';//测试地址
  //   url.ossUrl = 'http://cdntest.baomaclub.cn/static';
}
url.install = (Vue) => {
  Vue.prototype.wxUrl = url.wxUrl;
  Vue.prototype.baseUrl = url.baseUrl;
  Vue.prototype.ossUrl = url.ossUrl;
  Vue.prototype.app_version = url.app_version;
};
export default url;
