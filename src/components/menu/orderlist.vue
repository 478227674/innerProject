<template>
  <div>
    <div>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="searchOrderByType" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="userName"
        label="用户昵称"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="消费金额"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="购买课程"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus==0">未付款</span>
          <span v-if="scope.row.orderStatus==1">已支付</span>
          <span v-if="scope.row.orderStatus==2">已过期</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage:1,//当前页数
        formLabelWidth: '120px',
        tableData: [],
        pagenum:1,
        pagesize:10,

        total:0,//消费记录总数
        userphone:'',
        options:[{
          value: '0',
          label: '未支付'
        }, {
          value: '1',
          label: '已支付'
        }, {
          value: '2',
          label: '已过期'
        }],
        value:'',

      }
    },
    created:function () {
      this.getUserPayList()
    },
    methods:{
      getUserPayList(sta){
          var obj = {pagenum:this.pagenum,pagesize:this.pagesize,orgId:JSON.parse(localStorage.getItem('userinfo')).id}
          if(sta == 0 || sta == 1 || sta == 2){
              obj.orderStatus = sta
          }
        this.http.post('/orgInfo/queryAllOrderList',obj).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      searchOrderByType(){
          this.pagenum = 1;
          this.tableData = [];
          this.getUserPayList(this.value)
      },

      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getUserPayList(this.value);
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
