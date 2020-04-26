<template>
  <el-container class="head_container">
    <el-row class="elRow" style="width:100%;text-align:right;margin:0 60px;">

      <div class="clear">
        <el-col :span="24" class="clear head_right" style="padding-top: 10px">
          <!--通知喇叭-->
          <!--<div class="info_icon" @click="showMyselfs('isShowAbout')">-->
            <!--<el-badge is-dot class="item is-dot">-->
              <!--<i class="el-icon-bell"></i>-->
            <!--</el-badge>-->
          <!--</div>-->
          <el-button type="text" @click="changePassword">修改密码</el-button>
          <el-button type="text" @click="loginOut">退出登录</el-button>
          <div class="head_userInfo" style="float: right;margin-left: 20px;">
            <!--<div class="userIcon"><img :src="img" alt="user"><span>{{name}}</span></div>-->
            <div class="userIcon"><span>欢迎您，{{name}}</span></div>
          </div>
        </el-col>
      </div>

    </el-row>
    <el-dialog title=修改密码 :visible.sync="changeFlag">
      <el-form :model="form">
        <el-form-item
          label="旧密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="form.newPassWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="再次确认新密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="form.newPassWord2" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitChange">确 定</el-button>
      </div>
    </el-dialog>

  </el-container>

</template>

<script>
  export default{
    data(){
      return{
        img:'',
        name:'',
        changeFlag:false,
        formLabelWidth:'120px',
        form:{
          password:'',
          newPassWord:'',
          newPassWord2:'',
          id:''
        }
      }
    },
    created(){
        if(localStorage.getItem('userinfo')){
          this.name = JSON.parse(localStorage.getItem('userinfo')).userName;
          this.form.id = JSON.parse(localStorage.getItem('userinfo')).id;

        }else{
            this.$router.replace('/login')
        }
    },
    methods:{
      submitChange(){
        if(!this.form.newPassWord){
            this.$errorMessage('请输入新密码')
            return;
        }
        if(!this.form.newPassWord2){
          this.$errorMessage('请再次输入新密码')
          return;
        }
        if(this.form.newPassWord!=this.form.newPassWord2){
          this.$errorMessage('输入的两次密码不正确')
          return;
        }
        this.http.post('/orgLogin/updateOrgUserPwd',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改密码成功,请重新登录');
            this.changeFlag = false;
            localStorage.removeItem('userinfo');
            this.$router.replace('/login');

          }
        })
      },
      changePassword(){
        this.changeFlag = true;
      },
      loginOut(){
        this.$confirm('确定退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.openLogin();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      openLogin(){
        localStorage.removeItem('userinfo')
        this.$router.replace('/login')
        location.reload();
      },
      showMyselfs(params){
        this.$emit('on-show',params);
      }
    }
  }
</script>

<style scoped lang="less">
  .head_container{
    min-width:1200px;
    background-color: #fff;
    height:60px;
  }
  .head_icon{
    color:red;
    text-align: right;
  }
  .el-icon-bell{
    font-size: 20px;
  }
  .item {
    margin-top: 10px;
    /*margin-right: 40px;*/
  }
  .el-badge__content.is-fixed{
    top:10px;
  }
  .clear:after{content:"";height:0;line-height:0;display:block;visibility:hidden;clear:both;}
  .head_right{
    float:right;
  }
  .info_icon{
    margin: 10px;
    /*float:left;*/
    display: inline-block;
    cursor:pointer;
  }
  .head_userInfo {
    /*float: left;*/
    display: inline-block;
    vertical-align: middle;
    padding-top: 10px;
  }
</style>
