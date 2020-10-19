<template>
  <div style="padding: 20px;">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="免费订单" name="first">
        <el-table
          :data="freeList"
          style="width: 100%">
          <el-table-column
            prop="userName"
            label="学员"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userPhone"
            label="电话"
            align="center">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="课程名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            label="课程封面"
            width="100"
            align="center">
            <template slot-scope="scope">
              <img style="width:100px;" :src="scope.row.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="payPrice"
            label="课程类型"
            width="180"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isCut==1">砍价</span>
              <span v-if="scope.row.isGroup==1">拼团</span>
              <span v-if="scope.row.isGroup!=1 && scope.row.isCut!=1">普通课程</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="productPrice"
            label="课程价格"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payTime"
            label="支付时间"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

      </el-tab-pane>
      <el-tab-pane label="销售订单" name="third">

        <el-table
          :data="payList"
          style="width: 100%">
          <el-table-column
            prop="userName"
            label="学员"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userPhone"
            label="电话"
            align="center">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="课程名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            label="课程封面"
            width="100"
            align="center">
            <template slot-scope="scope">
              <img style="width:100px;" :src="scope.row.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="payPrice"
            label="课程类型"
            width="180"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isCut==1">砍价</span>
              <span v-if="scope.row.isGroup==1">拼团</span>
              <span v-if="scope.row.isGroup!=1 && scope.row.isCut!=1">普通课程</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="productPrice"
            label="课程价格"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payTime"
            label="支付时间"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange1"
          :current-page="pagenum1"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total1">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="查询订单" name="second">
        <div style="margin-bottom: 10px;">
          <el-select v-model="searchForm.createTime" placeholder="请选择">
            <el-option
              :key="null"
              label="请选择"
              :value="null">
            </el-option>
            <el-option
              v-for="item in searchChoose"
              :key="item.createTime"
              :label="item.productName"
              :value="item.createTime">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="setTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button @click="searchStudent" type="primary">搜索</el-button>

        </div>
        <el-table
          :data="allList"
          style="width: 100%">
          <el-table-column
            prop="userName"
            label="学员"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userPhone"
            label="电话"
            align="center">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="课程名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            label="课程封面"
            width="100"
            align="center">
            <template slot-scope="scope">
              <img style="width:100px;" :src="scope.row.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="payPrice"
            label="课程类型"
            width="180"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isCut==1">砍价</span>
              <span v-if="scope.row.isGroup==1">拼团</span>
              <span v-if="scope.row.isGroup!=1 && scope.row.isCut!=1">普通课程</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="productPrice"
            label="课程价格"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payTime"
            label="支付时间"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange2"
          :current-page="pagenum2"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total2">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  export default {
    data() {
      return {
        activeName:'first',
        freeList:[],
        payList:[],
        allList:[],
        orgId:JSON.parse(localStorage.getItem('userinfo')).id,
        pagenum:1,
        total:0,
        pagenum1:1,
        total1:0,
        pagenum2:1,
        total2:0,
        searchForm:{
          productId:"",
          productType:'',
          longStartTime:'',
          longEndTime:'',
        },
        setTime:'',
        searchChoose:[],
        choosedobj:''
      }
    },
    created(){
      this.getList();
      this.getList1();
      this.getList2();
      this.getSearchProductList();
    },
    methods:{
      getChooseProduct(data){
          this.choosedobj = data;
      },
      getSearchProductList(){
        this.http.post('/orgProduct/queryProductList',{orgId:this.orgId,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.searchChoose = res.data.list;
          }
        })
      },
      //搜索订单按钮
      searchStudent(){
        this.pagenum2 = 1;
        if(this.setTime.length>0){
          var st = this.setTime[0];
          var en = this.setTime[1];
          this.searchForm.longStartTime = new Date(st).getTime()/1000;
          this.searchForm.longEndTime = new Date(en).getTime()/1000;
        }
        for(var i=0;i<this.searchChoose.length;i++){
          if(this.searchForm.createTime == this.searchChoose[i].createTime){
              this.searchForm.productId = this.searchChoose[i].productId;
              this.searchForm.productType = this.searchChoose[i].productType;
            }
        }
        this.getList2();
      },
      getList(){
          this.http.post('/orgInfo/queryZeroOrderList',{orgId:this.orgId,pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].payTime = this.formatTimeToDay(res.data.list[i].payTime)
            }
            this.freeList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      getList1(){
        this.http.post('/orgInfo/queryNoZeroAllOrderList',{orgId:this.orgId,pageNum:this.pagenum1,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].payTime = this.formatTimeToDay(res.data.list[i].payTime)
            }
            this.payList = res.data.list;
            this.total1 = res.data.total;

          }
        })
      },
      getList2(){
        this.searchForm.orgId = this.orgId;
        this.searchForm.pageNum = this.pagenum2;
        this.searchForm.pageSize = 10;
        this.http.post('/orgInfo/queryAllOrderList', this.searchForm).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].payTime = this.formatTimeToDay(res.data.list[i].payTime)
            }
            this.allList = res.data.list;
            this.total2 = res.data.total;
          }
        })
      },
      //切换页
      handleCurrentChange(v){
          this.pagenum = v;
          this.getList();
      },
      handleCurrentChange1(v){
          this.pagenum1 = v;
          this.getList1()
      },
      handleCurrentChange2(v){
        this.pagenum2 = v;
        this.getList2()
      },
    },
  }
</script>

<style>
  .ql-container,.ql-editor{
    height: 200px !important;
  }
</style>
