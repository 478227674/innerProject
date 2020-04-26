<template>
  <div>
    <el-button @click="addPriceCompetition" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      产品竞价推荐
    </el-button>
    <el-button @click="addPriceOrgan" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      机构竞价推荐
    </el-button>
    <el-button @click="addMoneyFlag" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-check-outline">
      充值质正币
    </el-button>
    <el-button  style="float: left;margin-bottom: 10px;" icon="el-icon-view">
      质正币余额：{{zzbTotal}}
    </el-button>
    <div style="display: block;clear: both;text-align: left;line-height: 20px;font-size: 16px;color:red;margin-bottom: 10px;">
      此竞价用于首页机构或者产品推荐以及栏目排名竞价，每日早上10点结束。结果保持一天时间。
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClickTab">
      <el-tab-pane label="竞价记录" name="first">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="bidId"
            label="序号"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="竞价产品"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="bidCoin"
            label="出价"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="maxCoin"
            label="获得权价格"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="竞价时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="bidResult"
            label="是否竞价成功"
            align="center">
            <template slot-scope="scope">
              <el-button v-show="scope.row.bidResult==2" type="text" size="small">竞价成功</el-button>
              <el-button v-show="scope.row.bidResult==1" type="text" size="small">竞价失败</el-button>
              <!--<el-button type="text" size="small">编辑</el-button>-->
            </template>
          </el-table-column>


        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="moneytotal">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="质正币充值记录" name="second">

        <el-table
          :data="chongzhiList"
          style="width: 100%">
          <el-table-column
            prop="coinOrderId"
            label="订单序号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="coinNum"
            label="充值质正币数量"
            width="180"
            align="center">
          </el-table-column>

          <el-table-column
            prop="orderPrice"
            label="支付金额"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="竞价时间"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeC"
          :current-page="cpagenum"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="ctotal">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!--dialog添加-->
    <el-dialog title="产品竞价推荐" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="竞价产品" :label-width="formLabelWidth">
          <el-select v-model="value" placeholder="请选择"
                     @change="getGoodsId" filterable
          >
            <el-option
              v-for="item in goodsList"
              :label="item.productName"
              :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="竞价金额(质正币)" :label-width="formLabelWidth">
          <el-input v-model="form.bidCoin" placeholder="请输入竞价金额"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="display: block;clear: both;text-align: left;line-height: 20px;font-size: 16px;color:red;margin-bottom: 10px;">
        此竞价用于首页机构或者产品推荐以及栏目排名竞价，每日早上10点结束。结果保持一天时间。
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="产品竞价推荐" :visible.sync="dialogOrgVisible">
      <el-form :model="orgform">
        <el-form-item label="竞价金额(质正币)" :label-width="formLabelWidth">
          <el-input v-model="orgform.bidCoin" placeholder="请输入竞价金额"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="display: block;clear: both;text-align: left;line-height: 20px;font-size: 16px;color:red;margin-bottom: 10px;">
        此竞价用于首页机构或者产品推荐以及栏目排名竞价，每日早上10点结束。结果保持一天时间。
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOrgVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDataOrg">确 定</el-button>
      </div>
    </el-dialog>


    <!--dialog添加-->
    <el-dialog title="充值质正币" :visible.sync="addFlag">
      <div style="text-align: center;font-size: 18px;margin-bottom: 20px">1RMB兑换1000质正币</div>
      <el-form :model="addForm">
        <el-form-item label="充值金额(质正币)" :label-width="formLabelWidth">
          <el-input v-model="addForm.coinNum" placeholder="请输入充值金额"  auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="微信支付" :visible.sync="payFlag">
      <div style="text-align: center;font-size: 20px;">支付金额：￥{{payPrice}}</div>
      <div id="qrcode" style="width:200px;height:200px;margin: 20px auto">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="payFlag = false">取 消</el-button>
        <!--<el-button type="primary" @click="payOver">已支付</el-button>-->
      </div>
    </el-dialog>
    <!--dialog删除-->
  </div>
