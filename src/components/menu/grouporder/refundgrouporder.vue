<template>
  <div>
    <el-table
      :data="orderList"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="电话"
        align="center">
      </el-table-column>

      <el-table-column
        prop="productName"
        label="课程"
        align="center">
      </el-table-column>
      <el-table-column
        prop="nowGroupNum"
        label="拼团规格"
        align="center">
        <template slot-scope="scope">
          {{scope.row.groupNum}}人团
        </template>
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="退款金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="申请时间"
        align="center">
      </el-table-column>
<!--      <el-table-column-->
<!--        fixed="right"-->
<!--        label="操作"-->
<!--        align="center"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button @click="handleClick(scope.row)" type="text" size="small">增加人数</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogFormVisible: false,
        formLabelWidth: '120px',
        pagenum:1,
        total:0,
        orderList:[],
      }
    },
    created(){
        this.getGroupOrderList();
    },
    methods:{

      //获取资料列表
      getGroupOrderList(){
        this.http.post('/orgInfo/queryRefundOrderGroupPageList',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.orderList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleCurrentChange(v){
        this.pagenum = v;
        this.getGroupOrderList();
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
