<template>
  <div style="padding: 20px;">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="直播课列表" name="first">
        <div style="margin-bottom: 10px">
          <el-input style="width: 200px;" placeholder="输入课程名称搜索" v-model.string="keyWord" auto-complete="off"></el-input>
          <el-button @click="searchProductByType(1)" type="primary" style="margin-left: 50px;">搜索</el-button>
        </div>
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
      <el-tab-pane label="正价课列表" name="four">
        <div style="margin-bottom: 10px">
          <el-input style="width: 200px;" placeholder="输入课程名称搜索" v-model.string="keyWord" auto-complete="off"></el-input>
          <el-button @click="searchProductByType(2)" type="primary" style="margin-left: 50px;">搜索</el-button>
        </div>

        <el-table
          :data="ptlist"
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
              <span>普通课程</span>
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
              <el-button v-if="scope.row.isRecom==0" @click="handleClick(scope.row,4,1)" type="text" size="small">推荐</el-button>
              <el-button v-if="scope.row.isRecom==1" @click="handleClick(scope.row,4,0)" type="text" size="small">取消推荐</el-button>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange3"
          :current-page="pagenum3"
          :page-size="10"

          layout="total, prev, pager, next, jumper"
          :total="total3">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="试听课列表" name="second">
        <div style="margin-bottom: 10px">
          <el-input style="width: 200px;" placeholder="输入课程名称搜索" v-model.string="keyWord" auto-complete="off"></el-input>
          <el-button @click="searchProductByType(3)" type="primary" style="margin-left: 50px;">搜索</el-button>
        </div>

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
        <div style="margin-bottom: 10px">
          <el-input style="width: 200px;" placeholder="输入课程名称搜索" v-model.string="keyWord" auto-complete="off"></el-input>
          <el-button @click="searchProductByType(4)" type="primary" style="margin-left: 50px;">搜索</el-button>
        </div>

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
  //1直播 2正价 3试听 4优惠
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

        ptlist:[],

        pagenum3:1,
        total3:0,

        keyWord:'',
      }
    },
    created(){
      this.getList();
      this.getList1();
      this.getPtList();
      this.getActiveList();
    },
    methods:{
      searchProductByType(t){
        switch (t) {
          case 1:
            this.searchFn(t);
            break;
          case 2:
            this.searchFn(t);
            break;
          case 3:
            this.searchFn(t);
            break;
          case 4:
            this.searchFn(t);
            break;
        }
      },
      searchFn(t){
        if(!this.keyWord){
          this.$errorMessage('请输入需要搜索的课程名称')
          return;
        }
        this.http.post('/orgProduct/searchRecomProductList',{recomType:t,productName:this.keyWord}).then(res=>{
          if(res.code == 0){
            switch (t) {
              case 1:
                this.liveList = [...res.data,...this.liveList]
                break;
              case 2:
                this.ptlist = [...res.data,...this.ptlist]
                break;
              case 3:
                this.freeList = [...res.data,...this.freeList]
                break;
              case 4:
                this.activeList = [...res.data,...this.activeList]
                break;
            }
          }
        })
      },
      getList(){
          this.http.post('/orgProduct/queryRecomLiveProductPageList',{orgId:this.orgId}).then(res=>{
              if(res.code == 0){
                  this.liveList = res.data.list;
                  this.total = res.data.total;
              }
          })
      },
      getList1(){
        this.http.post('/orgProduct/queryRecomTryProductPageList',{orgId:this.orgId}).then(res=>{
          if(res.code == 0){
            this.freeList = res.data.list;
            this.total1 = res.data.total;
          }
        })
      },
      getPtList(){
        this.http.post('/orgProduct/queryRecomActivityProductPageList',{orgId:this.orgId}).then(res=>{
          if(res.code == 0){
            this.activeList = res.data.list;
            this.total2 = res.data.total;
          }
        })
      },
      getActiveList(){
        this.http.post('/orgProduct/queryRecomCommonProductPageList',{orgId:this.orgId}).then(res=>{
          if(res.code == 0){
            this.ptlist = res.data.list;
            this.total3 = res.data.total;
          }
        })
      },
      handleClick(data,type,recom){

      },
      //推荐方法
      handleClick(data,type,recom){
        var obj = {
          orgId:JSON.parse(localStorage.getItem('userinfo')).id,
          productType:data.imageType || null,
          productId:data.productId,
          isRecom:recom,
        };
        var url = ''
        if(type==1){ //直播推荐
            url= '/orgProduct/recomLiveProduct'
        }else if(type ==2 ){ //试听推荐
          url = '/orgProduct/recomTryProduct'
        }else if(type==3){ //优惠课推荐
          url='/orgProduct/recomActivityProduct'
        }else if(type==4){ //正价课推荐
          url = '/orgProduct/recomCommonProduct'
        }
        this.http.post(url,obj).then(res=>{
          if(res.code == 0){
            if(recom==1){
              this.$successMessage('推荐成功');
            }else{
              this.$successMessage('取消推荐成功');
            }
            switch (type) {
              case 1:
                this.getList();
                break;
              case 2:
                this.getActiveList();
                break;
              case 3:
                this.getPtList();
                break;
              case 4:
                this.getList1();
                break;
            }
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
        this.getPtList()
      },

      handleCurrentChange3(v){
        this.pagenum3 = v;
        this.getActiveList()
      },
    },
  }
</script>

<style>
  .ql-container,.ql-editor{
    height: 200px !important;
  }
</style>
