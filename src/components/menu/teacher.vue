<template>
  <div>
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加教师
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
              sortable
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="teacherName"
        label="姓名"
        width="180"
        align="center">
      </el-table-column>

      <el-table-column
        align="center"
        label="图片"
      >
        <template slot-scope="scope">

            <img v-if="scope.row.attachment" :src="scope.row.attachment.fileUrl" width="100" height="100" class="head_pic"/>
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
          <el-button @click="editTeacher(scope)" type="text" size="small">编辑</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--<el-pagination-->
      <!--@size-change="handleSizeChange"-->
      <!--@current-change="handleCurrentChange"-->
      <!--:current-page="currentPage"-->
      <!--:page-sizes="[10, 20, 50, 100]"-->
      <!--:page-size="10"-->
      <!--layout="total, sizes, prev, pager, next, jumper"-->
      <!--:total="20">-->
    <!--</el-pagination>-->
    <!--dialog添加-->
    <el-dialog title="添加教师" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="教师姓名"
          :label-width="formLabelWidth"
          prop="teacherName"
          :rules="[
            { required: true, message: '姓名不能为空'},
          ]"
        >
          <el-input v-model.string="form.teacherName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="教学科目"
          :label-width="formLabelWidth"
          prop="subject"
          :rules="[
            { required: true, message: '科目不能为空'},
          ]"
        >
          <el-input v-model.string="form.subject" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="教师教龄"
          :label-width="formLabelWidth"
          prop="teachAge"
          :rules="[
            { required: true, message: '教龄不能为空'},
          ]"
        >
          <el-input v-model.string="form.teachAge" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="教师标签"
          :label-width="formLabelWidth"
          prop="teacherTag"
          :rules="[
            { required: true, message: '标签不能为空'},
          ]"
        >
          <el-input v-model.string="form.teacherTag" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item
          label="教师国籍"
          :label-width="formLabelWidth"
          prop="nation"
          :rules="[
            { required: true, message: '国籍不能为空'},
          ]"
        >
          <el-input v-model.string="form.nation" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item
          label="描述"
          :label-width="formLabelWidth"
          prop="teacherName"
          :rules="[
            { required: true, message: '描述不能为空'},
          ]"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="form.teacherDesc"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
        </el-form-item>



        <el-form-item label="图片(100*100)" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            :http-request="uploadImg"
          >
            <img v-if="teacherImg" :src="teacherImg" class="avatar-uploader">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑教师" :visible.sync="dialogVisible">
      <el-form :model="editform">
        <el-form-item
          label="教师姓名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editform.teacherName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="教学科目"
          :label-width="formLabelWidth"
          prop="subject"
          :rules="[
            { required: true, message: '科目不能为空'},
          ]"
        >
          <el-input v-model.string="editform.subject" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="教师教龄"
          :label-width="formLabelWidth"
          prop="teachAge"
          :rules="[
            { required: true, message: '教龄不能为空'},
          ]"
        >
          <el-input v-model.string="editform.teachAge" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="教师标签"
          :label-width="formLabelWidth"
          prop="teacherTag"
          :rules="[
            { required: true, message: '标签不能为空'},
          ]"
        >
          <el-input v-model.string="editform.teacherTag" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item
          label="教师国籍"
          :label-width="formLabelWidth"
          prop="nation"
          :rules="[
            { required: true, message: '国籍不能为空'},
          ]"
        >
          <el-input v-model.string="editform.nation" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="描述"
          :label-width="formLabelWidth"
          prop="teacherName"
          :rules="[
            { required: true, message: '描述不能为空'},
          ]"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="editform.teacherDesc"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item label="图片(100*100)" :label-width="formLabelWidth">
          <el-upload
            :show-file-list="false"
            action="apiurl"
            :http-request="uploadImg"
          >
            <img v-if="editform.teacherImg" :src="editform.teacherImg"  class="avatar-uploader">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
    ["blockquote", "code-block"], // 引用  代码块
    [{ header: 1 }, { header: 2 }], // 1、2 级标题
    [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
    [{ script: "sub" }, { script: "super" }], // 上标/下标
    [{ indent: "-1" }, { indent: "+1" }], // 缩进
    // [{'direction': 'rtl'}],                         // 文本方向
    [{ size: ["small", false, "large", "huge"] }], // 字体大小
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
    [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
    [{ font: [] }], // 字体种类
    [{ align: [] }], // 对齐方式
    ["clean"], // 清除文本格式
//    ["link", "image", "video"] // 链接、图片、视频
  ];
  import { quillEditor } from "vue-quill-editor"; //调用编辑器
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  export default {
    data() {
      return {
        apiurl:'',
        editorOption: {
          theme: "snow",
          placeholder: "请输入教师描述...",
          modules: {
            toolbar: {
              container: toolbarOptions,
              // container: "#toolbar",

            }
          }
        }, // or 'bubble'
        dialogFormVisible: false,
        dialogVisible: false,
        form: {
          teacherName: '',
          teacherDesc:'',
          teacherImage:'',
          teacherTag:'',
          nation:'',
          subject:'',
          teachAge:''
        },
        editform: {
          teacherName: '',
          teacherDesc:'',
          teacherImage:'', //记录图片id
          teacherImg:'', //用来展示图片
          teacherTag:'',
          nation:'',
          subject:'',
          teachAge:''
        },
        teacherImg:'',
        formLabelWidth: '120px',
        tableData: [],
        orgId:''
      }
    },
    components: {
      quillEditor
    },
    computed:{

      editor() {
        return this.$refs.myQuillEditor.quill;
      },

    },
    created:function () {
      this.apiurl = this.uplodUrl;
      this.orgId = JSON.parse(localStorage.getItem('userinfo')).id
      this.getTeacherList();
    },
    methods:{
      getTeacherList(){
        this.http.post('/orgTeacher/queryOrgTeacher',{orgId:this.orgId,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
          }
        })
      },
      editTeacher(data){
          this.editform = {
            teacherName: data.row.teacherName,
            teacherDesc:data.row.teacherDesc,
            teacherImage:data.row.teacherImage, //记录图片id
            teacherImg:data.row.attachment.fileUrl, //用来展示图片
            teacherTag:data.row.teacherTag,
            nation:data.row.nation,
            subject:data.row.subject,
            teachAge:data.row.teachAge,
            teacherId:data.row.teacherId
          }
          this.dialogVisible = true;
      },
      uploadImg(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){

              if(this.dialogVisible){
                this.editform.teacherImage = res.data.fileId;
                this.editform.teacherImg = res.data.filePath;
              }else if(this.dialogFormVisible){
                this.form.teacherImage = res.data.fileId;
                this.teacherImg = res.data.filePath;
              }

          }
        })
      },
      submitData(){
        if(!this.form.teacherName){
          this.$errorMessage('请填写教师姓名')
          return;
        }
        if(!this.form.teacherTag){
          this.$errorMessage('请填写教师标签')
          return;
        }
        if(!this.form.nation){
          this.$errorMessage('请填写教师国籍')
          return;
        }
        if(!this.form.subject){
          this.$errorMessage('请填写教师教学科目')
          return;
        }
        if(!this.form.teachAge){
          this.$errorMessage('请填写教师教龄')
          return;
        }
        if(!this.form.teacherDesc){
          this.$errorMessage('请填写教师描述')
          return;
        }
        if(!this.form.teacherImage){
          this.$errorMessage('请上传教师图片')
          return;
        }
        this.form.orgId = this.orgId
        this.http.post('/orgTeacher/saveOrgTeacher',this.form).then(res=>{
            if(res.code == 0){
                this.$successMessage('添加成功');
                this.dialogFormVisible = false;
                this.getTeacherList();
            }
        })
      },
      submitEditData(){
        if(!this.editform.teacherName){
          this.$errorMessage('请填写教师姓名')
          return;
        }
        if(!this.editform.teacherTag){
          this.$errorMessage('请填写教师标签')
          return;
        }
        if(!this.editform.nation){
          this.$errorMessage('请填写教师国籍')
          return;
        }
        if(!this.editform.subject){
          this.$errorMessage('请填写教师教学科目')
          return;
        }
        if(!this.editform.teachAge){
          this.$errorMessage('请填写教师教龄')
          return;
        }
        if(!this.editform.teacherDesc){
          this.$errorMessage('请填写教师描述')
          return;
        }
        if(!this.editform.teacherImage){
          this.$errorMessage('请上传教师图片')
          return;
        }
        this.http.post('/orgTeacher/updateOrDeleteOrgTeacher',this.editform).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功');
            this.dialogVisible = false;
            this.getTeacherList();
          }
        });
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async() => {
            await this.deleteTeacher(data.row.teacherId,data.$index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteTeacher(id,index){
        this.http.post('/orgTeacher/updateOrDeleteOrgTeacher',{teacherId:id,flag:0}).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'info',
              message: '已删除'
            });
            this.tableData.splice(index,1)
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
  .ql-container{
    height: 200px;
  }
  .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg{
    margin-top: 0px;
  }
</style>
