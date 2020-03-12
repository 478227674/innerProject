<template>
  <div>
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加坐席
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="序号"
        width="180"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="坐席名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="loginName"
        label="登录账号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="200"
        >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small">修改坐席</el-button>
          <!--<el-button @click="seeUserInfoAppList(scope)" type="text" size="small">查看业绩</el-button>-->
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加坐席" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="坐席名称"
          :label-width="formLabelWidth"
          prop="userName"
        >
          <el-input v-model.string="form.userName"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改坐席" :visible.sync="editFlag">
      <el-form :model="form">
        <el-form-item
          label="坐席名称"
          :label-width="formLabelWidth"
          prop="userName"
        >
          <el-input v-model.string="editForm.userName"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitDataEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  export default {
    data() {
      return {
        editFlag:false,
        dialogFormVisible: false,
        form:{
          userName:'',
        },
        editForm:{
          serviceId:null,
          userName:''
        },
        orgId:JSON.parse(localStorage.getItem('userinfo')).id,
        formLabelWidth: '120px',

        tableData: [],
        total:0
      }
    },
    created:function () {
      this.getVendorList();

    },
    methods:{
      getVendorList(){
          this.http.post('http://www.zz1819.com/websocket/webSocket/getVendorUser',{orgId:this.orgId,pagenum:this.pagenum,pagesize:10}).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                  res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              }
            this.total = res.data.total;
            this.tableData = res.data.list;
          }
        })
      },
      handleClick(data){
        this.editFlag = true
        this.editForm.serviceId = data.row.serviceId;
        this.editForm.userName = data.row.userName;
      },
      submitData(){
        if(!this.form.userName) {
          this.$errorMessage('请填写坐席名称')
          return;
        }
        this.form.orgId = this.orgId;
        this.http.post('http://www.zz1819.com/websocket/webSocket/createVendorUser',this.form).then(res=>{
          if(res.code == 0){
              this.$successMessage('添加成功');
              this.dialogFormVisible = false;
              this.getVendorList();
          }
        })
      },
      submitDataEdit(){
        if(!this.editForm.userName) {
          this.$errorMessage('请填写坐席名称')
          return;
        }
        this.editForm.orgId = this.orgId;
        this.http.post('http://www.zz1819.com/websocket/webSocket/updateVendorUser',this.editForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功');
            this.editFlag = false;
            this.getVendorList();
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
