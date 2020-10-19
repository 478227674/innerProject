<template>
  <div>
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加动态消息
    </el-button>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="messageId"
        label="ID"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="messageTitle"
        label="消息标题"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="消息详情"
        align="center">
        <template slot-scope="scope">
          <div v-html="scope.row.messageContent"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope">
        <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
        <el-button @click="editMessage(scope)" type="text" size="small">编辑</el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog title="添加动态消息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="信息标题"
          :label-width="formLabelWidth"
          prop="messageContent"

        >
          <el-input v-model.string="form.messageTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="信息详情"
          prop="pushType"
          :label-width="formLabelWidth"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="form.messageContent"
            ref="myQuillEditor"
            :options="editorOption"
          ></quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId"  id="uniqueId">
          </el-upload >
        </el-form-item>

        <el-form-item
          label="绑定产品"
          :label-width="formLabelWidth"
        >
          <el-select v-model="form.productId" placeholder="请选择">
            <el-option
              v-for="item in plist"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑动态消息" :visible.sync="dialogTableVisible">
      <el-form :model="form">
        <el-form-item
          label="信息标题"
          :label-width="formLabelWidth"
          prop="messageContent"

        >
          <el-input v-model.string="editform.messageTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="信息详情"
          prop="pushType"
          :label-width="formLabelWidth"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="editform.messageContent"
            ref="myQuillEditor"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>

        <el-form-item
          label="绑定产品"
          :label-width="formLabelWidth"
        >
          <el-select v-model="editform.productId" placeholder="请选择">
            <el-option
              v-for="item in plist"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </div>
    </el-dialog>
    <!--dialog删除-->
  </div>
</template>

<script>
  import { quillEditor } from "vue-quill-editor"; //调用编辑器
  import configUrl from '../../config'
  import { mapActions } from 'vuex';
  import QRCode  from "qrcodejs2"
  import qs from 'qs';
  import axios from 'axios'
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import citydata from '../../api/city.data'
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
    ["link", "image"] // 链接、图片、视频
  ];

  export default {
    data() {
      return {
        apiurl:'',
        editorOption: {
          theme: "snow",
          placeholder: "请输入消息详情...",
          modules: {
            toolbar: {
              container: toolbarOptions,
              handlers: {
                'image': function (value) {
                  if (value) {
                    var fileInput =document.querySelector('#uniqueId input') //隐藏的file元素
                    fileInput.click() //触发事件
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
              //container: "#toolbar",
            }
          }
        },

        currentPage:1,//当前页数
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogVisible: false,
        form: {
          messageTitle: '',
          orgId:JSON.parse(localStorage.getItem('userinfo')).id,
          messageContent:'',
          productId:null,
          productType:null,
        },
        editform:{
          messageTitle: '',
          messageId:'',
          productId:null,
          productType:null,
          messageContent:'',
        },
        formLabelWidth: '120px',
        tableData: [],
        pagenum:1,
        total:0,
        plist:[]
      }
    },
    components: {
      quillEditor,
    },
    created(){
      this.getMessageList();
      this.getProductList();
    },
    methods:{
      //编辑器图
      getEditorImg(file){
        this.$uploadImg(file).then(res=>{
          if(res.code == 0){
            let range = this.$refs.myQuillEditor.quill.getSelection();
            this.$refs.myQuillEditor.quill.insertEmbed(range != null?range.index:0, 'image',res.data.filePath)
          }
        })
      },
      //获取课程
      getProductList(){
        this.http.post('/orgInfo/queryAllProductList',{orgId:this.form.orgId,pageNum:1,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.plist = res.data;
          }
        })
      },
      editMessage(data){
        this.dialogTableVisible = true;
        this.editform.messageTitle = data.row.messageTitle;
        this.editform.messageId = data.row.messageId;
        if(data.row.productId){
          this.editform.productId = data.row.productId;
          this.editform.productType = data.row.productType;
        }
        this.editform.messageContent = data.row.messageContent;
      },
      getMessageList(){
        this.http.post('/orgInfo/queryOrgMessageDynamicList',{orgId:this.form.orgId,pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleCurrentChange(val) {
          this.pagenum = val;
          this.getMessageList()
      },
      submitEditData(){
        if(!this.editform.messageTitle){
          this.$errorMessage('请填写推送标题')
          return;
        }
        if(!this.editform.messageContent){
          this.$errorMessage('请填写推送内容')
          return;
        }
        if(this.editform.productId){
          for(var i=0;i<this.plist.length;i++){
            if(this.editform.productId == this.plist[i].productId){
              this.editform.productType = this.plist[i].imageType;
            }
          }
        }
//        this.editform.orgId = JSON.parse(localStorage.getItem('userinfo')).id;
        this.http.post('/orgInfo/updateOrgMessageDynamic',this.editform).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.dialogTableVisible = false;
            this.getMessageList();
          }
        })
      },
      submitData(){
        if(!this.form.messageTitle){
          this.$errorMessage('请填写推送标题')
          return;
        }
        if(!this.form.messageContent){
          this.$errorMessage('请填写推送内容')
          return;
        }
        if(this.form.productId){
            for(var i=0;i<this.plist.length;i++){
                if(this.form.productId == this.plist[i].productId){
                    this.form.productType = this.plist[i].imageType;
                }
            }
        }
        this.form.orgId = JSON.parse(localStorage.getItem('userinfo')).id;
        this.http.post('/orgInfo/saveOrgMessageDynamic',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.dialogFormVisible = false;
            this.getMessageList();
          }
        })
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteMessage(data.row.messageId)

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteMessage(id){
        this.http.post('/orgInfo/deleteOrgMessageDynamic',{messageId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getMessageList();
          }
        })
      },
    },
    watch:{

    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
