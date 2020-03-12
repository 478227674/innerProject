<template>
  <div>
    <el-button @click="addFileType" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加资料类型
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="typeId"
        label="ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="资料类型"
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
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="updateFileType(scope.row)" type="text" size="small">编辑</el-button>
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
        tableData: [],
        pagenum:1,
        total:0,
      }
    },
    created(){
        this.getFileTypeList();
    },
    methods:{
      handleCurrentChange(v){
          this.pagenum = v;
          this.getFileTypeList();
      },
      //获取资料类型
      getFileTypeList(){
        this.http.post('/orgInfo/queryDatumTypePageList',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                  res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              }
              this.tableData = res.data.list;
              this.total = res.data.total
          }
        })
      },

      //添加资料类型
      addFileType(){
        this.$prompt('请输入资料类型标题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入分类标题'
            });
            return;
          }
          this.addFileTypeFn(value);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      addFileTypeFn(name){
        this.http.post('/orgInfo/saveDatumType',{typeName:name}).then(res=>{
          if(res.code == 0){
            this.getFileTypeList();
          }
        })
      },
      //编辑资料类型
      updateFileType(data){
        this.$prompt('请输入资料类型标题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:data.typeName
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入分类标题'
            });
            return;
          }
          this.updateName(value,data.typeId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      updateName(name,id){
        this.http.post('/orgInfo/updateDatumType',{typeId:id,typeName:name}).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getFileTypeList();
          }
        })
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletFileType(data.typeId)
        }).catch(() => {

        });
      },
      deletFileType(id){
        this.http.post('/orgInfo/deleteDatumType',{typeId:id}).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getFileTypeList();
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
