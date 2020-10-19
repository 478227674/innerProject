<template>

  <div>
    <!--查看课时-->
    <el-dialog title="课程课时" width="80%" :visible.sync="seeClassFlag">
      <!--      <el-button @click="addClassFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--        新增课时-->
      <!--      </el-button>-->
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
<!--        <el-table-column-->
<!--          fixed="right"-->
<!--          label="操作"-->
<!--          type="index"-->
<!--          align="center"-->
<!--          width="300"-->
<!--        >-->
<!--          <template slot-scope="scope">-->
<!--            <el-button v-show="scope.row.lineVideoUrl" @click="seeVideo(scope.row)" type="info" size="mini">试看视频</el-button>-->
<!--            <el-button @click="updateKeshi(scope.row)" type="info" size="mini">编辑</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
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

    <!--查看阶段-->
    <el-dialog title="课程阶段" width="80%" :visible.sync="stageFlag">
      <el-button @click="addStageFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        关联阶段
      </el-button>
      <div style="clear: both"></div>
      <div>
        <el-radio-group @change="getChooseSubjectId" v-model="stageSubId" size="small">
          <el-radio-button v-for="item in stageSubjectList" :label="item.subjectId">{{item.subjectName}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-table
        :data="stageList"
        style="width: 100%">
        <el-table-column
          label="阶段序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="stageName"
          label="阶段标题"
          align="center">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          type="index"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteStage(scope.row)" size="mini">移除</el-button>
            <el-button @click="editStage(scope)" type="info" size="mini">编辑</el-button>
            <el-button @click="seeKeshi(scope)" type="info" size="mini">查看课时</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="stageFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--添加阶段-->
    <el-dialog title="关联阶段" width="80%" :visible.sync="addStageFlag">
      <el-form :model="stageobj">
        <el-form-item label="关联阶段" :label-width="formLabelWidth">
          <el-select multiple filterable v-model="stageobj.stageIds" placeholder="请选择">
            <el-option
              v-for="item in stageListData"
              :key="item.stageId"
              :label="item.stageName"
              :value="item.stageId">
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

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStageFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditStage">确 定</el-button>
      </div>
    </el-dialog>
    <!--试看视频-->
    <el-dialog title="查看视频" width="80%" :visible.sync="seeVideoFlag">
      <video style="width:80%;margin:20px auto;display: block;"  controls="controls" :src="videoUrl"></video>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeVideoFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--复制课时弹层-->
    <el-dialog title="复制课时" width="80%" :visible.sync="copyFlag">
      <el-form :model="copyobj">
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
  </div>
</template>

<script>
  export default{
    data(){
      return{
        formLabelWidth:'120px',
        flag:false,
        seeId:null,//当前查看的课时的课程ID
        seeType:null,//当前查看的课时的课程ID
        seeClassFlag:false,//控制是否显示课时列表
        addClassFlag:false,//控制添加课时
        kpagenum:1,
        ktotal:0,
        keshiList:[],
        editKeshiObj:{},//编辑课时
        editUpdateFlag:false,//编辑课时控制
        seTime:'',
        subjectList:[],
        subjectList1:[],
        keshiSubjectList:[],
        copyobj:{
          productVideoIds:[],
          cpStageId:null,
        },
        stageFlag:false,
        addStageFlag:false,
        stageobj:{
          productId:'',
          productType:'',
          stageIds:[],
        },
        stageList:[],
        stagenum:1,
        stagetotal:0,
        editStageFlag:false,
        editstageobj:{
          stageId:'',
          productId:'',
          productType:null,
          stageName:'',
          subjectId:'',
        },
        copyAllList:[],
        copyFlag:false,
        stageListData:[],//专门添加课时时用的
        stageSubjectList:[], //课程的学科列表
        stageSubId:null, //当前查看的学科id
        seeStageId:'',

        seeVideoFlag:false,
        videoUrl:'',
        sortList:[],
        copyStageList:[],
      }
    },
    created(){
      // //获取项目
      this.http.post('/orgProduct/queryThreeSortList',{}).then(res=>{
        if(res.code == 0){
          this.sortList = res.data;
        }
      })
      this.monitoring();
      //获取所有的阶段
      this.getCopyStageList();
    },
    methods:{
      monitoring(){
        this.$on('seeVideos', (res) => {
          if(res.productAid){
            res.productId = res.productAid;
            res.imageType = 4;
          }else if(res.productSid){
            res.productId = res.productSid;
            res.imageType = 5;
          }
          this.seeProductStage(res)
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
      currentSel(data){
        this.chooseProduct = data;
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
            this.$successMessage('复制成功');
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
        this.getStageBySubjectId(data)
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
            this.getStageBySubjectId(null);
          }
        })
      },
      //根据学科ID获取阶段列表
      getStageBySubjectId(id){
        this.stageSubId =id;
        this.http.post('/orgProduct/queryStagePageByProduct',{productId:this.stageobj.productId,productType:this.seeType,pageNum:this.stagenum,pageSize:100,subjectId:this.stageSubId}).then(res=>{
          if(res.code == 0){
            this.stageList = res.data.list;
            this.stagetotal = res.data.total;
          }
        })
      },
      getCopyStageList(){
        this.http.post('/orgProduct/queryStageList',{pageNum:1,pageSize:9999}).then(res=>{
          if(res.code == 0){
            this.copyStageList = res.data.list;
          }
        })
      },
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
          }
        })
      },

      //查看阶段
      seeProductStage(data){
        this.stageFlag = true;
        this.seeId = data.productId;
        this.seeType = data.imageType;
        this.onLive = data.onLive;
        this.kpagenum = 1;
        this.stageobj.productId = data.productId;
        this.getStageSubjectList();
        this.http.post('/orgProduct/queryProductStageListSearch',{sortId:data.sortId,pageNum:1,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.stageListData = res.data.list;
          }
        })
        this.http.post('/orgProduct/queryProductSubjectList',{productId:data.productId,productType:this.seeType,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.keshiSubjectList = res.data;
          }
        })

      },
      //新增阶段
      submitAddStage(){
        this.stageobj.productType = this.seeType;
        this.http.post('/orgProduct/saveProductStageRelation',this.stageobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('关联成功')
            this.getProductStage();
            this.addStageFlag = false;
          }
        })
        // this.http.post('/orgProduct/saveProductStage',this.stageobj).then(res=>{
        //   if(res.code == 0){
        //     this.$successMessage('添加成功')
        //     this.getProductStage();
        //     this.addStageFlag = false;
        //   }
        // })
      },
      //编辑阶段
      submitEditStage(){
        this.http.post('/orgProduct/updateProductStage',this.editstageobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getProductStage();
            this.editStageFlag = false;
          }
        })
      },
      editStage(data){
        this.editstageobj.sortId = 4;
        this.editstageobj.stageName = data.row.stageName;
        this.editstageobj.stageId = data.row.stageId;
        this.editStageFlag = true;
      },
      //获取阶段
      getProductStage(){
        this.http.post('/orgProduct/queryStagePageByProduct',{productId:this.stageobj.productId,productType:this.seeType,pageNum:this.stagenum,pageSize:100,subjectId:this.stageSubId}).then(res=>{
          if(res.code == 0){
            this.stageList = res.data.list;
            this.stagetotal = res.data.total;
          }
        })
      },
      //删除阶段
      deleteStage(data){
        this.$confirm('确定解除此阶段与课程的关联吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deleteStageFn(data.stageId,data.productId,data.productType);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteStageFn(id,pid,ptype){
        this.http.post('/orgProduct/deleteProductStageRelation',{stageId:id,productId:pid,productType:ptype}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getProductStage();
          }
        })
      },
      //查看课时
      seeProductClass(data){
        this.onLive = data.row.onLive;
        this.kpagenum = 1;
        this.seeId = data.row.productId;
        this.seeClassFlag = true;
        this.getProductClassKeshiList();
        this.http.post('/orgProduct/queryStagePageByProduct',{productId:data.row.productId,productType:this.seeType,pageNum:1,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.stageList = res.data.list;
          }
        })
        this.http.post('/orgProduct/queryProductSubjectList',{productId:data.row.productId,productType:this.seeType,pageNum:1,pageSize:100}).then(res=>{
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
        this.pagenum = v;
        this.getProductList();
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
