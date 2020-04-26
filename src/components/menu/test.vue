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
        prop="tag"
        label="标签"
        width="100"
        :filters="tagList"
        :filter-method="filterTag"
        filter-placement="bottom-end"
        align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.tag === '家' ? 'primary' : 'success'"
            close-transition>{{scope.row.tag}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
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
    <!--dialog添加-->
    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="姓名"
          :label-width="formLabelWidth"
          prop="name"
          :rules="[
            { required: true, message: '姓名不能为空'},
          ]"
        >
          <el-input v-model.string="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="日期"
          prop="date"
          :label-width="formLabelWidth"
          :rules="[
            { required: true, message: '日期不能为空'},
          ]"
        >
          <el-date-picker
            style="width: 100%"
            v-model="form.date"
            type="datetime"
            size="large"
            @change="getDate"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth"
            prop="address"
            :rules="[
            { required: true, message: '地址不能为空'},
          ]"
        >
          <el-input v-model.string="form.address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="标签" :label-width="formLabelWidth"
          prop="tag"
          :rules="[
            { required: true, message: '标签不能为空'},
          ]"
        >
          <el-input v-model.string="form.tag" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            :on-success="uploadSuccess"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">

            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
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
