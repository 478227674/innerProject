<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label=APP轮播图 name="first">
      <el-button @click="addSwiper" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加轮播图
      </el-button>
      <el-table
        :data="tableData"
        style="width: 100%">

        <el-table-column
          label="轮播图序号"
          sortable
          width="180"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
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
          prop="imageType"
          label="跳转"
          align="center">
          <template  slot-scope="scope">
            <span v-if="scope.row.imageType==1">跳转机构</span>
            <span v-if="scope.row.imageType==2 || scope.row.imageType==5">跳转特价产品</span>
            <div></div>
            <span v-if="scope.row.imageType==6">跳转砍价列表</span>
            <span v-if="scope.row.imageType==7">跳转拼团列表</span>
            <div></div>
            <span v-if="scope.row.imageType==8">跳转靶向训练</span>
            <span v-if="scope.row.imageType==9">跳转单词记忆</span>
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
      <el-dialog title="添加轮播图" :visible.sync="dialogFormVisible">

        <el-form :model="form" >
          <el-form-item label="产品活动" :label-width="formLabelWidth">
            <template class="a1">

              <div>
                <el-radio v-model="form.imageType" label="1">跳转机构</el-radio>
                <el-radio v-model="form.imageType" label="2">跳转产品</el-radio>
                <el-radio v-model="form.imageType" label="8">跳转靶向训练</el-radio>
              </div>
              <div>
                <el-radio v-model="form.imageType" label="9">跳转单词记忆</el-radio>
                <el-radio v-model="form.imageType" label="4">跳转优惠产品</el-radio>
                <el-radio v-model="form.imageType" label="5">跳转特价列表</el-radio>
              </div>
              <div>
                <el-radio v-model="form.imageType" label="6">跳转砍价列表</el-radio>
                <el-radio v-model="form.imageType" label="7">跳转拼团列表</el-radio>
              </div>

            </template>
          </el-form-item>
          <el-form-item v-if="form.imageType==1" label="跳转机构" :label-width="formLabelWidth">
            <template>
              <el-select  v-model="form.orgId" placeholder="请选择"  filterable >
                <el-option
                  v-for="item in orgList"
                  :key="item.orgName"
                  :label="item.orgName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item v-if="form.imageType==2" label="跳转产品" :label-width="formLabelWidth">
            <el-select v-model="form.productId" placeholder="请选择" filterable >
              <el-option
                v-for="item in goodsList"
                :label="item.productName"
                :key="item.productName"
                :value="item.productId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.imageType==4" label="跳转优惠产品" :label-width="formLabelWidth">
            <el-select v-model="form.productId" placeholder="请选择" filterable >
              <el-option
                v-for="item in activeList"
                :label="item.productName"
                :key="item.productName"
                :value="item.productId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片(750*280像素)" :label-width="formLabelWidth">
            <el-upload
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
    </el-tab-pane>
    <el-tab-pane label="PC轮播图" name="second">
      <el-button @click="addSwiper" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加轮播图
      </el-button>
      <el-table
        :data="tableData"
        style="width: 100%">

        <el-table-column
          label="轮播图序号"
          sortable
          width="180"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
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
          prop="imageType"
          label="跳转"
          align="center">
          <template  slot-scope="scope">
            <span v-if="scope.row.imageType==1">跳转机构</span>
            <span v-if="scope.row.imageType==2 || scope.row.imageType==5">跳转特价产品</span>
            <div></div>
            <span v-if="scope.row.imageType==6">跳转砍价列表</span>
            <span v-if="scope.row.imageType==7">跳转拼团列表</span>
            <div></div>
            <span v-if="scope.row.imageType==8">跳转靶向训练</span>
            <span v-if="scope.row.imageType==9">跳转单词记忆</span>
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
      <el-dialog title="添加轮播图" :visible.sync="dialogFormVisible">

        <el-form :model="form" >
          <el-form-item label="产品活动" :label-width="formLabelWidth">
            <template class="a1">

              <div>
                <el-radio v-model="form.imageType" label="1">跳转机构</el-radio>
                <el-radio v-model="form.imageType" label="2">跳转产品</el-radio>
                <el-radio v-model="form.imageType" label="8">跳转靶向训练</el-radio>
              </div>
              <div>
                <el-radio v-model="form.imageType" label="9">跳转单词记忆</el-radio>
                <el-radio v-model="form.imageType" label="4">跳转优惠产品</el-radio>
                <el-radio v-model="form.imageType" label="5">跳转特价列表</el-radio>
              </div>
              <div>
                <el-radio v-model="form.imageType" label="6">跳转砍价列表</el-radio>
                <el-radio v-model="form.imageType" label="7">跳转拼团列表</el-radio>
              </div>

            </template>
          </el-form-item>
          <el-form-item v-if="form.imageType==1" label="跳转机构" :label-width="formLabelWidth">
            <template>
              <el-select  v-model="form.orgId" placeholder="请选择"  filterable >
                <el-option
                  v-for="item in orgList"
                  :key="item.orgName"
                  :label="item.orgName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item v-if="form.imageType==2" label="跳转产品" :label-width="formLabelWidth">
            <el-select v-model="form.productId" placeholder="请选择" filterable >
              <el-option
                v-for="item in goodsList"
                :label="item.productName"
                :key="item.productName"
                :value="item.productId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.imageType==4" label="跳转优惠产品" :label-width="formLabelWidth">
            <el-select v-model="form.productId" placeholder="请选择" filterable >
              <el-option
                v-for="item in activeList"
                :label="item.productName"
                :key="item.productName"
                :value="item.productId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片(750*280像素)" :label-width="formLabelWidth">
            <el-upload
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
    </el-tab-pane>
  </el-tabs>

