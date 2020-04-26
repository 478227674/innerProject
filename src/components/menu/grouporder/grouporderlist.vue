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
        prop="initiator"
        label="发起人"
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="课程"
        align="center">
      </el-table-column>

      <el-table-column
        prop="groupNum"
        label="规格"
        align="center">
        <template slot-scope="scope">
          {{scope.row.groupNum}}人团
        </template>
      </el-table-column>
      <el-table-column
        prop="nowGroupNum"
        label="目前人数"
        align="center">
        <template slot-scope="scope">
          {{scope.row.nowGroupNum}}人
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">增加人数</el-button>
        </template>
      </el-table-column>
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
        editFlag:false,
        formLabelWidth: '120px',
        pagenum:1,
        total:0,
        orderList:[],
        typeList:[]
      }
    },
    created(){
        this.getGroupOrderList();
    },
    methods:{

      //获取资料列表
      getGroupOrderList(){
        this.http.post('/orgInfo/queryOrderGroupPageList',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.orderList = res.data.list;
            this.total = res.data.total
          }
        })
      },
      handleClick(data){

        this.$prompt('请输入要增加的人数', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then( async ({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入增加的人数后再次提交'
            });
            return;
          }
          var pattern3 = new RegExp("[0-9]+");
          if(!pattern3.test(value)){
            this.$message({
              type: 'info',
              message: '请输入数字'
            });
            return;
          }
          await this.addNumToGroup(value,data.id);
        }).catch(() => {
        });
      },
      addNumToGroup(value,id){
        this.http.post('/orgInfo/addOrderGroupNum',{id:id,num:value}).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '增加成功!'
            });
            this.getGroupOrderList();
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
