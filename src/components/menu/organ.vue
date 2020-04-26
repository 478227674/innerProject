<!--suppress ALL -->
<template >
  <div style="background: #fff;padding: 30px;">
    <el-form :model="form">
      <el-form-item
        label="机构二维码"
        :label-width="formLabelWidth"
      >
        <template>
          <div id="qrcode"></div>
        </template>
      </el-form-item>
      <el-form-item
        label="机构名称"
        :label-width="formLabelWidth"
        prop="orgName"
        :rules="[
            {required: true, message: '姓名不能为空'},
          ]"
      >
        <el-input v-model.string="form.orgName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="机构简单描述"
        :label-width="formLabelWidth"
        prop="orgIntro"
        :rules="[
            {required: true, message: '简单描述不能为空'},
          ]"
      >
        <el-input placeholder="展示在列表的简单描述，不可超过50字" v-model.string="form.orgIntro" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item
        label="机构描述"
        :label-width="formLabelWidth"
        prop="desc"

      >
          <quill-editor
            style="min-height: 300px;"
            v-model="form.orgDesc"
            ref="myQuillEditor"
            :options="editorOption"
           >
          </quill-editor>
              <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload >
      </el-form-item>

      <el-form-item
        label="选择地区"
        :label-width="formLabelWidth"
        style="text-align: left"
      >
        <template>
          <el-select @change="getProvinceId" v-model="form.orgProvinceId" placeholder="请选择省">
            <el-option
              v-for="item in provinceList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select @change="getCityId" v-model="form.orgCityId" placeholder="请选择市">
            <el-option
              v-for="item in cityList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select @change="getAreaId" v-model="form.orgAreaId" placeholder="请选择区县">
            <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-form-item>

      <el-form-item
        label="机构详细地址"
        :label-width="formLabelWidth"
        style="text-align: left"
      >
        <el-input style="width: 200px;" v-model.string="form.orgAddress" auto-complete="off"></el-input>
        <el-input readonly="readonly" style="width: 200px;" v-model="form.orgLongitude" placeholder="点击地图选择经纬度" auto-complete="off"></el-input>
        <el-input readonly="readonly" style="width: 200px;" v-model="form.orgLatitude" placeholder="点击地图选择经纬度" auto-complete="off"></el-input>
        <div ref="allmap1" style="width: 500px;height: 500px;margin-top: 20px">

        </div>
      </el-form-item>
      <el-form-item
        label="机构电话"
        :label-width="formLabelWidth"
        prop="orgTelephone"
        :rules="[
            { required: true, message: '电话不能为空'},
          ]"
      >
        <el-input oninput = "value=value.replace(/[^\d]/g,'')"    v-model.string="form.orgTelephone" auto-complete="off"></el-input>

      </el-form-item>
      <el-form-item
        label="校区"
        :label-width="formLabelWidth"
        prop="school"
        style="text-align: left"
      >
        <template >
          <el-input style="width: 150px;" v-model="schoolname" placeholder="请输入校区名称"  auto-complete="off"></el-input>
          <el-input style="width: 200px;" v-model="schooladdress" placeholder="请输入校区地址"  auto-complete="off"></el-input>
          <el-input readonly="readonly" style="width: 200px;" v-model="lng" placeholder="点击地图选择经纬度" auto-complete="off"></el-input>
          <el-input readonly="readonly" style="width: 200px;" v-model="lat" placeholder="点击地图选择经纬度" auto-complete="off"></el-input>
          <el-button type="primary" @click="addSchool">添加</el-button>

        </template>
        <div >
          <el-tag v-for="(item,index) in schoolList" closable @close="handleClose(item)">
            校区{{index+1}}：{{item.schoolname}}  {{item.schooladdress}}
          </el-tag>
        </div>
        <div ref="allmap" style="width: 500px;height: 500px;margin-top: 20px">

        </div>

      </el-form-item>

      <el-form-item label="机构logo(50*50)" :label-width="formLabelWidth">

        <el-upload
          class="avatar-uploader"
          action="apiurl"
          :show-file-list="false"
          list-type="picture-card"
          :http-request="uploadLogo"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <img v-if="orgLogoUrl" :src="orgLogoUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>


      <el-form-item label="机构展示图(690*280)"
          :label-width="formLabelWidth"
      >
        <el-upload
          class="avatar-uploader"
          action="apiurl"
          :show-file-list="false"
          list-type="picture-card"
          :http-request="uploadImg"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          >
          <img v-if="orgImgUrl" :src="orgImgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitData">确 定</el-button>
    </div>
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
        dialogImageUrl: '',
        dialogVisible: false,
        editorOption: {
          theme: "snow",
          placeholder: "请输入教师描述...",
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
        form: {
          orgIntro:'',
          orgName: '',
          orgAddress:'',
          orgTelephone:'',
          orgCampus:'',
          orgImage:'',
          orgDesc:'',
          orgLongitude:'',
          orgLatitude:'',
          orgLogo:'',
          orgProvinceId:'',
          orgCityId:'',
          orgAreaId:'',
          orgId:JSON.parse(localStorage.getItem('userinfo')).id
        },
        orgImgUrl:null,
        orgLogoUrl:null,
        lng:'',
        lat:'',
        schoolname:'',
        schooladdress:'',
        schoolList:[],
        formLabelWidth: '120px',
        apiurl:'',
        provinceList:[],
        cityList:[],
        proviceId:null,
        cityId:null,
        areaList:[],
        areaId:'',


      }
    },
    components: {
      quillEditor,
      QRCode
    },
    mounted:function(){


      let _this = this;
      //选择校区机构的地图
      let map =new BMap.Map(this.$refs.allmap); // 创建Map实例
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);// 初始化地图,设置中心点坐标和地图级别
      map.addEventListener("click",function(e){
        _this.lng = e.point.lng;
        _this.lat = e.point.lat;
      });
      map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放


      //选择机构地址的地图
      let map1 =new BMap.Map(this.$refs.allmap1); // 创建Map实例
      map1.centerAndZoom(new BMap.Point(116.404, 39.915), 11);// 初始化地图,设置中心点坐标和地图级别
      map1.addEventListener("click",function(e){
        _this.form.orgLongitude = e.point.lng;
        _this.form.orgLatitude = e.point.lat;
      });
      map1.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    },
    created:function () {
      this.provinceList = citydata; //把城市列表放入vue实例化中
      //初始化机构信息
      this.http.post('/orgInfo/queryOrgInfo', {orgId:JSON.parse(localStorage.getItem('userinfo')).id}).then(res=>{
        if(res.code == 0){
          this.apiurl = this.uplodUrl + '/file/upload';
          if(res.data.orgCampus){
            this.schoolList = JSON.parse(res.data.orgCampus);
          }
          this.form.orgAddress = res.data.orgAddress;
          this.form.orgDesc= res.data.orgDesc;
          this.form.orgName = res.data.orgName;
          this.form.orgIntro = res.data.orgIntro
          this.form.orgTelephone = res.data.orgTelephone;
          this.form.orgLatitude = res.data.orgLatitude;
          this.form.orgLongitude = res.data.orgLongitude;
          this.form.orgImage = res.data.attachment ? res.data.attachment.attachmentId : null;
          this.form.orgLogo = res.data.orgLogo;
          this.orgImgUrl = res.data.attachment ? res.data.attachment.fileUrl : '';
          this.orgLogoUrl = res.data.logoUrl;
          if(res.data.orgProvinceId){
            this.form.orgProvinceId = res.data.orgProvinceId
            this.form.orgCityId = res.data.orgCityId
          }

          this.$nextTick(function () {
            if(res.data.orgProvinceId){
              this.form.orgProvinceId = res.data.orgProvinceId.toString();
              this.getProvinceId(this.form.orgProvinceId) //渲染市列表
              this.form.orgCityId = res.data.orgCityId.toString() //设置市列表默认值
              this.getCityId(this.form.orgCityId)
              this.form.orgAreaId = res.data.orgAreaId.toString() //设置市列表默认值
            }
            let that = this;
            let qrcode = new QRCode('qrcode', {
              width: 124,
              height: 124,        // 高度
              text: configUrl.wxUrl+'html/organ_detail.html?id='+JSON.parse(localStorage.getItem('userinfo')).id,   // 二维码内容
              // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
              // background: '#f0f',   // 背景色
              // foreground: '#ff0'    // 前景色
            })
          })
        }
      })
    },
    methods:{
        //机构图
      uploadImg(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.form.orgImage = res.data.fileId
            this.orgImgUrl = res.data.filePath;
          }
        })
      },
      uploadLogo(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.form.orgLogo = res.data.fileId
            this.orgLogoUrl = res.data.filePath;
          }
        })
      },
      //编辑器图
      getEditorImg(file){
        this.$uploadImg(file).then(res=>{
          if(res.code == 0){
            let range = this.$refs.myQuillEditor.quill.getSelection();
            this.$refs.myQuillEditor.quill.insertEmbed(range != null?range.index:0, 'image',res.data.filePath)
          }
        })
      },

      //添加校区
      addSchool(){
          if(!this.schoolname || !this.schooladdress || !this.lng || !this.lat){
              this.$errorMessage(
                 '校区信息为必填，请补全信息后添加'
              )
              return;
          }
          this.schoolList.push({
            lng:this.lng,
            lat:this.lat,
            schoolname:this.schoolname,
            schooladdress:this.schooladdress,
          })
          this.lng = '';
          this.lat = '';
          this.schoolname = '';
          this.schooladdress = '';
      },
      //删除校区
      handleClose(tag) {
        this.schoolList.splice(this.schoolList.indexOf(tag), 1);
      },

      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        console.log(file)
