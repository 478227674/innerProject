<template>
  <div>
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      上传资料
    </el-button>
    <el-table
      :data="fileList"
      style="width: 100%">
      <el-table-column
        prop="datumId"
        label="ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="datumName"
        label="资料名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="datumUrl"
        label="资料地址"
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
          <el-button @click="updateFile(scope.row)" type="text" size="small">编辑</el-button>
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
    <!--上传资料-->
    <el-dialog title="上传资料" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="资料名称"
          :label-width="formLabelWidth"

        >
          <el-input v-model.string="form.datumName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="选择资料类型"
          prop="date"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.typeId" filterable  placeholder="请选择资料类型" >
            <el-option
              v-for="item in typeList"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="选择资料"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="upload-demo"
            drag
            :on-success="getFormPdfUrl"
            action="http://qk.taiqiedu.com/tqshoop/org/file/uploadPDF"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处(只限PDF格式)，或<em>点击上传</em></div>
            <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑资料-->

    <el-dialog title="编辑资料" :visible.sync="editFlag">
      <el-form :model="form">
        <el-form-item
          label="资料名称"
          :label-width="formLabelWidth"

        >
          <el-input v-model.string="editform.datumName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="选择资料类型"
          prop="date"
          :label-width="formLabelWidth"
        >
          <el-select v-model="editform.typeId" filterable  placeholder="请选择资料类型" >
            <el-option
              v-for="item in typeList"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="选择资料"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="upload-demo"
            drag
            :on-success="getEditFormPdfUrl"
            action="http://qk.taiqiedu.com/tqshoop/org/file/uploadPDF"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处(只限PDF格式)，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">{{editform.datumUrl}}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
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
