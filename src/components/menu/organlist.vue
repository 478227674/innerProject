<template>
  <div>
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加信息
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
              sortable
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        :formatter="formatter"
        align="center">
      </el-table-column>
      <el-table-column
        align="center"
        label="图片"
      >
        <template slot-scope="scope">
          <img :src="scope.row.head_pic" width="100" height="100" class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small">推荐</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="20">
    </el-pagination>

    <!--dialog删除-->

  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage:1,//当前页数
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          name: '',
          address:'',
          date:'',
          tag:''
        },
        formLabelWidth: '120px',
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          tag: '家',
          head_pic:'https://img0.utuku.china.com/600x0/news/20190802/426b0981-db8e-493a-a6c7-cea22639e3d8.jpg'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          tag: '公司',
          head_pic:'https://img0.utuku.china.com/600x0/news/20190802/426b0981-db8e-493a-a6c7-cea22639e3d8.jpg'

        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          tag: '家',
          head_pic:'https://img0.utuku.china.com/600x0/news/20190802/426b0981-db8e-493a-a6c7-cea22639e3d8.jpg'

        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          tag: '公司',
          head_pic:'https://img0.utuku.china.com/600x0/news/20190802/426b0981-db8e-493a-a6c7-cea22639e3d8.jpg'

        }],
        tagList:[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]
      }
    },
    methods:{
      handleSizeChange(val) {
          //${val} 是当前每页多少条
      },
      handleCurrentChange(val) {
          //切换页码 ${val} 是页码数 请求数据即可
      },
      uploadImg(data){
      },
      uploadSuccess(data){
      },
      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      getDate(val){
      },
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      submitData(){
          for(let i in this.form){
            if(this.form[i]==''){
              this.$message({
                message: '请填写必填值',
                type: 'warning'
              });
              return;
            }
          }
          this.dialogFormVisible = false;
          this.tableData.push(this.form)
          this.$successMessage('恭喜你，这是一条成功消息')
          this.tagList.push({text:this.form.tag,value:this.form.tag})
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
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
