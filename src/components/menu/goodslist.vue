<template>
  <div>
    <el-button @click="addProductFn" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加课程
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="productId"
        label="ID"
        sortable
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="标题"
        width="180"
        align="center">
      </el-table-column>

      <el-table-column
        align="center"
        label="图片"
      >
        <template slot-scope="scope">
          <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" width="100" height="100" class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="cTimeStr"
        label="创建时间"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="课程时间"
        width="180"
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
              <el-button @click="editGoods(scope)" type="text" size="small">编辑</el-button>
          <!--<el-button @click="seeProductClass(scope)" type="text" size="small">查看课时</el-button>-->
          <el-button @click="seeProductStage(scope)" type="text" size="small">查看阶段</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="goodstotal">
    </el-pagination>


    <!--dialog添加-->
    <el-dialog title="添加课程" width="75%" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="课程名称"
          :label-width="formLabelWidth"
          prop="productName"
          :rules="[
            { required: true, message: '课程名称不能为空'},
          ]"
        >
          <el-input v-model.string="form.productName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="课程分类"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              v-model="form.sortList"
              :props="cascaderObj"
             >
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item label="所属班次" :label-width="formLabelWidth">
          <el-select v-model="form.alClassId" placeholder="请选择所属班次" >
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程权限" :label-width="formLabelWidth">
            <el-select v-model="form.memberIds" multiple placeholder="请选择">
              <el-option
                v-for="item in authList"
                :key="item.memberId"
                :label="item.memberName"
                :value="item.memberId">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="form.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定销售包" :label-width="formLabelWidth">
          <el-select v-model="form.alSaleId" placeholder="请选择">
            <el-option
              v-for="(item,index) in aiList"
              :key="index"
              :label="item.saleName"
              :value="item.alSaleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="课程简单描述"
          :label-width="formLabelWidth"
          prop="productIntro"
          :rules="[
            {required: true, message: '简单描述不能为空'},
          ]"
        >
          <el-input placeholder="展示在列表的简单描述，不可超过50字" v-model.string="form.productIntro" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="课程详细描述"
          :label-width="formLabelWidth"
          prop="productDesc"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="form.productDesc"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload >
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth">
          <el-upload

            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
          >
            <img v-if="form.productImg" :src="form.productImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="轮播图(最多4张)" :label-width="formLabelWidth">
          <el-upload
            action="apiurl"
            list-type="picture-card"
            :http-request="uploadImgList"
            :on-preview="handlePictureCardPreview"
            :on-remove="deleteImageList"
            :file-list="form.imageList"
            :limit='maxImgNum'
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="是否优惠" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.is_discount" label="1" >是</el-radio>
            <el-radio v-model="form.is_discount" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否给予佣金" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.isCommission" label="1" >是</el-radio>
            <el-radio v-model="form.isCommission" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="佣金金额"
          :label-width="formLabelWidth"
          prop="commissionRebate"
          v-show="form.isCommission==1"
        >
          <el-input oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.string="form.commissionRebate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可使用质正币" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.isCoin" checked label="1">是</el-radio>
            <el-radio v-model="form.isCoin" label="0">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="质正币上限"
          :label-width="formLabelWidth"
          prop="coinLimit"
          v-show="form.isCoin==1"
        >
          <el-input v-model.string="form.coinLimit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可使用优惠券" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.isCoupon" checked label="1">是</el-radio>
            <el-radio v-model="form.isCoupon" label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item
          label="购买次数"
          :label-width="formLabelWidth"
          prop="purchaseNum"
        >
          <el-input v-model.number="form.purchaseNum" oninput = "value=value.replace(/[^\d]/g,'')"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="浏览次数"
          :label-width="formLabelWidth"
          prop="browseNum"
        >
          <el-input v-model.number="form.browseNum"  oninput = "value=value.replace(/[^\d]/g,'')"  auto-complete="off"></el-input>
        </el-form-item>
        <!--添加规格-->
        <el-form-item
          label="规格"
          :label-width="formLabelWidth"
          prop="guige"
        >
          <template>
            <el-select v-model="guigeObj.classId" @change="getGoodsId()" placeholder="请选择规格" >
              <el-option
                v-for="item in classType"
                :key="item.className"
                :label="item.className"
                :value="item.classId"
              >
                {{item.className}}
              </el-option>
            </el-select>
            <!--<el-select v-model="guigeObj.teachId" @change="getGoodsId" placeholder="请选择形式" >-->
              <!--<el-option-->
                <!--v-for="item in teachType"-->
                <!--:key="item.teachName"-->
                <!--:label="item.teachName"-->
                <!--:value="item.teachId"-->
              <!--&gt;-->
              <!--</el-option>-->
            <!--</el-select>-->
            <el-input style="width:120px;" placeholder="请填写价格"  oninput = "value=value.replace(/[^\d.]/g,'')"   v-model.number="guigeObj.productPrice" auto-complete="off"></el-input>

            <el-date-picker
              v-model="guigeObj.createTime1"
              type="date"
              size="large"
              value-format="yyyy-MM-dd"
              placeholder="选择开课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-input style="width:180px;" placeholder="课时数量"  oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.number="guigeObj.classTime" auto-complete="off"></el-input>
            <el-date-picker
              v-model="guigeObj.endTime"
              type="date"
              size="large"
              value-format="yyyy-MM-dd"
              placeholder="选择结课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-button type="primary" @click="addGuigeToList">添加</el-button>
          </template>
          <template>
            <div >
              <el-tag v-for="(item,index) in guigeList" closable @close="deleteGuigeItem(item)">
                规格{{index+1}}：{{item.className}} {{item.teachName}} ￥{{item.productPrice}}  {{item.createTime1}}
              </el-tag>
            </div>
          </template>
        </el-form-item>
        <el-form-item
          label="是否直播"
          :label-width="formLabelWidth"
          prop="onLive"
        >
          <el-switch
            v-model="form.onLive"
            active-color="#13ce66"
            inactive-color="#dcdfe6">
          </el-switch>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <!--dialog编辑-->
    <el-dialog title="编辑课程" width="75%" :visible.sync="dialogEditVisible">
      <el-form :model="editForm">
        <el-form-item
          label="课程名称"
          :label-width="formLabelWidth"
          prop="productName"
          :rules="[
            { required: true, message: '课程名称不能为空'},
          ]"
        >
          <el-input v-model.string="editForm.productName" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item
          label="课程分类"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              v-model="editForm.sortList"
              :props="cascaderObj"
              >
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item label="所属班次" :label-width="formLabelWidth">
          <el-select v-model="editForm.alClassId" placeholder="请选择所属班次" >
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程权限" :label-width="formLabelWidth">
          <el-select v-model="editForm.memberIds" multiple placeholder="请选择">
            <el-option
              v-for="item in authList"
              :key="item.memberId"
              :label="item.memberName"
              :value="item.memberId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="editForm.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList1"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="课程简单描述"
          :label-width="formLabelWidth"
          prop="productIntro"
          :rules="[
            {required: true, message: '简单描述不能为空'},
          ]"
        >
          <el-input placeholder="展示在列表的简单描述，不可超过50字" v-model.string="editForm.productIntro" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="课程详细描述"
          :label-width="formLabelWidth"
          prop="productDesc"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="editForm.productDesc"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload >
        </el-form-item>



        <el-form-item label="封面(220*150)" :label-width="formLabelWidth">
          <el-upload

            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
          >
            <img v-if="editForm.productImg" :src="editForm.productImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播图(最多4张,750*250)" :label-width="formLabelWidth">
          <el-upload
            action="apiurl"
            list-type="picture-card"
            :http-request="uploadImgList"
            :on-preview="handlePictureCardPreview"
            :on-remove="deleteImageList"
            :file-list="editForm.imageList"
            :limit="maxImgNum"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否优惠" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editForm.is_discount" label="1" >是</el-radio>
            <el-radio v-model="editForm.is_discount" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否给予佣金" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editForm.isCommission" label="1" >是</el-radio>
            <el-radio v-model="editForm.isCommission" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="佣金金额"
          :label-width="formLabelWidth"
          prop="commissionRebate"
          v-show="editForm.isCommission==1"
        >
          <el-input oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.string="editForm.commissionRebate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可使用质正币" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editForm.isCoin" label="1">是</el-radio>
            <el-radio v-model="editForm.isCoin" label="0">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="质正币上限"
          :label-width="formLabelWidth"
          prop="coinLimit"
          v-show="editForm.isCoin==1"
        >
          <el-input v-model.string="editForm.coinLimit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可使用优惠券" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editForm.isCoupon" label="1">是</el-radio>
            <el-radio v-model="editForm.isCoupon" label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item
          label="购买次数"
          :label-width="formLabelWidth"
          prop="productName"
        >
          <el-input v-model.string="editForm.browseNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="浏览次数"
          :label-width="formLabelWidth"
          prop="productName"
        >
          <el-input v-model.string="editForm.purchaseNum" auto-complete="off"></el-input>
        </el-form-item>
        <!--添加规格-->
        <el-form-item
          label="规格"
          :label-width="formLabelWidth"
          prop="guige"
        >
          <template>
            <el-select v-model="guigeObj.classId" @change="getGoodsId()" placeholder="请选择规格" >
              <el-option
                v-for="item in classType"
                :key="item.className"
                :label="item.className"
                :value="item.classId"
              >
                {{item.className}}
              </el-option>
            </el-select>
            <!--<el-select v-model="guigeObj.teachId" @change="getGoodsId" placeholder="请选择形式" >-->
              <!--<el-option-->
                <!--v-for="item in teachType"-->
                <!--:key="item.teachName"-->
                <!--:label="item.teachName"-->
                <!--:value="item.teachId"-->
              <!--&gt;-->
              <!--</el-option>-->
            <!--</el-select>-->
            <el-input style="width:120px;" placeholder="请填写价格"  oninput = "value=value.replace(/[^\d.]/g,'')"   v-model.number="guigeObj.productPrice" auto-complete="off"></el-input>

            <el-date-picker
              v-model="guigeObj.createTime1"
              type="date"
              size="large"
              value-format="yyyy-MM-dd"
              placeholder="选择开课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-input style="width:120px;" placeholder="上课时段"    v-model.number="guigeObj.classTime" auto-complete="off"></el-input>
            <el-date-picker
              v-model="guigeObj.endTime"
              type="date"
              size="large"
              value-format="yyyy-MM-dd"
              placeholder="选择结课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-button type="primary" @click="addGuigeToList">添加</el-button>
          </template>
          <template>
            <div >
              <el-tag v-for="(item,index) in guigeList" closable @close="deleteGuigeItem(item)">
                规格{{index+1}}：{{item.className}} {{item.teachName}} ￥{{item.productPrice}}  {{item.createTime1}}
              </el-tag>
            </div>
          </template>
        </el-form-item>


        <el-form-item
          label="是否上架"
          :label-width="formLabelWidth"
          prop="isShelves"
        >
          <el-switch
            v-model="editForm.isShelves"
            active-color="#13ce66"
            inactive-color="#dcdfe6">
          </el-switch>
        </el-form-item>

        <el-form-item
          label="是否直播"
          :label-width="formLabelWidth"
        >
          <el-switch
            v-model="editForm.onLive"
            active-color="#13ce66"
            inactive-color="#dcdfe6">
          </el-switch>
        </el-form-item>



      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看课时-->
    <el-dialog title="课程课时" width="80%" :visible.sync="seeClassFlag">
      <el-button @click="addClassFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        新增课时
      </el-button>
      <el-button @click="copyFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        复制到其他课程
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
        <el-form-item
          :label-width="formLabelWidth"
          label="视频ID"
          v-show="onLive==0"
        >
          <el-input  v-model.string="keshiObj.lineVideoUrl" auto-complete="off"></el-input>
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
        <el-form-item
          :label-width="formLabelWidth"
          label="起始时间"
          prop="pushTitle"
          v-show="onLive==1"

        >
          <el-date-picker
            v-model="seTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属阶段" :label-width="formLabelWidth">
          <el-select v-model="keshiObj.stageId" placeholder="请选择">
            <el-option
              v-for="item in stageListData"
              :key="item.stageId"
              :label="item.stageName"
              :value="item.stageId">
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
        <el-form-item
          :label-width="formLabelWidth"
          label="视频ID"
          v-show="onLive==0"
        >
          <el-input  v-model.string="editKeshiObj.lineVideoUrl" auto-complete="off"></el-input>
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
        <el-form-item
          :label-width="formLabelWidth"
          label="起始时间"
          prop="pushTitle"
          v-show="onLive==1"
        >
          <el-date-picker
            v-model="seTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属阶段" :label-width="formLabelWidth">
          <el-select v-model="editKeshiObj.stageId" placeholder="请选择">
            <el-option
              v-for="item in stageListData"
              :key="item.stageId"
              :label="item.stageName"
              :value="item.stageId">
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

    <!--查看阶段-->
    <el-dialog title="课程阶段" width="80%" :visible.sync="stageFlag">
      <el-button @click="addStageFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        新增阶段
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
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          type="index"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteStage(scope.row)" size="mini">删除</el-button>
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
    <el-dialog title="新增阶段" width="80%" :visible.sync="addStageFlag">
      <el-form :model="keshiObj">
        <el-form-item
          :label-width="formLabelWidth"
          label="阶段标题"
        >
          <el-input  v-model.string="stageobj.stageName" auto-complete="off"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStageFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddStage">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑阶段-->
    <el-dialog title="编辑阶段" width="80%" :visible.sync="editStageFlag">
      <el-form :model="keshiObj">
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
    <!--复制课时弹层-->
    <el-dialog title="复制课时" width="80%" :visible.sync="copyFlag">
      <el-form :model="copyobj">
        <el-form :model="copyobj">
          <el-form-item
            :label-width="formLabelWidth"
            label="选择课程"
          >
            <el-select @change="currentSel" value-key="createTime" v-model="copyobj.cpProductId" filterable placeholder="请选择">
              <el-option
                v-for="item in copyAllList"
                :key="item.createTime"
                :label="item.productName"
                :value="item">
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
  import { quillEditor } from "vue-quill-editor"; //调用编辑器
  import {quillRedefine} from 'vue-quill-editor-upload'
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  export default {
    data() {
      return {
        authList:[
            {
                id:1,
                name:'VIP'
            },
            {
              id:2,
              name:'小VIP'
            },
            {
              id:3,
              name:'免费'
            }
      ],
        editorOption: {
          theme: "snow",
          placeholder: "请输入课程描述...",
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
        dialogEditVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        orgId:JSON.parse(localStorage.getItem('userinfo')).id,
        form: {
          alSaleId:null,
          is_discount:'0',
          onLive:null,
          memberIds:[],
          subjectIds:[],
          productName: '',
          productDesc:'',
          productImage:'',
          rules:[],
          browseNum:'',//浏览次数
          purchaseNum:'',//购买次数
          isCoin:'0',
          isCoupon:'0',
          productImg:'',
          imgList:[],
          imageList:[],
          coinLimit:'',
          sortList:[],
          productIntro:'',//简单描述
          isCommission:'0',
          commissionRebate:'',
          orgId:JSON.parse(localStorage.getItem('userinfo')).id,
          alClassId:'',
        },
        classList:[],//班次列表
        maxImgNum:4,
        formLabelWidth:'120px',
        tableData:[],
        apiurl:'',
        pagesize:10,
        pagenum:1,
        goodstotal:0,
        guigeObj:{
          classId:null,
          teachId:2,
          productPrice:null,
          createTime:null,
          createTime1:null,
          className:'',
          teachName:'',
          classTime:'',
          endTime:''
        },


        classType:[], //规格1
        classTypeId:null,
        teachType:[], //规格2
        teachTypeId:null,
        guigeList:[],


        editForm:{
          is_discount:'',
          onLive:true,
          memberIds:[],
          subjectIds:[],
          productName: '',
          productDesc:'',
          productImage:'',
          rules:[],
          browseNum:'',//浏览次数
          purchaseNum:'',//购买次数
          isCoin:'0',
          isCoupon:'0',
          productImg:'',
          imgList:[],
          imageList:[],
          coinLimit:'',
          isShelves:null,//上下架 1商家 2下架
          sortList:[],
          productIntro:'',//简单描述
          orgId:JSON.parse(localStorage.getItem('userinfo')).id,
        },

        pickerOptions: {
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: (time) => {
            // 如果函数处理比较简单,可以直接在这里写逻辑方法
            // return time.getTime() < Date.now() - 8.64e7

            // 如果函数里处理的数据比较麻烦,也可以单独放在一个函数里,避免data数据太臃肿
//            return this.dealDisabledDate(time)
          }
        }, // 日期设置对象, // 日期设置对象
        typeList:[], //分类列表
        cascaderObj:{
          value:'id',
          label:'name'
        },
        seeId:null,//当前查看的课时的课程ID
        seeClassFlag:false,//控制是否显示课时列表
        addClassFlag:false,//控制添加课时
        kpagenum:1,
        ktotal:0,
        keshiList:[],
        keshiObj:{

          stageId:null,
          subjectId:null,
          productId:'',
          videoName:'',
          longStartTime:'',
          longEndTime:'',
          isTry:'0',//是否试听 0否 1是
          lineVideoUrl:'',//不是直播的话 需要传视频ID
          onLine:'',
//          genseeNumber:'', //直播编号
//          genseeAttr:'',//直播字符串
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
          productId:'',
          productType:'2',
          stageName:'',
          subjectId:'',
        },
        stageList:[],
        stagenum:1,
        stagetotal:0,
        editStageFlag:false,
        editstageobj:{
          stageId:'',
          productId:'',
          productType:2,
          stageName:'',
          subjectId:'',
        },
        stageListData:[],//专门添加课时时用的
        stageSubjectList:[], //课程的学科列表
        stageSubId:null, //当前查看的学科id
        seeStageId:'',
        onLive:null,

        aiList:[],

        copyList:[], //复制列表
        copyFlag:false,//符合弹层
        copyobj:{
          cpProductId:'',
          cpProductType:'',
          productVideoIds:[]
        },
        copyAllList:[],
        chooseProduct:{},


        seeVideoFlag:false,
        videoUrl:''


      }
    },
    components: {
      quillEditor
    },
    created (){
      this.orgId = JSON.parse(localStorage.getItem('userinfo')).id;
      this.apiurl = this.uplodUrl + '/file/upload';
      this.form.orgId = JSON.parse(localStorage.getItem('userinfo')).id;
      //
      this.getGoodsList(1,this.pagesize);
      this.getGuiGeList();
      this.getClassTypeList();
      this.initPageData();
    },
    methods:{
      initPageData(){
        this.http.post('/orgInfo/queryMemberLevelPageList',{}).then(res=>{
          if(res.code == 0){
            this.authList = res.data.list;
          }
        })
        //获取班次
        this.http.post('/orgProduct/getLiveProductParam',{}).then(res=>{
          if(res.code == 0){
            this.classList = res.data;
          }
        })
        //获取学科
        this.http.post('/orgProduct/queryAlSubjectList',{}).then(res=>{
          if(res.code == 0){
            this.subjectList = res.data;
            this.subjectList1 = res.data;
          }
        })
        //获取销售包
        this.http.post('/orgProduct/queryAlSalePackageList',{}).then(res=>{
          if(res.code == 0){
            this.aiList = res.data;
          }
        })
        //获取所有的复制对象课程
        this.http.post('/orgProduct/getAllProductList',{}).then(res=>{
          if(res.code == 0){
            this.copyAllList = res.data ;
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
        this.copyobj.cpProductType = this.chooseProduct.imageType;
        this.copyobj.cpProductId = this.chooseProduct.productId;
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
        this.http.post('/orgProduct/queryProductSubjectList',{productId:this.stageobj.productId,productType:2}).then(res=>{
          if(res.code == 0){
            this.stageSubjectList = res.data;
            this.getStageBySubjectId(null);
          }
        })
      },
      //根据学科ID获取阶段列表
      getStageBySubjectId(id){
        this.stageSubId =id;
        this.http.post('/orgProduct/queryProductStageList',{productId:this.stageobj.productId,productType:2,pageNum:this.stagenum,pageSize:100,subjectId:this.stageSubId}).then(res=>{
          if(res.code == 0){
            this.stageList = res.data.list;
            this.stagetotal = res.data.total;
          }
        })
      },
      //往课程里编辑课时
      submitEditKeshi(){
        this.editKeshiObj.productId = this.seeId;
        this.editKeshiObj.productType=2; //4是优惠
        if(!this.editKeshiObj.videoName){
          this.$errorMessage('请填课时标题');
          return;
        }
        if(this.seTime.length<2){
          this.$errorMessage('请选择视频课程起始时间');
          return;
        }
        var st = this.seTime[0];
        var en = this.seTime[1];
        this.editKeshiObj.longStartTime = new Date(st).getTime();
        this.editKeshiObj.longEndTime = new Date(en).getTime();
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
        this.keshiObj.productType=2; //4是优惠
        if(!this.keshiObj.videoName){
          this.$errorMessage('请填课时标题');
          return;
        }
        var st,en;
        if(this.onLive==1){
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
        this.seeId = data.row.productId;
        this.onLive = data.row.onLive;
        console.log(data.row)
        this.kpagenum = 1;
        this.stageobj.productId = data.row.productId;
        this.getStageSubjectList();
        this.http.post('/orgProduct/queryProductStageList',{productId:data.row.productId,productType:2,pageNum:1,pageSize:100}).then(res=>{
            if(res.code == 0){
              this.stageListData = res.data.list;
            }
          })
          this.http.post('/orgProduct/queryProductSubjectList',{productId:data.row.productId,productType:2,pageNum:1,pageSize:100}).then(res=>{
            if(res.code == 0){
              this.keshiSubjectList = res.data;
            }
          })

      },
      //新增阶段
      submitAddStage(){

        this.http.post('/orgProduct/saveProductStage',this.stageobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getProductStage();
            this.addStageFlag = false;
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
          }
        })
      },
      editStage(data){
        this.editstageobj.productId = data.row.productId;
        this.editstageobj.subjectId = data.row.subjectId;
        this.editstageobj.stageName = data.row.stageName;
        this.editstageobj.stageId = data.row.stageId;
        this.editStageFlag = true;
      },
      //获取阶段
      getProductStage(){
        this.http.post('/orgProduct/queryProductStageList',{productId:this.stageobj.productId,productType:2,pageNum:this.stagenum,pageSize:100,subjectId:this.stageSubId}).then(res=>{
          if(res.code == 0){
              this.stageList = res.data.list;
              this.stagetotal = res.data.total;
            this.stageListData = res.data.list; //添加完新阶段后要重新给添加课时时所用的所属阶段列表重新赋值

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
        this.http.post('/orgProduct/deleteProductStage',{stageId:id}).then(res=>{
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
        this.http.post('/orgProduct/queryProductStageList',{productId:data.row.productId,productType:2,pageNum:1,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.stageList = res.data.list;
          }
        })
        this.http.post('/orgProduct/queryProductSubjectList',{productId:data.row.productId,productType:2,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.keshiSubjectList = res.data;
          }
        })

      },
      //获取课程课时猎表
      getProductClassKeshiList(){
        this.http.post('/orgProduct/queryProductVideoList',{productType:2,productId:this.seeId,stageId:this.seeStageId}).then(res=>{
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

      getClassTypeList(){
        this.http.post('/orgProduct/queryProductSort',{}).then(res=>{
          if(res.code == 0){
            this.typeList = res.data;
          }
        })
      },

      dealDisabledDate (time) {
        return time.getTime() < Date.now()
      },
      getGoodsList(num,size){
        this.http.post('/orgProduct/queryProductList',{orgId:this.orgId,pageNum:num,pageSize:size}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].endTime = this.formatTimeToDay(res.data.list[i].endTime)
            }
            this.tableData = res.data.list;
            this.goodstotal = res.data.total;
          }
        })
      },
      getGuiGeList(){
        this.http.post('/orgProduct/queryProductRule',{}).then(res=>{
          if(res.code == 0){
            this.classType = res.data.classType;
            this.teachType = res.data.teachType;
          }
        })
      },
      //添加规格事件
      addGuigeToList(){
//          this.guigeObj
        if(!this.guigeObj.classId){
          this.$errorMessage('请选择规格')
          return;
        }
        if(!this.guigeObj.teachId){
          this.$errorMessage('请选择形式')
          return;
        }
        if(this.guigeObj.productPrice<0){
          this.$errorMessage('请填写价格')
          return;
        }
        if(!this.guigeObj.createTime1){
          this.$errorMessage('请选择开课时间')
          return;
        }
        if(!this.guigeObj.classTime){
          this.$errorMessage('请填写上课时段')
          return;
        }
        if(!this.guigeObj.endTime){
          this.$errorMessage('请选择结课时间')
          return;
        }
        this.guigeObj.createTime = new Date(this.guigeObj.createTime1.toString()).getTime()
        this.guigeObj.className = this.classType.find((item)=>{
          return item.classId === this.guigeObj.classId;
        }).className;
//        this.guigeObj.teachName = this.teachType.find((item)=>{
//          return item.teachId === this.guigeObj.teachId;
//        }).teachName;
        let obj = {};
        Object.assign(obj,this.guigeObj);  //直接使用guigeObj为引用类型 添加后再次添加时会影响之前添加的规格
        this.guigeList.push(obj); //所以深拷贝一个对象再次添加 不会影响this.guigeObj
        this.guigeObj={
            classId:null,
            teachId:2,
            productPrice:null,
            createTime:null,
            createTime1:null,
            className:'',
            teachName:'',
            classTime:'',
            endTime:''
        }
      },
      //删除规格
      deleteGuigeItem(tag) {
        this.guigeList.splice(this.guigeList.indexOf(tag), 1);
      },
      getGoodsId(data){
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
      addProductFn(){
        this.dialogFormVisible = true
        this.guigeList = [];
      },
      handleSizeChange(val) {
        //${val} 是当前每页多少条
        this.getGoodsList(this.pagenum,val);
      },
      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getGoodsList(val,this.pagesize);
      },
      //图片上传
      uploadImg(data,type){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            if(this.dialogEditVisible){
              this.editForm.productImage = res.data.fileId
              this.editForm.productImg = res.data.filePath;
            }
            if(this.dialogFormVisible){
              this.form.productImage = res.data.fileId
              this.form.productImg = res.data.filePath;
            }

          }
        })
      },
      uploadImgList(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            if(this.dialogEditVisible){
              this.editForm.imgList.push(res.data.filePath) //显示列表
              this.editForm.imageList.push({ //post给后台的数组
                imageId:res.data.fileId,
                imageType:1,
                cycleValue:'',
                url:res.data.filePath
              })
            }
            if(this.dialogFormVisible){
              this.form.imgList.push(res.data.filePath) //显示列表
              this.form.imageList.push({ //post给后台的数组
                imageId:res.data.fileId,
                imageType:1,
                cycleValue:'',
                url:res.data.filePath
              })
            }
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      deleteImageList(data,list){
        if(this.dialogEditVisible){
          this.editForm.imageList = list;
        }
        if(this.dialogFormVisible){
          this.form.imageList = list;
        }

      },
      //新增课程方法
      submitData(){
        if(!this.form.productName){
          this.$errorMessage('请填写课程标题')
          return;
        }

        if(this.form.sortList.length<2){
          this.$errorMessage('请选择课程分类')
          return;
        }
        if(!this.form.alClassId){
          this.$errorMessage('请选择所属班次')
          return;
        }
        if(!this.form.productIntro ){
          this.$errorMessage('请填写课程简单描述')
          return;
        }
        if(this.form.productIntro && this.form.productIntro.length>50){
          this.$errorMessage('简单描述不可超过50字')
          return;
        }
        if(!this.form.productDesc){
          this.$errorMessage('请填写课程详细描述')
          return;
        }
        if(!this.form.productImage){
          this.$errorMessage('请上传课程图片')
          return;
        }
        if(this.form.isCommission==1){
          if(!this.form.commissionRebate || this.form.commissionRebate<=0){
            this.$errorMessage('请填写正确的佣金金额')
            return;
          }
        }
        if(this.form.isCoin == 1){
            if(this.form.coinLimit%1000 != 0 ){
              this.$errorMessage('质正币上限数额必须是1000的倍数')
              return;
            }
        }
        if(this.guigeList.length==0){
          this.$errorMessage('请至少添加一个商品规格')
          return;
        }
        if(this.form.browseNum>10000){
          this.$errorMessage('浏览次数初始不能大于10000')
          return;
        }
        if(this.form.purchaseNum>1000){
          this.$errorMessage('购买次数初始不能大于1000')
          return;
        }
        if(this.form.onLive){
          this.form.onLive = 1;
        }else{
          this.form.onLive = 0;
        }
        this.form.rules = this.guigeList;
        this.http.post('/orgProduct/saveProduct',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            Object.assign(this.$data, this.$options.data())
            this.getClassTypeList();
            this.getGuiGeList();
            this.dialogFormVisible = false;
            this.getGoodsList(this.pagenum,this.pagesize);
          }
        })
      },

      submitEditData(){
        if(!this.editForm.productName){
          this.$errorMessage('请填写课程标题')
          return;
        }
        if(this.editForm.sortList.length<2){
          this.$errorMessage('请选择课程分类')
          return;
        }
        if(!this.editForm.alClassId){
          this.$errorMessage('请选择所属班次')
          return;
        }
        if(!this.editForm.productIntro ){
          this.$errorMessage('请填写课程简单描述')
          return;
        }
        if(this.editForm.productIntro && this.editForm.productIntro.length>50){
          this.$errorMessage('简单描述不可超过50字')
          return;
        }
        if(!this.editForm.productDesc){
          this.$errorMessage('请填写课程详细描述')
          return;
        }
        if(!this.editForm.productImage){
          this.$errorMessage('请上传课程图片')
          return;
        }
        if(this.editForm.isCoin == 1){
          if(this.editForm.coinLimit%1000 != 0 ){
            this.$errorMessage('质正币上限数额必须是1000的倍数')
            return;
          }
        }
        if(this.guigeList.length==0){
          this.$errorMessage('请至少添加一个商品规格')
          return;
        }
        if(this.editForm.browseNum>10000){
          this.$errorMessage('浏览次数初始不能大于10000')
          return;
        }
        if(this.editForm.purchaseNum>1000){
          this.$errorMessage('购买次数初始不能大于1000')
          return;
        }
//        for(var i=0;i<this.guigeList.length;i++){
//            if(this.guigeList[i].cTimeStr){
//              this.guigeList[i].createTime = new Date(this.guigeList[i].cTimeStr.toString()).getTime()
//            }else{
//
//            }
//        }
        this.editForm.rules = this.guigeList;
        if(this.editForm.isShelves){
          this.editForm.isShelves = 1;
        }else{
          this.editForm.isShelves = 0;
        }
        if(this.editForm.onLive){
          this.editForm.onLive = 1;
        }else{
          this.editForm.onLive = 0;
        }
        this.http.post('/orgProduct/updateOrDeleteProduct',this.editForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.dialogEditVisible = false;
            this.getGoodsList(this.pagenum,this.pagesize);

          }
        })
      },
      //编辑
      editGoods(data){
        this.http.post('/orgProduct/queryProductInfo',{productId:data.row.productId}).then(res=>{
          let obj = {};
          Object.assign(obj,res.data)
          this.editForm = obj;
          this.$set(this.editForm,'isCoin', res.data.productDetail.isCoin.toString())
          this.$set(this.editForm,'isCoupon', res.data.productDetail.isCoupon.toString())
          this.$set(this.editForm,'isCommission', res.data.productDetail.isCommission.toString())

          this.editForm.productImage = res.data.attachment.attachmentId;

          this.editForm.productImg = res.data.attachment.fileUrl;
          this.editForm.productId = data.row.productId;
          this.editForm.coinLimit = res.data.productDetail.coinLimit;
          this.editForm.coinLimit = res.data.productDetail.coinLimit;
          this.editForm.productIntro = res.data.productIntro;
          if(res.data.productDetail.isCommission == 1){
            this.editForm.commissionRebate = res.data.productDetail.commissionRebate;
          }

          this.editForm.sortList =  JSON.parse(res.data.sortList);
          this.editForm.isShelves = res.data.isShelves == 0 ? false : true;
          this.editForm.onLive = res.data.onLive == 0 ? false : true;
          this.guigeList = res.data.rules;
          for(var i=0;i<this.guigeList.length;i++){
              if(this.guigeList[i]){
                this.guigeList[i].createTime1 = this.guigeList[i].cTimeStr;
              }
          }
          this.editForm.imgList= [];
          this.editForm.imageList = [];
          for(var i=0;i<res.data.imageList.length;i++){
            this.editForm.imgList.push(res.data.imageList[i].attachment.fileUrl) //显示列表
            this.editForm.imageList.push({ //post给后台的数组
              imageId:res.data.imageList[i].imageId,
              imageType:1,
              cycleValue:'',
              url:res.data.imageList[i].attachment.fileUrl
            })
          }
          this.dialogEditVisible = true;
          this.$nextTick(function () {
            this.editForm.memberIds = JSON.parse(res.data.productSale.memberIds);
            this.editForm.subjectIds = JSON.parse(res.data.productSale.subjectIds);
          })
        })

      },
      //删除方法
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
            await this.deleteGoods(data.row.productId,data.$index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteGoods(id,index){
          this.http.post('/orgProduct/updateOrDeleteProduct',{flag:0,productId:id}).then(res=>{
              if(res.code == 0){
                this.tableData.splice(index,1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
          })
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

<style>
  .el-main{
    line-height: 30px !important;
  }
  .ql-container{
    height: 200px;
  }
  .el-upload{
    display: block;
  }
  .el-main{
    text-align: left !important;
  }
</style>
