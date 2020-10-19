<template>
  <div>
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      推送消息
    </el-button>
    <el-button @click="pushFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      推送优惠券
    </el-button>
    <el-button @click="messageFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      短信通知
    </el-button>

    <el-dialog title="推送消息至用户" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="推送内容"
          :label-width="formLabelWidth"
          prop="messageContent"
          :rules="[
            { required: true, message: '推送内容不能为空'},
          ]"
        >
          <el-input v-model.string="form.messageContent" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="推送对象"
          prop="pushType"
          :label-width="formLabelWidth"
        >
          <el-radio v-model="form.pushType" label="1">关注用户</el-radio>
          <el-radio v-model="form.pushType" label="2">指定用户</el-radio>
          <el-radio v-model="form.pushType" label="3">同地区用户</el-radio>
        </el-form-item>
        <el-form-item
          label="选择用户"
          prop="date"
          :label-width="formLabelWidth"
          v-if="form.pushType==2"
        >
          <el-input v-model.string="form.userPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="选择优惠券"
          prop="date"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="form.couponId"
            multiple
            collapse-tags
            style="margin-left: 20px;"
            placeholder="请选择">
            <el-option
              v-for="item in couponList"
              :key="item.couponId"
              :label="item.couponTitle"
              :value="item.couponId">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-select-->
        <!--v-model="form.userIds"-->
        <!--multiple-->
        <!--collapse-tags-->
        <!--style="margin-left: 20px;"-->
        <!--placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="item in userList"-->
        <!--:key="item.userId"-->
        <!--:label="item.userName"-->
        <!--:value="item.userId">-->
        <!--</el-option>-->
        <!--</el-select>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="推送优惠券至用户" :visible.sync="pushFlag">
      <el-form :model="form">
        <el-form-item
          label="推送内容"
          :label-width="formLabelWidth"
          prop="messageContent"

        >
          <el-input v-model.string="sendform.messageContent" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="推送用户"
          :label-width="formLabelWidth"
          prop="messageContent"
        >
          <el-select v-model="sendform.userId" filterable  placeholder="请选择推送用户" >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item
          label="选择优惠券"
          prop="date"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="sendform.couponId"
            style="margin-left: 20px;"
            placeholder="请选择">
            <el-option
              v-for="item in couponList"
              :key="item.couponId"
              :label="item.couponTitle"
              :value="item.couponId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pushFlag = false">取 消</el-button>
        <el-button type="primary" @click="sendCouponToUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="短信推送" :visible.sync="messageFlag">
      <el-form :model="form">
        <el-form-item
          label="选择课程"
          prop="date"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="pushMsgObj.productId"
            style="margin-left: 20px;"
            placeholder="请选择">
            <el-option
              v-for="item in liveList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="messageFlag = false">取 消</el-button>
        <el-button type="primary" @click="sendMessageToLiveUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!--dialog删除-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        messageFlag:false,
        currentPage:1,//当前页数
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        pushFlag:false,
        sendform:{
          couponId:'',
          messageContent: '',
          orgId:'',
          userId:''
        },
        form: {
          messageContent: '',
          orgId:'',
          pushType:'1',
          userPhone:null,
        },
        formLabelWidth: '120px',
        tableData: [],
        userList:[],
        couponList:[],

        liveList:[],
        pushMsgObj:{
          productId:'',
          productType:'',
        }
      }
    },
    created(){
        this.getUserList();
        this.getCouponList();
        this.getLiveList();
    },
    methods:{
      sendMessageToLiveUser(){
        if(!this.pushMsgObj.productId){
          this.$errorMessage('请选择推送的课程')
          return;
        }
        for(let i=0;i<this.liveList.length;i++){
          if(this.pushMsgObj.productId == this.liveList[i].productId){
            this.pushMsgObj.productType = this.liveList[i].imageType
          }
        }
        this.http.post('/orgProduct/liveProductInform',this.pushMsgObj).then(res=>{
          this.$successMessage('已推送')
          this.messageFlag = false;
        })
      },
      //获取直播课列表
      getLiveList(){
        this.http.post('/orgProduct/queryOnlineProductList',{orgId:4,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.liveList = res.data.list;
          }
        })
      },
      getUserList(){
        this.http.post('/orgInfo/queryAppUser',{}).then(res=>{
          if(res.code == 0){
            this.userList = res.data;
          }
        })
      },
      getCouponList(){
        this.http.post('/orgInfo/queryCouponList',{orgId:this.orgId,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.couponList = res.data.list;
          }
        })
      },
      sendCouponToUser(){
        if(!this.sendform.messageContent){
          this.$errorMessage('请填写推送内容')
          return;
        }
        if(!this.sendform.userId){
          this.$errorMessage('请选择推送用户')
          return;
        }
        if(!this.sendform.couponId){
          this.$errorMessage('请选择优惠券')
          return;
        }
        this.sendform.orgId = JSON.parse(localStorage.getItem('userinfo')).id;
        this.http.post('/orgInfo/saveCouponMessage',this.sendform).then(res=>{
          if(res.code == 0){
            this.$successMessage('推送成功')
            this.pushFlag = false;
          }
        })
      },
      submitData(){
        if(!this.form.messageContent){
          this.$errorMessage('请填写推送内容')
          return;
        }
        if(this.form.pushType == 2){
          if(!this.form.userPhone){
            this.$errorMessage('请填写指定用户手机号')
            return;
          }
        }else{
          this.form.userPhone = '';
        }
        this.form.orgId = JSON.parse(localStorage.getItem('userinfo')).id;
        this.http.post('/orgInfo/savePushMessage',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('推送成功')
          }
        })
//        this.dialogFormVisible = false;
//        this.tableData.push(this.form)
//        this.$successMessage('恭喜你，这是一条成功消息')
//        this.tagList.push({text:this.form.tag,value:this.form.tag})
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(data.$index,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    watch:{
      pushType(val){
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
