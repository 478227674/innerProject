<template>

  <div>
    <el-button @click="addStageFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加阶段
    </el-button>

    <el-input style="width: 200px;" placeholder="请输入阶段名称" v-model.string="searchName" auto-complete="off"></el-input>
    <el-button @click="searchStage" type="primary">搜索</el-button>

    <div style="clear: both"></div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="stageId"
        label="ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="stageName"
        label="阶段名称"
        align="center">
      </el-table-column>

      <el-table-column
        prop="isBranch"
        label="是否分校"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isBranch == 1">是</span>
          <span v-if="scope.row.isBranch == 0">否</span>
        </template>
      </el-table-column>



      <el-table-column
        prop="createTime"
        label="创建日期"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="editStage(scope)" type="text" size="small">编辑</el-button>
          <el-button @click="seeProductClass(scope)" type="text" size="small">查看课时</el-button>
          <el-button @click="deleteStage(scope.row)" type="text" size="small">删除阶段</el-button>
          <el-button @click="uplpadPdfToStage(scope.row)" type="text" size="small">上传讲义</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="stagenum"
      layout="total, prev, pager, next, jumper"
      :total="stagetotal">
    </el-pagination>
    <!--查看课时-->
    <el-dialog title="课程课时" width="80%" :visible.sync="seeClassFlag">
      <el-button @click="addClassFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        新增课时
      </el-button>
      <el-button @click="copyFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        复制到其他阶段
      </el-button>
      <el-button @click="deleteVideos" style="float: left;margin-bottom: 10px;" icon="el-icon-delete">
        下架课时
      </el-button>
      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="keshiList"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="课时序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="videoName"
          label="课时标题"
          align="center">
        </el-table-column>
        <el-table-column
          prop="subjectName"
          label="课时所属科目"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isTry"
          label="是否试听"
          align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.isTry == 0">否</span>
            <span v-show="scope.row.isTry == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="onLine"
          label="是否在线"
          align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.onLine == 0">否</span>
            <span v-show="scope.row.onLine == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          type="index"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <el-button v-show="scope.row.lineVideoUrl" @click="seeVideo(scope.row)" type="info" size="mini">试看视频</el-button>
            <el-button @click="updateKeshi(scope.row)" type="info" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="khandleCurrentChange"
        :current-page="kpagenum"
        layout="total, prev, pager, next, jumper"
        :total="ktotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeClassFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--添加课时-->
    <el-dialog title="新增课时" width="80%" :visible.sync="addClassFlag">
      <el-form :model="keshiObj">
        <el-form-item
          :label-width="formLabelWidth"
          label="课时标题"
        >
          <el-input  v-model.string="keshiObj.videoName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时类别" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="keshiObj.onLive" label="1" >直播</el-radio>
            <el-radio v-model="keshiObj.onLive" label="0" >非直播</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="课时类别" :label-width="formLabelWidth" v-show="keshiObj.onLive==1">
          <template>
            <el-radio v-model="keshiObj.scene" label="0" >大讲堂</el-radio>
            <el-radio v-model="keshiObj.scene" label="1" >小班课</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="视频ID"
          v-show="keshiObj.onLive==0"
        >
          <el-input  v-model.string="keshiObj.lineVideoUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="排序"
        >
          <el-input placeholder="默认为9999" v-model.string="keshiObj.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="起始时间"
          prop="pushTitle"
          v-show="keshiObj.onLive==1"
        >
          <el-date-picker
            v-model="seTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="keshiObj.subjectId" placeholder="请选择">
            <el-option
              v-for="item in keshiSubjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否试听" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="keshiObj.isTry" label="1" >是</el-radio>
            <el-radio v-model="keshiObj.isTry" label="0" >否</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClassFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddKeshi">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑课时-->
    <el-dialog title="编辑课时" width="80%" :visible.sync="editUpdateFlag">
      <el-form :model="editKeshiObj">
        <el-form-item
          :label-width="formLabelWidth"
          label="课时标题"
          prop="pushTitle"
        >
          <el-input  v-model.string="editKeshiObj.videoName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时类别" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editKeshiObj.onLive" label="1" >直播</el-radio>
            <el-radio v-model="editKeshiObj.onLive" label="0" >非直播</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="视频ID"
          v-show="editKeshiObj.onLive==0"
        >
          <el-input  v-model.string="editKeshiObj.lineVideoUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="排序"
        >
          <el-input placeholder="默认为9999" v-model.string="editKeshiObj.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="起始时间"
          prop="pushTitle"
          v-show="editKeshiObj.onLive==1"
        >
          <el-date-picker
            v-model="seTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="editKeshiObj.subjectId" placeholder="请选择">
            <el-option
              v-for="item in keshiSubjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否试听" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editKeshiObj.isTry" label="1" >是</el-radio>
            <el-radio v-model="editKeshiObj.isTry" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否上线" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editKeshiObj.onLine" label="1" >是</el-radio>
            <el-radio v-model="editKeshiObj.onLine" label="0" >否</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUpdateFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditKeshi">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加阶段-->
    <el-dialog title="新增阶段" width="80%" :visible.sync="addStageFlag">
      <el-form :model="stageobj">
        <el-form-item
          :label-width="formLabelWidth"
          label="阶段标题"
        >
          <el-input  v-model.string="stageobj.stageName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="是否分校"
        >
          <el-select v-model="stageobj.isBranch" filterable placeholder="请选择">
            <el-option
              label="否"
              value="0">
            </el-option>
            <el-option
              label="是"
              value="1">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStageFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddStage">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑阶段-->
    <el-dialog title="编辑阶段" width="80%" :visible.sync="editStageFlag">
      <el-form :model="editstageobj">
        <el-form-item
          :label-width="formLabelWidth"
          label="阶段标题"
        >
          <el-input  v-model.string="editstageobj.stageName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="是否分校"
        >
          <el-select v-model="editstageobj.isBranch" filterable placeholder="请选择">
            <el-option
              label="否"
              value="0">
            </el-option>
            <el-option
              label="是"
              value="1">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStageFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditStage">确 定</el-button>
      </div>
    </el-dialog>
    <!--复制课时弹层-->
    <el-dialog title="复制课时" width="80%" :visible.sync="copyFlag">
      <el-form :model="copyobj">
        <el-form-item
          :label-width="formLabelWidth"
          label="选择阶段"
        >
          <el-select v-model="copyobj.cpStageId" filterable placeholder="请选择">
            <el-option
              v-for="item in copyStageList"
              :key="item.stageId"
              :label="item.stageName"
              :value="item.stageId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copyFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitCopy">确 定</el-button>
      </div>
    </el-dialog>
    <!--试看视频-->
    <el-dialog title="查看视频" width="80%" :visible.sync="seeVideoFlag">
      <video style="width:80%;margin:20px auto;display: block;"  controls="controls" :src="videoUrl"></video>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeVideoFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--上传资料-->
    <el-dialog title="上传资料" :visible.sync="uploadFlag">
      <el-form :model="form">
        <el-form-item
          label="选择资料"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="upload-demo"
            drag
            :file-list="fileList"
            :on-success="getFormPdfUrl"
            action="http://wk.xhcedu.com/tqshoop/org/file/uploadPDF"
          >
            <!--            action="http://192.168.1.209:8080/tqxhc_war_exploded/org/file/uploadPDF"-->
            <!--            action="http://wk.xhcedu.com/tqshoop/org/file/uploadPDF"-->
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处(只限PDF格式)，或<em>点击上传</em></div>
            <!--<div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deletePdf">删 除</el-button>
        <el-button type="primary" @click="submitEditStage">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        tableData:[],
        formLabelWidth:'120px',
        flag:false,
        seeId:null,//当前查看的课时的课程ID
        seeType:null,//当前查看的课时的课程ID
        seeClassFlag:false,//控制是否显示课时列表
        addClassFlag:false,//控制添加课时
        kpagenum:1,
        ktotal:0,
        keshiList:[],
        keshiObj:{
          scene:'0',
          stageId:null,
          subjectId:null,
          productId:'',
          videoName:'',
          longStartTime:'',
          longEndTime:'',
          isTry:'0',//是否试听 0否 1是
          lineVideoUrl:'',//不是直播的话 需要传视频ID
          onLive:'0',
          sort:null,
        },
        editKeshiObj:{},//编辑课时
        editUpdateFlag:false,//编辑课时控制
        seTime:'',
        subjectList:[],
        subjectList1:[],
        keshiSubjectList:[],

        stageFlag:false,
        addStageFlag:false,
        stageobj:{
          stageName:'',
          sortId:'4',
          isBranch:'0'
        },
        stagenum:1,
        stagetotal:0,
        editStageFlag:false,
        editstageobj:{
          stageId:'4',
          stageName:'',
          sortId:'',
          datumUrl:'',
          editstageobj:'',
        },
        uploadFlag:false,
        form:{},
        stageSubjectList:[], //课程的学科列表
        stageSortId:null, //当前查看的学科id
        seeStageId:'',

        seeVideoFlag:false,
        videoUrl:'',

        copyList:[], //复制列表
        copyFlag:false,//符合弹层
        copyobj:{
          productVideoIds:[],
          cpStageId:null,
        },
        copyAllList:[],
        chooseProduct:{},


        copyStageList:[],
        isCopyToStage:'0',

        sortList:[],
        sortId:null,
        searchName:'',
        fileList:[],

      }
    },
    created(){
      this.getProductStage();
      this.getCopyStageList();

      //获取所有的复制对象课程
      this.http.post('/orgProduct/getAllProductList',{}).then(res=>{
        if(res.code == 0){
          this.copyAllList = res.data;
        }
      })
      // //获取项目
      this.http.post('/orgProduct/queryThreeSortList',{}).then(res=>{
        if(res.code == 0){
          this.sortList = res.data;
        }
      })
    },
    methods:{
      uplpadPdfToStage(data){
        this.uploadFlag = true;
        this.editstageobj.stageName = data.stageName;
        this.editstageobj.sortId = data.sortId;
        this.editstageobj.stageId = data.stageId;
        this.fileList = [{name:data.datumUrl,url:data.datumUrl||''}]
      },
      getFormPdfUrl(data){
        if(data.success){
          this.editstageobj.datumUrl = data.return.filePath;
        }else{
          this.$errorMessage(data.msg)
        }
      },

      //删除讲义
      deletePdf(){
        this.editstageobj.datumUrl = '';
        this.submitEditStage();
      },

      //获取NMB的阶段列表
      getCopyStageList(){
        this.http.post('/orgProduct/queryStageList',{pageNum:1,pageSize:9999}).then(res=>{
          if(res.code == 0){
            this.copyStageList = res.data.list;
          }
        })
      },
      //编辑阶段
      submitEditStage(){
        this.http.post('/orgProduct/updateProductStage',this.editstageobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getProductStage();
            this.editStageFlag = false;
            this.uploadFlag = false;
          }
        })
      },
      deleteVideos(){
        if(this.copyList.length == 0){
          this.$errorMessage('请选择需要下架的课时');
          return;
        }
        var arr = [];
        for(var i=0;i<this.copyList.length;i++){
          arr.push(this.copyList[i].videoId)
        }
        this.http.post('/orgProduct/batchDeleteVideo',{productVideoIds:arr}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已下架')
            this.copyList = [];
            this.$refs.multipleTable.clearSelection();
            this.getProductClassKeshiList();
          }
        })
      },
      seeVideo(data){
        this.http.post('/orgProduct/getVideoInfo',{fileId:data.lineVideoUrl}).then(res=>{
          if(res.code == 0){
            this.seeVideoFlag = true;
            this.videoUrl = res.mp4Url;
          }
        })
      },
      //复制到一个课程里
      submitCopy(){
        console.log(this.copyList)
        if(this.copyList.length == 0){
          this.$errorMessage('请选择需要符合的课时');
          return;
        }
        var arr = [];
        for(var i=0;i<this.copyList.length;i++){
          arr.push(this.copyList[i].videoId)
        }
        this.copyobj.productVideoIds = arr;
        this.http.post('/orgProduct/copyProductVideo',this.copyobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('复制成功')
            this.copyFlag = false;
            this.copyList = [];
            this.$refs.multipleTable.clearSelection();
          }
        })
      },

      //课时选中
      handleSelectionChange(val){
        this.copyList = val;
      },

      getChooseSubjectId(data){
        this.sortId = data;
        this.getProductStage();
        // this.getStageBySubjectId(data)
      },
      //根据阶段id获取课时
      seeKeshi(data){
        this.seeClassFlag = true;
        this.seeStageId = data.row.stageId;
        this.getProductClassKeshiList();
      },
      //根据课程获取学科列表
      getStageSubjectList(){
        this.http.post('/orgProduct/queryProductSubjectList',{productId:this.stageobj.productId,productType:this.seeType}).then(res=>{
          if(res.code == 0){
            this.stageSubjectList = res.data;
          }
        })
      },
      // //根据学科ID获取阶段列表
      // getStageBySubjectId(id){
      //   this.stageSortId =id;
      //   this.http.post('/orgProduct/queryProductStageList',{productId:this.stageobj.productId,productType:this.seeType,pageNum:this.stagenum,pageSize:100,subjectId:this.stageSortId}).then(res=>{
      //     if(res.code == 0){
      //       this.stageList = res.data.list;
      //       this.stagetotal = res.data.total;
      //     }
      //   })
      // },
      //往课程里编辑课时
      submitEditKeshi(){
        this.editKeshiObj.productId = this.seeId;
        this.editKeshiObj.productType=this.seeType; //4是优惠
        if(!this.editKeshiObj.videoName){
          this.$errorMessage('请填课时标题');
          return;
        }
        if(this.editKeshiObj.onLive==1){
          if(this.seTime.length<2){
            this.$errorMessage('请选择视频课程起始时间');
            return;
          }
          var st = this.seTime[0];
          var en = this.seTime[1];
          this.editKeshiObj.longStartTime = new Date(st).getTime();
          this.editKeshiObj.longEndTime = new Date(en).getTime();
        }else{
          if(!this.editKeshiObj.lineVideoUrl){
            this.$errorMessage('请填写视频ID');
            return;
          }
        }
        if(!this.editKeshiObj.subjectId){
          this.$errorMessage('请选择学科');
          return;
        }
        if(!this.editKeshiObj.stageId){
          this.$errorMessage('请选择阶段');
          return;
        }
        this.http.post('/orgProduct/updateProductVideo',this.editKeshiObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功');
            this.getProductClassKeshiList();
            this.editUpdateFlag = false;
          }
        })
      },
      //往课程里添加课时
      submitAddKeshi(){
        this.keshiObj.productId = this.seeId;
        this.keshiObj.productType=this.seeType; //4是优惠
        if(!this.keshiObj.videoName){
          this.$errorMessage('请填课时标题');
          return;
        }
        var st,en;
        if(this.keshiObj.onLive==1){
          if(this.seTime.length<2){
            this.$errorMessage('请选择视频课程起始时间');
            return;
          }
          st = this.seTime[0];
          en = this.seTime[1];
          this.keshiObj.longStartTime = new Date(st).getTime();
          this.keshiObj.longEndTime = new Date(en).getTime();
        }else{
          if(!this.keshiObj.lineVideoUrl){
            this.$errorMessage('请填写视频ID');
            return;
          }
        }
        if(!this.keshiObj.subjectId){
          this.$errorMessage('请选择学科');
          return;
        }
        if(!this.keshiObj.stageId){
          this.$errorMessage('请选择阶段');
          return;
        }
        this.http.post('/orgProduct/saveProductVideo',this.keshiObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功');
            this.getProductClassKeshiList();
            this.addClassFlag = false;
            this.keshiObj = {
              scene:'0',
                stageId:null,
                subjectId:null,
                productId:'',
                videoName:'',
                longStartTime:'',
                longEndTime:'',
                isTry:'0',//是否试听 0否 1是
                lineVideoUrl:'',//不是直播的话 需要传视频ID
                onLive:'0',
            }
          }
        })
      },
      //新增阶段
      submitAddStage(){
        this.stageobj.productType = this.seeType;
        this.http.post('/orgProduct/saveProductStage',this.stageobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getProductStage();
            this.addStageFlag = false;
          }
        })
      },
      editStage(data){
        this.editstageobj.stageName = data.row.stageName;
        this.editstageobj.stageId = data.row.stageId;
        this.editstageobj.isBranch = data.row.isBranch.toString();
        this.editStageFlag = true;
      },
      addVideosToStage(data){
        this.addClassFlag = true;
        // this.seeStageId = data.row.stageId;
        this.keshiObj.stageId = data.row.stageId;
        //获取项目
        this.http.post('/orgProduct/queryAlSubjectList',{sortId:data.row.sortId || 5}).then(res=>{
          if(res.code == 0){
            this.keshiSubjectList = res.data;
          }
        })
      },
      searchStage(){
        this.stagenum = 1;
        this.getProductStage();
      },
      //获取阶段
      getProductStage(){
        this.http.post('/orgProduct/queryStageList',{stageName:this.searchName,pageNum:this.stagenum,pageSize:10,sortId:this.sortId,isBranch:0}).then(res=>{
          if(res.code == 0){
            for(let i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.tableData = res.data.list;
            this.stagetotal = res.data.total;
          }
        })
      },
      //删除阶段
      deleteStage(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deleteStageFn(data.stageId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteStageFn(id){
        this.http.post('/orgProduct/deleteProductStageRelationByStageId',{stageId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getProductStage();
          }
        })
      },
      //查看课时
      seeProductClass(data){
        this.keshiObj.stageId = data.row.stageId; //给添加课时赋值阶段ID
        this.seeStageId = data.row.stageId;
        this.kpagenum = 1;
        this.seeClassFlag = true;
        this.getProductClassKeshiList();
        this.http.post('/orgProduct/queryAlSubjectList',{sortId:data.row.sortId}).then(res=>{
          if(res.code == 0){
            this.keshiSubjectList = res.data;
          }
        })
      },
      //获取课程课时猎表
      getProductClassKeshiList(){
        this.http.post('/orgProduct/queryProductVideoList',{stageId:this.seeStageId,pageNum:this.kpagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.ktotal = res.data.total;
            this.keshiList = res.data.list;
          }
        })
      },
      //编辑课程课时
      updateKeshi(data){
        data.time = '';
        //编辑少起始时间
        this.editKeshiObj = data;
        this.editKeshiObj.isTry = this.editKeshiObj.isTry.toString();
        this.editKeshiObj.onLine = this.editKeshiObj.onLine.toString();
        this.editKeshiObj.onLive = this.editKeshiObj.onLive.toString();
        this.editKeshiObj.stageId = this.editKeshiObj.stageId;
        this.editKeshiObj.subjectId = this.editKeshiObj.subjectId;
        this.seTime = [];
        this.seTime[0] = new Date(this.formatTimeToDay(data.startTime))
        this.seTime[1] = new Date(this.formatTimeToDay(data.endTime))
        this.editUpdateFlag = true;
      },
      khandleCurrentChange(v){
        this.kpagenum = v;
        this.getProductClassKeshiList();
      },
      handleCurrentChange(v){
        this.stagenum = v;
        this.getProductStage();
      },

    },
    watch:{
      seeVideoFlag(val,oval){
        if(!val){
          this.videoUrl = ''
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .head_container{
    min-width:1200px;
    background-color: #fff;
    height:60px;
  }
  .head_icon{
    color:red;
    text-align: right;
  }
  .el-icon-bell{
    font-size: 20px;
  }
  .item {
    margin-top: 10px;
    /*margin-right: 40px;*/
  }
  .el-badge__content.is-fixed{
    top:10px;
  }
  .clear:after{content:"";height:0;line-height:0;display:block;visibility:hidden;clear:both;}
  .head_right{
    float:right;
  }
  .info_icon{
    margin: 10px;
    /*float:left;*/
    display: inline-block;
    cursor:pointer;
  }
  .head_userInfo {
    /*float: left;*/
    display: inline-block;
    vertical-align: middle;
    padding-top: 10px;
    color:#fff;
  }
  .head_container{
    background: #545c64 !important;
  }
</style>
