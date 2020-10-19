<template>
  <div class="menu_container">
    <el-row class="tac">
      <el-col :span="24">
        <h5 class="menu_bg"></h5>
        <el-menu
          class="el-menu-vertical-demo menu_bottom"
          :default-active="$route.path"
        >
          <!--<template v-for="(menu, index) in menus">-->
            <!--<el-submenu :index="index+''" :key="index" v-if="menu.chirdMenu">-->
              <!--<template slot="title">-->
                <!--<i :class="menu.icon"></i>-->
                <!--<span>{{menu.title}}</span>-->
              <!--</template>-->
              <!--<el-menu-item-group :key="index" v-for="(item,index) in menu.chirdMenu">-->
                <!--<router-link :to="item.path">-->
                  <!--<el-menu-item   :index="item.path" :key="item.path">{{item.btn}}</el-menu-item>-->
                <!--</router-link>-->
              <!--</el-menu-item-group>-->
            <!--</el-submenu>-->
            <!--<router-link :key="index"  :to="menu.path" v-else>-->
              <!--<el-menu-item :index="menu.path" >-->
                <!--<i :class="menu.icon"></i><span slot="title">{{menu.title}}</span>-->
              <!--</el-menu-item>-->
            <!--</router-link>-->
          <!--</template>-->
<!--          <el-submenu index="109">-->
<!--            <template slot="title">-->
<!--              <i class="el-icon-document"></i>-->
<!--              <span>资料下载管理</span>-->
<!--            </template>-->
<!--            <template>-->
<!--              <router-link to="/home/filetype" >-->
<!--                <el-menu-item index="/home/filetype" >-->
<!--                  <i class="el-icon-document"></i><span slot="title">资料类型</span>-->
<!--                </el-menu-item>-->
<!--              </router-link>-->
<!--            </template>-->
<!--            <template>-->
<!--              <router-link to="/home/filelist" >-->
<!--                <el-menu-item index="/home/filelist" >-->
<!--                  <i class="el-icon-document"></i><span slot="title">资料管理</span>-->
<!--                </el-menu-item>-->
<!--              </router-link>-->
<!--            </template>-->
<!--          </el-submenu>-->
          <template>
            <router-link to="/home/organ" >
              <el-menu-item index="/home/organ" >
                <i class="el-icon-setting"></i><span slot="title">机构简介</span>
              </el-menu-item>
            </router-link>
          </template>

          <!--<template>-->
            <!--<router-link to="/home/teacher" >-->
              <!--<el-menu-item index="/home/teacher" >-->
                <!--<i class="el-icon-menu"></i><span slot="title">教师管理</span>-->
              <!--</el-menu-item>-->
            <!--</router-link>-->
          <!--</template>-->
          <template>
            <router-link to="/home/goodslist" >
              <el-menu-item index="/home/goodslist" >
                <i class="el-icon-menu"></i><span slot="title">正价课程</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/home/goodsactive" >
              <el-menu-item index="/home/goodsactive" >
                <i class="el-icon-tickets"></i><span slot="title">优惠课程</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/home/special" >
              <el-menu-item index="/home/special" >
                <i class="el-icon-tickets"></i><span slot="title">特价课程</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/home/swiper" >
              <el-menu-item index="/home/swiper" >
                <i class="el-icon-view"></i><span slot="title">风采展示</span>
              </el-menu-item>
            </router-link>
          </template>
          <!--<template>-->
            <!--<router-link to="/home/price_competition" >-->
              <!--<el-menu-item index="/home/price_competition" >-->
                <!--<i class="el-icon-menu"></i><span slot="title">竞价推荐</span>-->
              <!--</el-menu-item>-->
            <!--</router-link>-->
          <!--</template>-->
        <template>
          <router-link to="/home/push" >
            <el-menu-item index="/home/push" >
              <i class="el-icon-news"></i><span slot="title">推送消息</span>
            </el-menu-item>
          </router-link>
        </template>
          <template>
            <router-link to="/home/orgorder" >
              <el-menu-item index="/home/orgorder" >
                <i class="el-icon-news"></i><span slot="title">机构订单</span>
              </el-menu-item>
            </router-link>
          </template>
          <!--<template>-->
            <!--<router-link to="/home/chatuserlist" >-->
              <!--<el-menu-item index="/home/chatuserlist" >-->
                <!--<i class="el-icon-news"></i><span slot="title">坐席管理</span>-->
              <!--</el-menu-item>-->
            <!--</router-link>-->
          <!--</template>-->
          <template>
            <router-link to="/home/orderlist" >
              <el-menu-item index="/home/orderlist" >
                <i class="el-icon-tickets"></i><span slot="title">订单列表</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/home/grouporderlist" >
              <el-menu-item index="/home/grouporderlist" >
                <i class="el-icon-tickets"></i><span slot="title">拼团订单列表</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/home/refundgrouporder" >
              <el-menu-item index="/home/refundgrouporder" >
                <i class="el-icon-tickets"></i><span slot="title">拼团退款列表</span>
              </el-menu-item>
            </router-link>
          </template>
          <!--<template>-->
            <!--<router-link to="/home/freelist" >-->
              <!--<el-menu-item index="/home/freelist" >-->
                <!--<i class="el-icon-tickets"></i><span slot="title">试听列表</span>-->
              <!--</el-menu-item>-->
            <!--</router-link>-->
          <!--</template>-->
          <template>
            <router-link to="/home/videos" >
              <el-menu-item index="/home/videos" >
                <i class="el-icon-remove-outline"></i><span slot="title">阶段管理</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/home/recomtoindex" >
              <el-menu-item index="/home/recomtoindex" >
                <i class="el-icon-tickets"></i><span slot="title">推荐管理</span>
              </el-menu-item>
            </router-link>
          </template>
          <!--<template>-->
            <!--<router-link to="/home/saler" >-->
              <!--<el-menu-item index="/home/saler" >-->
                <!--<i class="el-icon-remove-outline"></i><span slot="title">销售员管理</span>-->
              <!--</el-menu-item>-->
            <!--</router-link>-->
          <!--</template>-->
          <template>
            <router-link to="/home/orgswiper" >
              <el-menu-item index="/home/orgswiper" >
                <i class="el-icon-remove-outline"></i><span slot="title">机构轮播图</span>
              </el-menu-item>
            </router-link>
          </template>
          <template>
            <router-link to="/home/message" >
              <el-menu-item index="/home/message" >
                <i class="el-icon-remove-outline"></i><span slot="title">动态消息管理</span>
              </el-menu-item>
            </router-link>
          </template>
<!--          <template>-->
<!--            <router-link to="/home/coupon" >-->
<!--              <el-menu-item index="/home/coupon" >-->
<!--                <i class="el-icon-menu"></i><span slot="title">优惠券管理</span>-->
<!--              </el-menu-item>-->
<!--            </router-link>-->
<!--          </template>-->
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        menus: [],
        checkindex: "workPlace"
      };
    },
    methods: {

    },
    created() {
    }
  };
</script>

<style lang='less' scoped>
  .menu_bg {
    height: 60px;
    background-color: #3899cc;
  }
  .menu_container {
    height: 100vh;
    background: #fff;
    position: fixed;
    left: 0;
    .tac {
      height: 100%;
      .el-menu-vertical-demo {
        border: none;
        min-width: 200px;
      }
    }
  }
  .el-menu-item{
    text-align: left;
    height:50px !important;
    line-height: 50px !important;
  }
</style>