//        this.form.img = file.url;
        this.dialogVisible = true;
      },
      //提交机构信息
      submitData(){
          //省id和市id 120000;120103
//        console.log(this.provinceId + ';' + this.cityId)

        if(!this.form.orgDesc){
          this.$errorMessage('请填写机构描述')
          return;
        }
        if(!this.form.orgAddress || !this.form.orgLongitude || !this.form.orgLatitude){
          this.$errorMessage('请填写机构地址')
          return;
        }
        if(!this.form.orgProvinceId || !this.form.orgCityId || !this.form.orgAreaId){
          this.$errorMessage('请选择机构所在地区')
          return;
        }
        if(!this.form.orgTelephone){
          this.$errorMessage('请填写机构电话')
          return;
        }
        if(!this.form.orgImage){
          this.$errorMessage('请上传机构图片')
          return;
        }
        this.form.orgCampus = this.schoolList;
//        this.http.post()
        this.http.post('/orgInfo/updateOrgInfo', this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('机构信息修改成功')
          }
        })
//
//
//
//        this.dialogFormVisible = false;
//        this.tableData.push(this.form)
//        this.$successMessage('恭喜你，这是一条成功消息')
//        this.tagList.push({text:this.form.tag,value:this.form.tag})
      },
      getProvinceId(data){
        this.provinceId = data;
        let obj = this.provinceList.find((item)=>{
          return item.value === data;
        });
        this.cityList = obj.children;
        if(obj.children.length==1){
          this.areaList = obj.children[0].children;
        }else{
          this.areaList = [];
        }

        this.form.orgAreaId = null;
        this.form.orgCityId = obj.children[0].value;
      },
      getCityId(data){
        this.form.orgCityId = data;
        let obj = this.cityList.find((item)=>{
          return item.value === data;
        });
        this.areaList = obj.children;
        this.form.orgAreaId = obj.children[0].value;
      },
      getAreaId(data){
        this.form.orgAreaId = data;
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
  .avatar {
    display: block;
    width:100%;
    height:100%;
  }
</style>
