<template>
  <div>
    <el-button @click="addSwiper" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加风采展示
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="图片序号"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        align="center"
        label="图片"
      >
        <template slot-scope="scope">
          <img :src="scope.row.attachment.fileUrl" width="100" height="100" class="head_pic"/>
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
    <!--dialog添加-->
    <el-dialog title="添加图片" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="图片(310*200)" :label-width="formLabelWidth">
          <el-upload
            :on-success="uploadSuccess"
            action="apiurl"
            list-type="picture-card"
            :show-file-list="false"
            :http-request="uploadImg"
          >
            <img v-if="imgUrl" :src="imgUrl" style="width: 100%;height: 100%" class="avatar-uploader">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        imageType:'1',
        orgId:JSON.parse(localStorage.getItem('userinfo')).id,
        form: {
          imageId: '',
        },
        imgUrl:'',
        formLabelWidth: '120px',
        options:[
          {value:'1',label:'产品1'},
          {value:'2',label:'产品2'},
          {value:'3',label:'产品3'},
          {value:'4',label:'产品4'},
          {value:'5',label:'产品5'},
          {value:'6',label:'产品6'},
        ],
        value:'',
        tableData: [

        ],
        goodsList:[],
      }
    },
    created(){
      this.getSwiperList();
      this.getGoodsList();
    },
    methods:{
      getGoodsList(){
        this.http.post('/orgProduct/queryProductList',{orgId:this.orgId,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.goodsList = res.data.list;
          }
        })
      },
      getSwiperList(){
        this.http.post('/orgInfo/queryOrgCycleImage',{relationId:this.orgId,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
          }
        })
      },
      addSwiper(){
          if(this.tableData.length>=4){
            this.$errorMessage('最多可上传4张')
            return;
          }
        this.dialogFormVisible = true
      },
      uploadImg(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.form.imageId = res.data.fileId;
            this.imgUrl = res.data.filePath;
          }
        })
      },
      uploadSuccess(data){
      },
      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitData(){
//      this.form.goods_id = data;
        if(!this.form.imageId){
          this.$errorMessage('请上传轮播图')
          return;
        }
        this.form.relationId = this.orgId;
        this.http.post('/orgInfo/saveOrgCycleImage',this.form).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.dialogFormVisible = false;
            this.getSwiperList();
            this.form = {
              imageId: '',
            }
            this.imgUrl = '';
            this.value = '';
          }
        })
        return;
      },
      getGoodsId(data){
          this.form.cycleValue = data;
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            await this.deleteSwiper(data.row.id,data.$index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteSwiper(id,index){
          this.http.post('/orgInfo/updateOrDeleteOrgCycleImage',{flag:0,id:id}).then(res=>{
              if(res.code == 0){
                this.tableData.splice(index,1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
          })
      },
    },
    watch:{
      imageType(){
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
