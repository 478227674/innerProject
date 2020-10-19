import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home.vue';
import workPlace from '@/components/menu/workPlace';
import Login from "../views/login";
import Main from '../views/Main';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      // 登录页
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      // 首页
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/home',
      component: Home,
        redirect: '/home/workPlace',
        children: [
        {
          path: 'workPlace',
          component: workPlace,
          name: '首页'
        },
        {
          path: 'organ',
          component: resolve => require(['@/components/menu/organ'], resolve),
          name: '机构管理'
        },
        {
          path: 'swiper',
          component: resolve => require(['@/components/menu/swiper'], resolve),
          name: '轮播图'
        },
        {
          path: 'teacher',
          component: resolve => require(['@/components/menu/teacher'], resolve),
          name: '教师管理'
        },
        {
          path: 'goodslist',
          component: resolve => require(['@/components/menu/goodslist'], resolve),
          name: '产品管理'
        },
          {
            path: 'orderlist',
            component: resolve => require(['@/components/menu/orderlist'], resolve),
            name: '订单列表'
          },
        {
          path: 'goodsactive',
          component: resolve => require(['@/components/menu/goodsactive'], resolve),
          name: '优惠活动'
        },
          {
            path: 'special',
            component: resolve => require(['@/components/menu/special'], resolve),
            name: '特价产品'
          },
        {
          path: 'price_competition',
          component: resolve => require(['@/components/menu/price_competition'], resolve),
          name: '竞价推荐'
        },
        {
          path: 'push',
          component: resolve => require(['@/components/menu/push'], resolve),
          name: '推送消息'
        },
        {
          path: 'coupon',
          component: resolve => require(['@/components/menu/coupon'], resolve),
          name: '优惠券管理'
        },
        {
          path: 'saler',
          component: resolve => require(['@/components/menu/saler'], resolve),
          name: '销售员管理'
        },
        {
          path: 'orgswiper',
          component: resolve => require(['@/components/menu/orgswiper'], resolve),
          name:'机构轮播图'
        },
        {
          path:'chatuserlist',
          component: resolve =>require(['@/components/menu/chatuserlist'], resolve),
          name:'坐席管理'
        },
        {
          path:'freelist',
          component: resolve =>require(['@/components/menu/freelist'], resolve),
          name:'试听列表'
        },
          {
            path:'recomtoindex',
            component: resolve =>require(['@/components/menu/recomtoindex'], resolve),
            name:'推荐管理'
          },
          {
            path:'message',
            component: resolve =>require(['@/components/menu/message'], resolve),
            name:'动态消息管理'
          },
          {
            path:'orgorder',
            component: resolve =>require(['@/components/menu/order/orgorder'], resolve),
            name:'机构订单'
          },
          {
            path:'filetype',
            component: resolve =>require(['@/components/menu/download/filetype'], resolve),
            name:'资料类型'
          },
          {
            path:'filelist',
            component: resolve =>require(['@/components/menu/download/filelist'], resolve),
            name:'资料管理'
          },
          {
            path:'grouporderlist',
            component: resolve =>require(['@/components/menu/grouporder/grouporderlist'], resolve),
            name:'拼团列表'
          },
          {
            path:'refundgrouporder',
            component: resolve =>require(['@/components/menu/grouporder/refundgrouporder'], resolve),
            name:'拼团退款列表'
          },
          {
            path: 'videos',
            component: resolve => require(['@/components/menu/videos/videos'], resolve),
            name: '阶段管理'
          },
      ]
    }
  ]
})
