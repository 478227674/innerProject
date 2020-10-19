<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="productName"
        label="课程名称"
        align="center">
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
        prop="isRecom"
        label="状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isRecom==1">已推荐</span>

        </template>
      </el-table-column>


      <el-table-column
        prop="productPrice"
        label="课程价格"
        align="center">
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        label="课程封面"
        align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">推荐</el-button>

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
      this.getFreeProductList()
    },
    methods:{
      getFreeProductList(){
          var obj = {pagenum:this.pagenum,pagesize:this.pagesize,orgId:JSON.parse(localStorage.getItem('userinfo')).id}

        this.http.post('orgProduct/queryTryProductList',obj).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getUserPayList(this.value);
      },
      handleClick(data){
          var obj = {
            orgId:JSON.parse(localStorage.getItem('userinfo')).id,
            imageType:data.imageType,
            productId:data.productId
          }
        this.http.post('/orgProduct/recomTryProduct',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('推荐成功')
            this.getFreeProductList();
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
</style>
