<template>
  <div style="padding: 20px;">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="直播课列表" name="first">
        <el-table
          :data="liveList"
          style="width: 100%">
          <el-table-column
            prop="productName"
            label="课程名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payPrice"
            label="课程类型"
            width="180"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isCut==1">砍价</span>
              <span v-if="scope.row.isGroup==1">拼团</span>
              <span v-if="scope.row.isGroup!=1 && scope.row.isCut!=1">普通课程</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="isRecom"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isRecom==1">已推荐</span>
              <span v-if="scope.row.isRecom==0">未推荐</span>

            </template>
          </el-table-column>


          <el-table-column
            prop="productPrice"
            label="课程价格"
            align="center">
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            label="课程封面"
            width="100"
            align="center">
            <template slot-scope="scope">
              <img style="width:100px;" :src="scope.row.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="orderStatus"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isRecom==0" @click="handleClick(scope.row,1,1)" type="text" size="small">推荐</el-button>
              <el-button v-if="scope.row.isRecom==1" @click="handleClick(scope.row,1,0)" type="text" size="small">取消推荐</el-button>

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

      </el-tab-pane>
      <el-tab-pane label="试听课列表" name="second">
        <el-table
          :data="freeList"
          style="width: 100%">
          <el-table-column
            prop="productName"
            label="课程名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payPrice"
            label="课程类型"
            width="180"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isCut==1">砍价</span>
              <span v-if="scope.row.isGroup==1">拼团</span>
              <span v-if="scope.row.isGroup!=1 && scope.row.isCut!=1">普通课程</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="isRecom"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isRecom==1">已推荐</span>
              <span v-if="scope.row.isRecom==0">未推荐</span>


            </template>
          </el-table-column>


          <el-table-column
            prop="productPrice"
            label="课程价格"
            align="center">
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            label="课程封面"
            align="center">
            <template slot-scope="scope">
              <img style="width:100px;" :src="scope.row.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="orderStatus"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isRecom==0" @click="handleClick(scope.row,2,1)" type="text" size="small">推荐</el-button>
              <el-button v-if="scope.row.isRecom==1" @click="handleClick(scope.row,2,0)" type="text" size="small">取消推荐</el-button>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange1"
          :current-page="pagenum1"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total1">
        </el-pagination>

      </el-tab-pane>
      <el-tab-pane label="优惠课列表" name="third">

        <el-table
          :data="activeList"
          style="width: 100%">
          <el-table-column
            prop="productName"
            label="课程名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="payPrice"
            label="课程类型"
            width="180"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isCut==1">砍价</span>
              <span v-if="scope.row.isGroup==1">拼团</span>
              <span v-if="scope.row.isGroup!=1 && scope.row.isCut!=1">普通课程</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="isRecom"
            label="状态"
            align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isRecom==1">已推荐</span>
              <span v-if="scope.row.isRecom==0">未推荐</span>
            </template>
          </el-table-column>


          <el-table-column
            prop="productPrice"
            label="课程价格"
            align="center">
          </el-table-column>
          <el-table-column
            prop="imageUrl"
            label="课程封面"
            align="center">
            <template slot-scope="scope">
              <img style="width:100px;" :src="scope.row.imageUrl" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="orderStatus"
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.isRecom==0" @click="handleClick(scope.row,3,1)" type="text" size="small">推荐</el-button>
              <el-button v-if="scope.row.isRecom==1" @click="handleClick(scope.row,3,0)" type="text" size="small">取消推荐</el-button>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange2"
          :current-page="pagenum2"
          :page-size="10"

          layout="total, prev, pager, next, jumper"
          :total="total2">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  export default {
    data() {
      return {
        activeName:'first',
        liveList:[],
        freeList:[],
        activeList:[],
        orgId:JSON.parse(localStorage.getItem('userinfo')).id,
        pagenum:1,
        total:0,
        pagenum1:1,
        total1:0,
        pagenum2:1,
        total2:0,
      }
    },
    created(){
      this.getList();
      this.getList1();
      this.getList2();
    },
    methods:{

      getList(){
          this.http.post('/orgProduct/queryOnlineProductList',{orgId:this.orgId,pageNum:this.pagenum,pageSize:10}).then(res=>{
              if(res.code == 0){
                  this.liveList = res.data.list;
                  this.total = res.data.total;

              }
          })
      },
      getList1(){
        this.http.post('/orgProduct/queryTryProductList',{orgId:this.orgId,pageNum:this.pagenum1,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.freeList = res.data.list;
            this.total1 = res.data.total;

          }
        })
      },
      getList2(){
        this.http.post('/orgProduct/queryActivityProductList',{orgId:this.orgId,pageNum:this.pagenum2,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.activeList = res.data.list;
            this.total2 = res.data.total;
          }
        })
      },
      //推荐方法
      handleClick(data,type,recom){
        var obj = {
          orgId:JSON.parse(localStorage.getItem('userinfo')).id,
          imageType:data.imageType,
          productId:data.productId,
          isRecom:recom,
        };
        var url = ''
        if(type==1){ //直播推荐
            url= '/orgProduct/recomOnlineProduct'
        }else if(type ==2 ){ //试听推荐
          url = '/orgProduct/recomTryProduct'
        }else if(type==3){ //优惠课推荐
          url='/orgProduct/recomActivityProduct'
        }
        this.http.post(url,obj).then(res=>{
          if(res.code == 0){
            if(recom==1){
              this.$successMessage('推荐成功');
            }else{
              this.$successMessage('取消推荐成功');
            }
            this.getList();
            this.getList1();
            this.getList2();
          }
        })
      },

      //切换页
      handleCurrentChange(v){
          this.pagenum = v;
          this.getList();
      },
      handleCurrentChange1(v){
          this.pagenum1 = v;
          this.getList1()
      },
      handleCurrentChange2(v){
        this.pagenum2 = v;
        this.getList2()
      },
    },
  }
</script>

<style>
  .ql-container,.ql-editor{
    height: 200px !important;
  }
</style>
