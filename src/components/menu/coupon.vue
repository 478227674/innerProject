<template>
  <div>
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加优惠券
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="couponId"
        label="ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="couponTitle"
        label="优惠券标题"
        align="center">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="有效期至"
        align="center">
      </el-table-column>
      <el-table-column
        prop="couponType"
        align="center"
        label="优惠券类型"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.couponType==1">满减券</span>
          <!--<span v-if="scope.row.couponType==2">叠加满减券</span>-->
          <!--<span v-if="scope.row.couponType==3">无门槛券</span>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="usedAmount"
        label="优惠金额"
        align="center">
      </el-table-column>
      <el-table-column
        align="center"
        label="图片"
      >
        <template slot-scope="scope">
            <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" width="100" height="100" class="head_pic"/>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
          <el-button @click="sendCoupon(scope)" type="text" size="small">赠送优惠券</el-button>
          <el-button @click="createCouponUrl(scope.row)" type="text" size="small">生成链接</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--dialog添加-->
    <el-dialog title="添加优惠券" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="优惠券标题"
          :label-width="formLabelWidth"
          prop="couponTitle"
          :rules="[
            { required: true, message: '标题不能为空'},
          ]"
        >
          <el-input v-model.string="form.couponTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.couponType" label="1">满减券</el-radio>
            <!--<el-radio v-model="form.couponType" label="2">叠加满减券</el-radio>-->
            <!--<el-radio v-model="form.couponType" label="3">无门槛券</el-radio>-->
          </template>
        </el-form-item>
        <el-form-item
          label="可使用金额"
          :label-width="formLabelWidth"
          prop="withAmount"
          :rules="[
            { required: true, message: '可使用优惠券金额不能为空'},
          ]"
        >
          <el-input oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.string="form.withAmount" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="优惠券金额"
          :label-width="formLabelWidth"
          prop="usedAmount"
          :rules="[
            { required: true, message: '优惠券金额不能为空'},
          ]"
        >
          <el-input oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.string="form.usedAmount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="优惠券有效期"
          :label-width="formLabelWidth"
          prop="usedAmount"
        >
          <el-date-picker
            v-model="setTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>

        </el-form-item>

        <el-form-item label="图片(100*100)" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImg"
          >
            <img v-if="form.couponImage" :src="form.couponImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <!--赠送优惠券-->
    <el-dialog title="赠送优惠券" :visible.sync="sendFlag">
      <el-form :model="sendobj">
        <el-select v-model="sendobj.userId" filterable  placeholder="请选择赠送用户" >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendFlag  = false">取 消</el-button>
        <el-button type="primary" @click="sendCouponToUser">确 定</el-button>
      </div>
    </el-dialog>

    <!--赠送优惠券-->
    <el-dialog title="生成链接" :visible.sync="createUrlFlag">
      <div>{{couponUrl}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createUrlFlag  = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import configUrl from '../../config'

  export default {
    data() {
      return {
        apiurl:'',

        dialogFormVisible: false,
        dialogVisible: false,
        sendobj:{
          couponId:'',
          orgId:'',
          userId:''
        },
        form: {
          couponTitle: '',
          imageId:'',
          couponImage:'',
          couponType:'1',// 1满减券 2叠加满减券 3无门槛券
          withAmount:'', //满多少金额
          usedAmount:'', //用券金额
          orgId:'',
          longStartTime:'',
          longEndTime:''
        },
        setTime:'',
        editform: {
          couponTitle: '',
          imageId:'',
          couponImage:'',
          couponType:'1',// 1满减券 2叠加满减券 3无门槛券
          withAmount:'', //满多少金额
          usedAmount:'', //用券金额
        },
        formLabelWidth: '120px',
        tableData: [],
        orgId:'',
        sendFlag:false,

        userList:[],

        couponUrl:'',
        createUrlFlag:false,
      }
    },
    components: {
    },
    computed:{

    },
    created:function () {
      this.apiurl = this.uplodUrl;
      this.orgId = JSON.parse(localStorage.getItem('userinfo')).id
      this.getCouponList();
      this.getUserList();
    },
    methods:{
      //生成优惠券链接
      createCouponUrl(data){
        this.couponUrl = configUrl.wxUrl + 'html/coupon/sharecoupon.html?id='+data.couponId
        this.createUrlFlag = true;
      },
      //赠送优惠券
      sendCouponToUser(){
        if(!this.sendobj.userId){
          this.$errorMessage('请选择赠送对象')
          return;
        }
        this.sendobj.orgId = this.orgId;
        this.http.post('/orgInfo/couponToUser',this.sendobj).then(res=>{
          if(res.code == 0){
            this.sendFlag = false;
            this.$successMessage('赠送成功')
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
      //赠送优惠券
      sendCoupon(data){
          this.sendobj.couponId = data.row.couponId;
          this.sendFlag = true;
      },
      getCouponList(){
        this.http.post('/orgInfo/queryCouponList',{orgId:this.orgId,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].endTime = this.formatTimeToDate(res.data.list[i].endTime)
              res.data.list[i].startTime = this.formatTimeToDate(res.data.list[i].startTime)
            }
            this.tableData = res.data.list;
          }
        })
      },
      uploadImg(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            if(this.dialogVisible){
              this.editform.imageId = res.data.fileId;
              this.editform.couponImage = res.data.filePath;
            }else if(this.dialogFormVisible){
              this.form.imageId = res.data.fileId;
              this.form.couponImage = res.data.filePath;
            }
          }
        })
      },
      submitData(){
        if(!this.form.couponTitle){
          this.$errorMessage('请填写优惠券标题')
          return;
        }
        if(this.form.couponType==1){
            if(!this.form.withAmount){
              this.$errorMessage('请填写优惠券可使用金额')
              return;
            }
          if(!this.form.usedAmount){
            this.$errorMessage('请填写优惠券优惠金额')
            return;
          }
          if(Number(this.form.withAmount)<Number(this.form.usedAmount)){
            this.$errorMessage('优惠券可使用金额不能小于优惠金额')
            return;
          }
        }
        if(!this.form.imageId){
          this.$errorMessage('请上传图片')
          return;
        }
        if(!this.setTime){
          this.$errorMessage('青选择优惠券起始时间')
          return;
        }else{
          var st = this.setTime[0];
          var en = this.setTime[1];
          this.form.longStartTime =  new Date(st).getTime()
          this.form.longEndTime = new Date(en).getTime();
        }
        this.form.orgId = this.orgId
        this.http.post('/orgInfo/createCoupon',this.form).then(res=>{
            if(res.code == 0){
                this.$successMessage('添加成功');
                this.dialogFormVisible = false;
                this.getCouponList();
            }
        })
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该优惠券, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async() => {
            await this.deleteCoupon(data.row.couponId,data.$index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteCoupon(id,index){
        this.http.post('/orgInfo/deleteCoupon',{couponId:id}).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'info',
              message: '已删除'
            });
            this.tableData.splice(index,1)
          }
        })
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
  .ql-container{
    height: 200px;
  }
  .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg{
    margin-top: 0px;
  }
</style>