</template>
<script>
  import QRCode  from "qrcodejs2"

  export default {
    data() {
      return {
        activeName:'first',
        payFlag:false, //支付二维码显示控制
        payCode:'', //支付的二维码
        payPrice:0,//支付金额
        payId:'',//支付订单ID
        payIntevel:undefined,
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogOrgVisible:false,
        dialogImageUrl: '',
        dialogVisible: false,
        imageType:'1',
        orgId:JSON.parse(localStorage.getItem('userinfo')).id,
        form: {
          productId: '',
          orgId:'',
          bidCoin:'',
          productType:'',
        },
        orgform:{
          bidCoin:'',
        },
        imgUrl:'',
        formLabelWidth: '120px',
        options:[],
        value:'',
        tableData: [

        ],
        moneytotal:0,
        goodsList:[],
        pagenum:1,
        pagesize:10,
        addFlag:false,
        addForm:{
          coinNum:null,
          orgId:''
        },
        zzbTotal:0,


        chongzhiList:[],
        cpagenum:1,
        cpagesize:10,
        ctotal:0
      }
    },
    components: {
      QRCode
    },
    created(){
      this.getOrnCoinCount();
      this.getJingJiaList();
      this.getGoodsList();
    },
    methods:{
      handleClickTab(data){
        if(data.index==0){
          this.getJingJiaList()
        }else{
          this.getChongzhiList();
        }
      },
      //申请机构竞价
      submitDataOrg(){
        if(!this.orgform.bidCoin || this.orgform.bidCoin<1){
          this.$errorMessage('请填写竞价质正币数额')
          return;
        }
        this.orgform.orgId = this.orgId;
        this.http.post('/orgInfo/saveOrgBidding',this.orgform).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '申请竞价成功!'
            });
            this.getOrnCoinCount();
            this.dialogOrgVisible = false;
            this.orgform = {
              bidCoin:''
            }
          }
        })
      },
      //获取充值记录
      getChongzhiList(){
        this.http.post('/orgInfo/queryAppCoinOrderList ',{orgId:this.orgId,pageNum:this.cpagenum,pageSize:this.cpagesize}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.chongzhiList = res.data.list;
            this.ctotal = res.data.total;
          }
        })
      },
      //获取所有产品
      getGoodsList(){
        this.http.post('/orgInfo/queryBiddProductList',{orgId:this.orgId}).then(res=>{
          if(res.code == 0){
            this.goodsList = res.data;
          }
        })
      },
      addMoneyFlag(){
          this.addFlag = true;
      },
      //获取竞价列表
      getJingJiaList(){
        this.http.post('/orgInfo/queryProductBiddingList',{orgId:this.orgId,pageNum:this.pagenum,pageSize:this.pagesize}).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                  res.data.list[i].createTime = this.formatTimeToDate(res.data.list[i].createTime)
              }
            this.tableData = res.data.list;
            this.moneytotal = res.data.total;
          }
        })
      },
      //获取质正币总额
      getOrnCoinCount(){
        this.http.post('/orgInfo/queryOrgCoin',{orgId:this.orgId}).then(res=>{
          if(res.code == 0){
            this.zzbTotal = res.data.coinNum;
          }
        })
      },
      handleSizeChange(val) {
        //${val} 是当前每页多少条
        this.pagesize = val;
        this.getJingJiaList(this.pagenum,val);
      },
      handleCurrentChangeC(v){
        this.cpagenum = v;
        this.getChongzhiList();

      },
      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getJingJiaList(val,this.pagesize);
      },
      submitData(){
//      this.form.goods_id = data;
        if(!this.form.productId){
          this.$errorMessage('请选择竞价产品')
          return;
        }
        if(!this.form.bidCoin){
          this.$errorMessage('请填写竞价质正币数额')
          return;
        }
        this.form.orgId = this.orgId;
        this.http.post('/orgInfo/saveProductBidding',this.form).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '申请竞价成功!'
            });
            this.getOrnCoinCount();
            this.dialogFormVisible = false;
            this.form = {
              productId: '',
              orgId:'',
              bidCoin:''
            }
          }
        })
        return;
      },
      addPriceCompetition(){
        this.dialogFormVisible = true;
      },
      addPriceOrgan(){
        this.dialogOrgVisible = true;
      },
      submitAddData(){
        this.addForm.orgId = this.orgId;
        if(!this.addForm.coinNum){
          this.$errorMessage('请填写充值金额')
          return;
        }
        this.http.post('/wx/pay',this.addForm).then(res=>{
          if(res.code == 0){
              var postCount = 0;
              this.payPrice = this.addForm.coinNum/1000;
              this.payFlag = true;
              this.payCode = res.data;
              this.payId = res.coinOrderId;
              setTimeout(()=> {
                document.getElementById('qrcode').innerHTML = '';
                let qrcode = new QRCode('qrcode', {
                  width: 200,
                  height: 200,        // 高度
                  text: res.codeUrl,   // 二维码内容
                })
                this.payIntevel = setInterval(()=>{
                  if(postCount>=60){
                    clearInterval(this.payIntevel)
                    return;
                  }
                  postCount+=1;
                  this.http.post('/orgInfo/queryAppCoinOrderInfo',{coinOrderId:res.coinOrderId}).then(res=>{
                    if(res.code == 0){
                      if(res.status == 0){ //已支付
                        clearInterval(this.payIntevel)
                        this.payOver();
                      }
                    }
                  })
                },3000)
              },200)
          }
        })
      },
      getGoodsId(data){
          this.form.productId = data;
          for(var i=0;i<this.goodsList.length;i++){
              if(this.goodsList[i].productId == data){
                  this.form.productType = this.goodsList[i].imageType;
              }
          }
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
      payOver(){ //已支付 按钮事件
        this.pagenum = 1;
        this.addFlag = false;
        this.payFlag = false;
        this.getJingJiaList();
        this.getOrnCoinCount();
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