</template>

<script>
  export default {
    data() {
      return {
        dialogFormVisible: false,
        editFlag:false,
        form: {
          typeId: '',
          orgId:JSON.parse(localStorage.getItem('userinfo')).id,
          datumName:'',
          datumUrl:'',
        },
        editform: {
          typeId: '',
          orgId:JSON.parse(localStorage.getItem('userinfo')).id,
          datumName:'',
          datumUrl:'',
          datumId:'',
        },
        formLabelWidth: '120px',
        pagenum:1,
        total:0,
        fileList:[],
        typeList:[]
      }
    },
    created(){
        this.getFileTypeList();
        this.getFileList();
    },
    methods:{
      //编辑资料
      updateFile(data){
          this.editform = {
            typeId: data.typeId,
            orgId:data.orgId,
            datumName:data.datumName,
            datumUrl:data.datumUrl,
            datumId:data.datumId,
          }
          this.editFlag = true;
      },
      //编辑的时候获取url
      getEditFormPdfUrl(data){
          this.editform.datumUrl = data.file.filePath;
      },
      //添加的时候获取url
      getFormPdfUrl(data){
        this.form.datumUrl = data.file.filePath;
      },
      //编辑
      submitEditData(){
        if(!this.editform.datumName){
          this.$errorMessage('请输入资料名称')
          return;
        }
        if(!this.editform.typeId){
          this.$errorMessage('请选择资料类型')
          return;
        }
        if(!this.editform.datumUrl){
          this.$errorMessage('请上传PDF资料')
          return;
        }
        this.http.post('/orgInfo/updateDatum',this.editform).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑资料成功')
            this.getFileList();
          }
        })
      },
      //添加资料
      submitData(){
        if(!this.form.datumName){
          this.$errorMessage('请输入资料名称')
          return;
        }
        if(!this.form.typeId){
          this.$errorMessage('请选择资料类型')
          return;
        }
        if(!this.form.datumUrl){
          this.$errorMessage('请上传PDF资料')
          return;
        }
        this.http.post('/orgInfo/saveDatum',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加资料成功')
            this.getFileList();
          }
        })
      },

      //上传资料
      uploadPdfFile(data){
        this.$uploadPdf(data).then(res=>{
          if(res.code == 0){
//            if(this.dialogVisible){
//              this.editform.imageId = res.data.fileId;
//              this.editform.couponImage = res.data.filePath;
//            }else if(this.dialogFormVisible){
//              this.form.imageId = res.data.fileId;
//              this.form.couponImage = res.data.filePath;
//            }
          }
        })
      },
      //获取资料类型
      getFileTypeList(){
        this.http.post('/orgInfo/queryDatumTypePageList',{pageNum:1,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.typeList = res.data.list;
          }
        })
      },
      //获取资料列表
      getFileList(){
        this.http.post('/orgInfo/queryDatumPageList',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.fileList = res.data.list;
            this.total = res.data.total
          }
        })
      },
      handleClick(data){

        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletFileFn(data.datumId)
        }).catch(() => {

        });
      },
      deletFileFn(id){
        this.http.post('/orgInfo/deleteDatum',{datumId:id}).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getFileList();
          }
        })
      },
      handleCurrentChange(v){
        this.pagenum = v;
        this.getFileList();
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
