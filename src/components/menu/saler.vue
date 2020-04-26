<template>
  <div>
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加销售员
    </el-button>
    <div style="font-size: 16px;color:red;">
      销售员分享产品列表地址 http://pro.taiqiedu.com/h5/html/extendlist.html
      <img src="../../assets/img/seller.png" style="width: 100px;height: 100px;" alt="">
    </div>
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
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="手机号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="inviteCount"
        label="推广人数"
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
          <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
          <el-button @click="seeUserInfoAppList(scope)" type="text" size="small">查看业绩</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加销售员" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="销售员手机号"
          :label-width="formLabelWidth"
          prop="userPhone"
          :rules="[
            { required: true, message: '手机号码不能为空'},
          ]"
        >
          <el-input v-model.string="form.userPhone" oninput = "value=value.replace(/[^\d.]/g,'')"   auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="销售员姓名"
          :label-width="formLabelWidth"
          prop="userName"
          :rules="[
            { required: true, message: '销售员姓名不能为空'},
          ]"
        >
          <el-input v-model.string="form.userName"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="转移业绩" :visible.sync="deleteFlag">
      <el-form :model="form">
        <el-form-item
          label="转移至指定销售员"
          :label-width="formLabelWidth"
        >
          <el-select v-model="deleteUserId"  placeholder="请选择销售员" >
            <el-option
              v-for="item in tableData"
              :key="item.userName"
              :label="item.userName"
              :value="item.userId"
            >
            </el-option>
          </el-select>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteFlag = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="seeUsername" :visible.sync="seeFlag">
      <el-tabs v-model="activeName" @tab-click="handleClickTab">
        <el-tab-pane label="APP分享" name="see1">
          <el-table
            :data="appList"
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
              prop="productName"
              label="分享课程"
              align="center">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="分享时间"
              align="center">
            </el-table-column>
            <el-table-column
              prop="clickNum"
              label="查看次数"
              align="center">
            </el-table-column>

          </el-table>
          <el-pagination
            @current-change="handleCurrentChangeApp"
            :current-page="appPagenum"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="appTotal">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="业务员潜在客户" name="see2">
          <el-table
            :data="h5List"
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
              label="用户昵称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="userPhone"
              label="用户手机号"
              align="center">
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChangeH5"
            :current-page="h5Pagenum"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="h5Total">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="业绩订单" name="see3">
          <el-table
            :data="orderList"
            style="width: 100%">
            <el-table-column
              label="序号"
              align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="productName"
              label="购买课程"
              align="center">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="下单用户"
              align="center">
            </el-table-column>
            <el-table-column
              prop="cTimeStr"
              label="下单时间"
              align="center">
            </el-table-column>
            <el-table-column
              prop="orderPrice"
              label="订单价格"
              align="center">
              <template slot-scope="scope">
                ￥{{scope.row.orderPrice}}
              </template>
            </el-table-column>
            <el-table-column
              prop="payPrice"
              label="实际支付"
              align="center">
              <template slot-scope="scope">
                ￥{{scope.row.payPrice}}
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChangeOrder"
            :current-page="orderPagenum"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="orderTotal">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeFlag = false">取 消</el-button>
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
        activeName:'see1',
        seeFlag:false,
        dialogFormVisible: false,
        dialogVisible: false,
        deleteFlag:false,
        form:{
          userPhone:'',
          userName:'',
        },
        orgId:JSON.parse(localStorage.getItem('userinfo')).id,
        formLabelWidth: '120px',
        tableData: [],
        userlist:[],
        deleteObj:{},
        deleteUserId:null,

        appList:[],
        appPagenum:1,
        appTotal:0,

        h5List:[],
        h5Pagenum:1,
        h5Total:0,

        orderList:[],
        orderPagenum:1,
        orderTotal:0,

        seeUserId:null,
        seeUsername:'销售员业绩'
      }
    },
    created:function () {
      this.getSalerList();

    },
    methods:{
      handleCurrentChangeH5(val){
        this.h5Pagenum = val;
        this.getH5List(this.h5Pagenum);
      },
      handleCurrentChangeApp(val){
        this.appPagenum = val;
        this.getAppList(this.appPagenum);
      },
      handleCurrentChangeOrder(){
        this.orderPagenum = val;
        this.getOrderList(this.orderPagenum);
      },
      seeUserInfoAppList(data){
        this.appList= [];
        this.appPagenum=1;
        this.appTotal=0;
        this.h5List=[];
        this.h5Pagenum=1;
        this.h5Total=0;
        this.orderList=[];
        this.orderPagenum=1;
        this.orderTotal=0;
        this.seeFlag = true;
        this.seeUserId = data.row.userId;
        this.seeUsername = data.row.userName + '-销售员'
        this.getAppList(this.appPagenum)
        this.getPotentialList(this.h5Pagenum)
        this.getOrderList(this.orderPagenum)
      },
      getOrderList(num){
        this.http.post('/orgInfo/querySellUserOrderList',{userId:this.seeUserId,pagenum:num,pagesize:10}).then(res=>{
          if(res.code == 0){
            this.orderTotal = res.data.total;
            this.orderList = res.data.list;
          }
        })
      },
//      getH5List(num){
//        this.http.post('/orgInfo/querySellUserH5MeritInfo',{userId:this.seeUserId,pagenum:num,pagesize:10}).then(res=>{
//          if(res.code == 0){
//            this.h5Total = res.data.total;
//            this.h5List = res.data.list;
//          }
//        })
//      },
      getAppList(num){
          this.http.post('/orgInfo/querySellUserAppMeritInfo',{userId:this.seeUserId,pagenum:num,pagesize:10}).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                var timestamp4 = new Date(res.data.list[i].createTime);
                res.data.list[i].createTime = timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8)
              }
            this.appTotal = res.data.total;
            this.appList = res.data.list;
          }
        })
      },
      getPotentialList(num){
        this.http.post('/orgInfo/queryAllPotentialUserList',{userId:this.seeUserId,orgId:this.orgId,pagesize:10,pageNum:num}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].userName = res.data.list[i].userName[0] + '**'
              res.data.list[i].userPhone = res.data.list[i].userPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
//              res.data.list[i].createTime = res.data.list[i].createTime.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
              var timestamp4 = new Date(res.data.list[i].createTime);
              res.data.list[i].createTime = timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8)

            }
            this.h5Total = res.data.total;
            this.h5List = res.data.list;
          }
        })
      },
      getSalerList(){
        this.http.post('/orgInfo/queryAllSellUser',{orgId:this.orgId}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
          }
        })
      },
      handleClickTab(tab,e){
      },
      getUserId(data){
      },
      submitData(){
        var reg =/^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
        if(!this.form.userPhone || !reg.test(this.form.userPhone)){
          this.$errorMessage('请填写正确的销售员手机号码')
          return;
        }
        if(!this.form.userName) {
          this.$errorMessage('请填写销售员手机号码')
          return;
        }
        this.form.orgId = this.orgId;
        this.http.post('/orgInfo/saveSellUser',this.form).then(res=>{
          if(res.code == 0){
              this.$successMessage('添加成功');
              this.$alert('销售员分享产品列表地址 http://pro.taiqiedu.com/h5/html/extendlist.html', '创建成功', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$message({
                    type: 'info',
                    message: `action: ${ action }`
                  });
                }
              });
              this.dialogFormVisible = false;
              this.getSalerList();
          }
        })
      },
      handleClick(data){
          this.deleteObj = data;
          this.deleteFlag = true;
//        this.$confirm('此操作将永久删除该销售员, 是否继续?', '提示', {
//          confirmButtonText: '确定',
//          cancelButtonText: '取消',
//          type: 'warning',
//          center: true
//        }).then(async() => {
//            console.log(data)
//            await this.deleteTeacher(data.row.userPhone,data.$index);
//        }).catch(() => {
//          this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
//        });
      },
      deleteUser(){
          this.deleteTeacher(this.deleteObj.row.userPhone,this.deleteObj.$index,this.deleteUserId)
      },
      deleteTeacher(id,index,did){
          if(this.deleteObj.row.userId == this.deleteUserId){
            this.$errorMessage('不可选择删除对象作为转移对象')
            return;
          }
        this.http.post('/orgInfo/deleteSellUser',{userPhone:id,userId:did}).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'info',
              message: '已删除'
            });
            this.deleteFlag = false;
            this.deleteObj = {};
            this.deleteUserId = null;
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
