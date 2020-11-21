<!--suppress JSAnnotator -->
<template>
  <div>
    <div>
      <el-button @click="addProductFn" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加课程
      </el-button>
    </div>
    <div style="margin-bottom: 10px;">
      <el-input style="width: 200px;" placeholder="输入课程名称搜索" v-model.string="keyWord" auto-complete="off"></el-input>
      <el-button @click="searchProductByType()" type="primary" style="margin-left: 10px;">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="productAid"
        label="ID"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="标题"
        align="center">
      </el-table-column>
      <el-table-column
        label="优惠类型"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productDetail.isCut==1">砍价活动</span>
          <span v-if="scope.row.productDetail.isGroup==1">拼团活动</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拼团人数"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productDetail.isGroup==1">{{scope.row.groups[0].sGroupSumNum}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="拼团价格"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productDetail.isGroup==1">{{scope.row.groups[0].sGroupPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="可砍去金额"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productDetail.isCut==1">{{scope.row.productDetail.cutFloorPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="可砍人数"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productDetail.isCut==1">{{scope.row.productDetail.cutNum}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="图片"
      >
        <template slot-scope="scope">
          <img :src="scope.row.attachment.fileUrl" width="100" height="100" class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="cTimeStr"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="validTimeString"
        label="有效期"
        align="center">
      </el-table-column>

      <el-table-column
        label="结束日期"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.productDetail.isCut==1">{{scope.row.endTime}}</span>
          <span v-if="scope.row.productDetail.isGroup==1">{{scope.row.endTime}}</span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
          <el-button @click="editGoods(scope.row)" type="text" size="small">编辑</el-button>
          <el-button v-if="scope.row.productDetail.isGroup==1" @click="groupNow(scope)" type="text" size="small">
            查看团购列表
          </el-button>
          <!--<el-button @click="seeProductClass(scope)" type="text" size="small">查看课时</el-button>-->
          <el-button @click="seeProductStage(scope)" type="text" size="small">查看阶段</el-button>


          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="goodstotal">
    </el-pagination>
    <!--dialog添加-->
    <el-dialog title="添加课程" :visible.sync="dialogFormVisible" width="75%">
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
          label="课程所属项目"
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
          <el-select v-model="form.alClassId" placeholder="请选择所属班次">
            <el-option
              v-for="(item,index) in classList"
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
          <el-upload style="display:none" :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload>
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
            <img v-if="form.productImg" :src="form.productImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播图(最多4张,750*250)" :label-width="formLabelWidth">
          <el-upload
            action="apiurl"
            list-type="picture-card"
            :http-request="uploadImgList"
            :on-preview="handlePictureCardPreview"
            :file-list="form.imageList"
            :limit="maxImgNum"
            :on-remove="deleteImageList"

          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否给予佣金" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.isCommission" label="1">是</el-radio>
            <el-radio v-model="form.isCommission" label="0">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="佣金金额"
          :label-width="formLabelWidth"
          prop="commissionRebate"
          v-show="form.isCommission==1"
        >
          <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.string="form.commissionRebate"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程活动" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="radio" label="1" @change="handleCheckedAdd">砍价</el-radio>
            <el-radio v-model="radio" label="2" @change="handleCheckedAdd">拼团</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="课程原价"
          :label-width="formLabelWidth"
          prop="productPrice"
        >
          <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.string="form.productPrice"
                    auto-complete="off"></el-input>
        </el-form-item>
        <!--砍价参数-->
        <el-form-item
          label="可砍去金额"
          :label-width="formLabelWidth"
          prop="cutFloorPrice"
          v-show="form.isCut"
        >
          <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.string="form.cutFloorPrice"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="可砍人数"
          :label-width="formLabelWidth"
          prop="cutNum"
          v-show="form.isCut"
        >
          <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.string="form.cutNum"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="优惠活动结束日期"
          :label-width="formLabelWidth"
          prop="cutFloorPrice"
          v-show="form.isCut"
        >
          <el-date-picker
            style="width: 180px"
            v-model="form.cutEndTime"
            type="datetime"
            size="large"
            placeholder="选择活动结束时间"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <!--拼团参数-->
        <el-form-item
          label="拼团设置"
          :label-width="formLabelWidth"
          prop="groupPrice"
          v-show="form.isGroup"
        >
          <div style="color:red;font-size: 14px;">砍价人数和砍价底价设置为0即只能拼团</div>
          <div style="color:#409eff;font-size: 14px;">拼团人数必须有一个2人团，否则提交不通过</div>
          <el-input style="width: 180px" placeholder="请输入拼团价格" oninput="value=value.replace(/[^\d.]/g,'')"
                    v-model.string="groupObj.groupPrice" auto-complete="off"></el-input>
          <el-input style="width: 180px" placeholder="请输入成团人数" oninput="value=value.replace(/[^\d.]/g,'')"
                    v-model.string="groupObj.groupSumNum" auto-complete="off"></el-input>
          <!--          <el-input style="width: 180px" placeholder="请输入可砍去金额" oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.string="groupObj.cutFloorPrice" auto-complete="off"></el-input>-->
          <!--          <el-input style="width: 180px" placeholder="请输入可砍人数" oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.string="groupObj.cutNum" auto-complete="off"></el-input>-->
          <el-date-picker
            style="width: 180px"
            v-model="groupObj.gTime"
            type="datetime"
            size="large"
            placeholder="选择活动结束时间"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <el-button type="primary" @click="addGroupToList">添加</el-button>
          <template>
            <div v-for="(item,index) in groupList">
              <el-tag closable @close="deleteGroupList(item)">
                规格{{index+1}}：团购价格￥{{item.groupPrice}} ；成团人数{{item.groupSumNum}}；砍价底价：{{item.cutFloorPrice}}
                ；可砍人数：{{item.cutNum}}；优惠活动结束日期 {{item.gTime}}
              </el-tag>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="是否可使用质正币" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.isCoin" label="1">是</el-radio>
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
        <el-form-item
          label="购买次数"
          :label-width="formLabelWidth"
          prop="purchaseNum"
        >
          <el-input v-model.number="form.purchaseNum" oninput="value=value.replace(/[^\d]/g,'')"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="浏览次数"
          :label-width="formLabelWidth"
          prop="browseNum"
        >
          <el-input v-model.number="form.browseNum" oninput="value=value.replace(/[^\d]/g,'')"
                    auto-complete="off"></el-input>
        </el-form-item>
        <!--添加规格-->
        <el-form-item
          label="规格"
          :label-width="formLabelWidth"
          prop="guige"
        >
          <template>
            <el-select v-model="guigeObj.classId" @change="getGoodsId()" placeholder="请选择规格">
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

            <el-date-picker
              v-model="guigeObj.createTime1"
              type="datetime"
              size="large"
              placeholder="选择开课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-input style="width:180px;" placeholder="课时数量" oninput="value=value.replace(/[^\d.]/g,'')"
                      v-model.number="guigeObj.classTime" auto-complete="off"></el-input>
            <el-date-picker
              v-model="guigeObj.endTime"
              type="datetime"
              size="large"
              placeholder="选择结课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-button type="primary" @click="addGuigeToList">添加</el-button>
          </template>
          <template>
            <div>
              <el-tag v-for="(item,index) in guigeList" closable @close="deleteGuigeItem(item)">
                规格{{index+1}}：{{item.className}} {{item.teachName}} {{item.createTime1}}
              </el-tag>
            </div>
          </template>
        </el-form-item>

        <el-form-item
          label="课程有效期"
          :label-width="formLabelWidth"
          prop="onLive"
        >
          <el-date-picker
            v-model="form.validTime"
            type="datetime"
            size="large"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择课程有效期"
            :editable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
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
        <!--        <el-form-item label="所属班次" :label-width="formLabelWidth">-->
        <!--          <el-select v-model="editForm.alClassId" placeholder="请选择所属班次" >-->
        <!--            <el-option-->
        <!--              v-for="(item,index) in classList"-->
        <!--              :key="item.classId"-->
        <!--              :label="item.className"-->
        <!--              :value="item.classId"-->
        <!--            >-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="课程权限" :label-width="formLabelWidth">-->
        <!--          <el-select v-model="editForm.memberIds" multiple placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="item in authList"-->
        <!--              :key="item.memberId"-->
        <!--              :label="item.memberName"-->
        <!--              :value="item.memberId">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="所属学科" :label-width="formLabelWidth">-->
        <!--          <el-select v-model="editForm.subjectIds" multiple placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="item in subjectList"-->
        <!--              :key="item.subjectId"-->
        <!--              :label="item.subjectName"-->
        <!--              :value="item.subjectId">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="绑定销售包" :label-width="formLabelWidth">-->
        <!--          <el-select v-model="editForm.alSaleId" placeholder="请选择">-->
        <!--            <el-option-->
        <!--              v-for="(item,index) in aiList"-->
        <!--              :key="index"-->
        <!--              :label="item.saleName"-->
        <!--              :value="item.alSaleId">-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->

        <el-form-item
          label="课程简单描述"
          :label-width="formLabelWidth"
          prop="productIntro"
          :rules="[
            {required: true, message: '简单描述不能为空'},
          ]"
        >
          <el-input placeholder="展示在列表的简单描述，不可超过50字" v-model.string="editForm.productIntro"
                    auto-complete="off"></el-input>
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
          <el-upload style="display:none" :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload>
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
            :http-request="uploadImgListEdit"
            :on-preview="handlePictureCardPreview"
            :file-list="editForm.imageList"
            :limit="maxImgNum"
            :on-remove="deleteImageList"

          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否给予佣金" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editForm.isCommission" label="1">是</el-radio>
            <el-radio v-model="editForm.isCommission" label="0">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="佣金金额"
          :label-width="formLabelWidth"
          prop="commissionRebate"
          v-show="editForm.isCommission==1"
        >
          <el-input oninput="value=value.replace(/[^\d.]/g,'')" v-model.string="editForm.commissionRebate"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="购买次数"
          :label-width="formLabelWidth"
          prop="purchaseNum"
        >
          <el-input v-model.number="editForm.purchaseNum" oninput="value=value.replace(/[^\d]/g,'')"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="浏览次数"
          :label-width="formLabelWidth"
          prop="browseNum"
        >
          <el-input v-model.number="editForm.browseNum" oninput="value=value.replace(/[^\d]/g,'')"
                    auto-complete="off"></el-input>
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
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </div>
    </el-dialog>
    <!--拼团人数列表 -->
    <el-dialog title="团购详情" width="75%" :visible.sync="groupFlag">
      <el-table
        :data="goodsGroupList"
        style="width: 100%">
        <el-table-column
          prop="groupPrice"
          label="拼团价格"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="groupSumNum"
          label="拼团人数"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="groupNum"
          label="已拼团人数"
          width="100"
          align="center">
        </el-table-column>

        <el-table-column
          prop="groupEndTime"
          label="拼团结束时间"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="strFullGroupTime"
          label="拼团完成时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isFullGroup"
          label="拼团状态"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isFullGroup==1">已成团</span>
            <span v-if="scope.row.isFullGroup==0">未成团</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          type="index"
          align="center"
          width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isFullGroup==0" @click="handleGroupNow(scope)" type="text" size="small">立即成团
            </el-button>
            <!--<el-button type="text" size="small">编辑</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupFlag = false">确定</el-button>
      </div>
    </el-dialog>
    <videos ref="child" v-show="seeClassFlag"></videos>

  </div>
</template>

<script>
  import videos from "../common/videos"

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
    ["blockquote", "code-block"], // 引用  代码块
    [{header: 1}, {header: 2}], // 1、2 级标题
    [{list: "ordered"}, {list: "bullet"}], // 有序、无序列表
    [{script: "sub"}, {script: "super"}], // 上标/下标
    [{indent: "-1"}, {indent: "+1"}], // 缩进
    // [{'direction': 'rtl'}],                         // 文本方向
    [{size: ["small", false, "large", "huge"]}], // 字体大小
    [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题
    [{color: []}, {background: []}], // 字体颜色、字体背景颜色
    [{font: []}], // 字体种类
    [{align: []}], // 对齐方式
    ["clean"], // 清除文本格式
    ["link", "image"] // 链接、图片、视频
  ];
  import {quillEditor} from "vue-quill-editor"; //调用编辑器
  import {quillRedefine} from 'vue-quill-editor-upload'
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  export default {
    data() {
      return {
        keyWord: '',
        authList: [],
        radio: '1',
        isMoney: '0',
        editorOption: {
          theme: "snow",
          placeholder: "请输入课程描述...",
          modules: {
            toolbar: {
              container: toolbarOptions,
              handlers: {
                'image': function (value) {
                  if (value) {
                    var fileInput = document.querySelector('#uniqueId input') //隐藏的file元素
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
        currentPage: 1,//当前页数
        dialogEditVisible: false, //编辑课程
        dialogFormVisible: false, //添加课程

        dialogImageUrl: '',
        dialogVisible: false,
        orgId: JSON.parse(localStorage.getItem('userinfo')).id,
        form: {
          validTime:'',//课程有效期
          alSaleId: null,
          onLive: null,
          memberIds: [],
          subjectIds: [],
          productName: '',
          sortList: [],
          productDesc: '',
          productImage: '',
          rules: [],
          browseNum: '',//浏览次数
          purchaseNum: '',//购买次数
          productPrice: 0,//课程默认价格
          isCoin: '0',
          isCoupon: '0',
          productImg: '',
          imageList: [],
          imgList: [],
          isCut: 1,
          isGroup: 0,
          cutFloorPrice: null,//砍价底价
          coinLimit: '',
          groups: [], //团购数组
          cutEndTime: '',//砍价结束日期
          cutNum: '',
          commissionRebate: '',
          isCommission: '0',
          productIntro: '',
          orgId: JSON.parse(localStorage.getItem('userinfo')).id,
          alClassId: '',
        },//添加课程
        editForm: {
          isShelves:'',
          alSaleId: null,
          onLive: null,
          memberIds: [],
          subjectIds: [],
          productName: '',
          sortList: [],
          productDesc: '',
          productImage: '',
          rules: [],
          browseNum: '',//浏览次数
          purchaseNum: '',//购买次数
          productPrice: 0,//课程默认价格
          isCoin: '0',
          isCoupon: '0',
          productImg: '',
          imageList: [],
          imgList: [],
          isCut: 1,
          isGroup: 0,
          cutFloorPrice: null,//砍价底价
          coinLimit: '',
          groups: [], //团购数组
          cutEndTime: '',//砍价结束日期
          cutNum: '',
          commissionRebate: '',
          isCommission: '0',
          productIntro: '',
          orgId: JSON.parse(localStorage.getItem('userinfo')).id,
          alClassId: '',
        },//编辑课程
        pickerOptions: {
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: (time) => {
            // 如果函数处理比较简单,可以直接在这里写逻辑方法
            // return time.getTime() < Date.now() - 8.64e7

            // 如果函数里处理的数据比较麻烦,也可以单独放在一个函数里,避免data数据太臃肿
//            return this.dealDisabledDate(time)
          }
        }, // 日期设置对象, // 日期设置对象
        maxImgNum: 4,
        formLabelWidth: '120px',
        tableData: [],
        apiurl: '',
        pagesize: 10,
        pagenum: 1,
        goodstotal: 0,
        guigeObj: {
          classId: null,
          teachId: 2,
          createTime: null,
          className: '',
          teachName: '',
          createTime1: '',
          classTime: '',
          endTime: ''
        },
        checkList: [],

        classType: [], //规格1
        classTypeId: null,
        teachType: [], //规格2
        teachTypeId: null,
        guigeList: [],

        groupList: [],
        groupObj: {
          groupPrice: '',
          groupNum: '',
          groupEndTime: '',
          cutFloorPrice: '',
          cutNum: '',
          gTime: '',
          cTime: '',
        },
        isGroup: false,
        isKan: false,

        typeList: [],//课程分类列表
        cascaderObj: {
          value: 'id',
          label: 'name'
        },
        sortListArr: [],
        groupFlag: false,
        goodsGroupList: [],//课程的团购列表
        subjectList: [],
        keshiSubjectList: [],

        classList: [],//班次列表
        seeClassFlag: false,//控制是否显示课时列表

        seeId: null,//当前查看的课时的课程ID
        addClassFlag: false,//控制添加课时
        kpagenum: 1,
        ktotal: 0,
        keshiList: [],
        keshiObj: {
          subjectId: '',
          stageId: null,
          onLine: '',
          lineVideoUrl: '',//不是直播的话 需要传视频ID
          productId: '',
          videoName: '',
          longStartTime: '',
          longEndTime: '',
          isTry: '0',//是否试听 0否 1是
          onLive: '0'
//          genseeNumber:'', //直播编号
//          genseeAttr:'',//直播字符串
        },
        editKeshiObj: {},//编辑课时
        editUpdateFlag: false,//编辑课时控制
        seTime: '',

        seeStageFlag: false,
        aiList: [],
      }
    },
    components: {
      quillEditor,
      videos,
    },
    created() {
      this.orgId = JSON.parse(localStorage.getItem('userinfo')).id;
      this.apiurl = this.uplodUrl + '/file/upload';
      this.form.orgId = JSON.parse(localStorage.getItem('userinfo')).id;
      //
      this.getGoodsList();
      this.getGuiGeList();
      this.getClassTypeList();
      this.initPageData();
    },
    methods: {
      //搜索产品
      searchProductByType() {
        this.getGoodsList();
      },
      initPageData() {
        this.http.post('/orgInfo/queryMemberLevelPageList', {}).then(res => {
          if (res.code == 0) {
            this.authList = res.data.list;
          }
        })
        //获取班次
        this.http.post('/orgProduct/getLiveProductParam', {}).then(res => {
          if (res.code == 0) {
            this.classList = res.data;
          }
        })
        //获取学科
        this.http.post('/orgProduct/queryAlSubjectList', {}).then(res => {
          if (res.code == 0) {
            this.subjectList = res.data;
            this.subjectList1 = res.data;
          }
        })
        //获取销售包
        this.http.post('/orgProduct/queryAlSalePackageList', {}).then(res => {
          if (res.code == 0) {
            this.aiList = res.data;
          }
        })
      },

      //查看阶段
      seeProductStage(data) {
        this.seeClassFlag = true;
        this.seeStageId = data.row.stageId;
        this.$refs.child.$emit('seeVideos', data.row) // 方法1:触发监听事件
      },
      khandleCurrentChange(v) {
        this.kpagenum = v;
        this.getProductClassKeshiList();
      },


      addProductFn() {
        this.dialogFormVisible = true
        this.guigeList = [];
        // return;
        // this.$confirm('1、填写课程参数、课程说明等内容并切实提供。\n2、设置组团、砍价等优惠并切实提供。\n3、学员报名学费在开课7日内，学员点击上课满意后学费转入机构。\n如学员点击上课不满意学费将退还学员账户。如学员既没有点击上课满意也没有点击上课不满意，\n则默认学员上课满意，第8天学费将自动转入机构账户。\n4、机构将学费提现均会扣除0.6%银行手续费。\n5、点击同意是为本协议已生效，应按此履行对学员的义务和其他事项。, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '已取消'
        //   });
        // });
      },
      getClassTypeList() {
        this.http.post('/orgProduct/queryProductSort', {}).then(res => {
          if (res.code == 0) {
            this.typeList = res.data;
          }
        })
      },
      dealDisabledDate(time) {
        return time.getTime() < Date.now()
      },
      getGoodsList() {
        this.http.post('/activity/queryActivity', {
          orgId: this.orgId,
          pageNum: this.pagenum,
          pageSize: 10
        }).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              if (res.data.list[i].endTime) {
                var time = new Date(res.data.list[i].endTime);
                res.data.list[i].endTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
              }
            }
            this.tableData = res.data.list;
            this.goodstotal = res.data.total;
          }
        })
      },
      getGuiGeList() {
        this.http.post('/orgProduct/queryProductRule', {}).then(res => {
          if (res.code == 0) {
            this.classType = res.data.classType;
            this.teachType = res.data.teachType;
          }
        })
      },
      handleCheckedAdd: function (data) {
        if (data == '1') {
          this.form.isCut = 1;
        } else {
          this.form.isCut = 0;
        }
        if (data == '2') {
          this.form.isGroup = 1;
        } else {
          this.form.isGroup = 0;
        }
      },
      addGroupToList() {
        if (!this.groupObj.groupPrice) {
          this.$errorMessage('请输入团购价格')
          return;
        }
        if (!this.groupObj.groupSumNum) {
          this.$errorMessage('请输入成团人数')
          return;
        }
        if (this.groupObj.cutFloorPrice == 0) {
          if (this.groupObj.cutNum > 0) {
            this.$errorMessage('拼团砍价底价为0，人数必须为0')
            return;
          }
        }
        if (this.groupObj.cutFloorPrice) {
          if (Number(this.groupObj.groupPrice) < Number(this.groupObj.cutFloorPrice)) {
            this.$errorMessage('拼团价格必须大于砍价价格')
            return;
          }
        }
        this.groupObj.groupEndTime = new Date(this.groupObj.gTime.toString()).getTime()

        if (!this.groupObj.groupEndTime) {
          this.$errorMessage('请输入团购结束日期')
          return;
        }
        this.groupList.push(this.groupObj)
        this.groupObj = {
          groupPrice: '',
          groupSumNum: '',
          groupEndTime: '',
          cutFloorPrice: '',
          cutNum: '',
          gTime: ''
        }
      },
      handleChecked: function (data) {
        if (data.indexOf('1') >= 0) {
          this.isKan = true;
        } else {
          this.isKan = false;
        }
        if (data.indexOf('2') >= 0) {
          this.isGroup = true;
        } else {
          this.isGroup = false;

        }
      },
      //添加规格事件
      addGuigeToList() {
        if (this.guigeList.length > 0) {
          this.$errorMessage('优惠活动只能添加一个规格')
          return;
        }
        if (!this.guigeObj.classId) {
          this.$errorMessage('请选择规格')
          return;
        }
        if (!this.guigeObj.teachId) {
          this.$errorMessage('请选择形式')
          return;
        }
        if (!this.guigeObj.createTime1) {
          this.$errorMessage('请选择开课时间')
          return;
        }
        if (!this.guigeObj.classTime) {
          this.$errorMessage('请填写上课时段')
          return;
        }
        if (!this.guigeObj.endTime) {
          this.$errorMessage('请选择结课时间')
          return;
        }
        this.guigeObj.createTime = new Date(this.guigeObj.createTime1.toString()).getTime()
        this.guigeObj.className = this.classType.find((item) => {
          return item.classId === this.guigeObj.classId;
        }).className;
//          this.guigeObj.teachName = this.teachType.find((item)=>{
//              return item.teachId === this.guigeObj.teachId;
//        }).teachName;
        let obj = {};
        Object.assign(obj, this.guigeObj);  //直接使用guigeObj为引用类型 添加后再次添加时会影响之前添加的规格
        this.guigeList.push(obj); //所以深拷贝一个对象再次添加 不会影响this.guigeObj
        this.guigeObj = {
          classId: null,
          teachId: 2,
          productPrice: null,
          createTime: null,
          createTime1: null,
          className: '',
          teachName: '',
          classTime: '',
          endTime: ''
        }
      },
      //删除规格
      deleteGuigeItem(tag) {
        this.guigeList.splice(this.guigeList.indexOf(tag), 1);
      },
      deleteGroupList(tag) {
        this.groupList.splice(this.groupList.indexOf(tag), 1);
      },
      getGoodsId(data) {
      },
      //编辑器图
      getEditorImg(file) {
        this.$uploadImg(file).then(res => {
          if (res.code == 0) {
            let range = this.$refs.myQuillEditor.quill.getSelection();
            this.$refs.myQuillEditor.quill.insertEmbed(range != null ? range.index : 0, 'image', res.data.filePath)
          }
        })
      },
      handleCurrentChange(val) {
        this.pagenum = val;
        //切换页码 ${val} 是页码数 请求数据即可
        this.getGoodsList();
      },
      //图片上传
      uploadImg(data, type) {
        this.$uploadImg(data).then(res => {
          if (res.code == 0) {
            if (this.dialogEditVisible) {
              this.editForm.productImage = res.data.fileId
              this.editForm.productImg = res.data.filePath;
            }
            if (this.dialogFormVisible) {
              this.form.productImage = res.data.fileId
              this.form.productImg = res.data.filePath;
            }
          }
        })
      },
      uploadImgList(data) {
        this.$uploadImg(data).then(res => {
          if (res.code == 0) {
            this.form.imgList.push(res.data.filePath) //显示列表
            this.form.imageList.push({ //post给后台的数组
              imageId: res.data.fileId,
              imageType: 1,
              cycleValue: '',
              url: res.data.filePath
            })
//            this.productImg = res.data.fileUrl;
          }
        })
      },
      uploadImgListEdit(data) {
        this.$uploadImg(data).then(res => {
          if (res.code == 0) {
            this.editForm.imgList.push(res.data.filePath) //显示列表
            this.editForm.imageList.push({ //post给后台的数组
              imageId: res.data.fileId,
              imageType: 1,
              cycleValue: '',
              url: res.data.filePath
            })
//            this.productImg = res.data.fileUrl;
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      deleteImageList(data, list) {
        if (this.dialogEditVisible) {
          this.editForm.imageList = list;
        }
        if (this.dialogFormVisible) {
          this.form.imageList = list;
        }

      },
      //新增课程方法
      submitData() {

        if (!this.form.productName) {
          this.$errorMessage('请填写课程标题')
          return;
        }

        if (this.form.sortList.length < 2) {
          this.$errorMessage('请选择课程分类')
          return;
        }

        if (!this.form.productDesc) {
          this.$errorMessage('请填写课程详细描述')
          return;
        }
        if (!this.form.productImage) {
          this.$errorMessage('请上传课程图片')
          return;
        }
        if (this.form.imageList.length == 0) {
          this.$errorMessage('请上传轮播图')
          return;
        }

        if (this.form.productPrice == 0) {
          this.$errorMessage('请输入课程价格')
          return;
        }
        if (this.form.isCommission == 1) {
          if (!this.form.commissionRebate || this.form.commissionRebate <= 0) {
            this.$errorMessage('请填写正确的佣金金额')
            return;
          }
        }
        if (this.form.isCut == 0 && this.form.isGroup == 0) {
          this.$errorMessage('请至少选择一种课程活动')
          return;
        }
        if (this.form.isCut == 1) { //砍价课程
          if (this.form.cutFloorPrice) {
            if (Number(this.form.cutFloorPrice) >= Number(this.form.productPrice)) {
              this.$errorMessage('砍价底价需要小于课程原价')
              return;
            }
            this.form.cutFloorPrice = Number(this.form.cutFloorPrice)
          } else {
            this.$errorMessage('请输入砍价课程的底价')
            return;
          }
          if (!this.form.cutNum) {
            this.$errorMessage('请输入可砍人数')
            return;
          }
        }

        if (this.form.isGroup == 1) {
          if (this.groupList.length == 0) {
            this.$errorMessage('请至少添加一种拼团规格');
            return;
          }
          //判断必须有一个2人团 暂时不要
          // let numFlag = false;
          // for (var i = 0; i < this.groupList.length; i++) {
          //   if (this.groupList[i].groupSumNum == 2) {
          //     numFlag = true;
          //   }
          // }
          // if (!numFlag) {
          //   this.$errorMessage('拼团规格最少需要一个2人团')
          //   return;
          // }
          this.form.groups = this.groupList;
        }
        if (this.form.isCoin == 1) {
          if (this.form.coinLimit % 10 != 0) {
            this.$errorMessage('质正币上限数额必须是10的倍数')
            return;
          }
        }
        if (this.guigeList.length == 0) {
          this.$errorMessage('请至少添加一个商品规格')
          return;
        }
        if (this.form.browseNum > 10000) {
          this.$errorMessage('浏览次数初始不能大于10000')
          return;
        }
        if (this.form.purchaseNum > 1000) {
          this.$errorMessage('购买次数初始不能大于1000')
          return;
        }
        if(!this.form.validTime){
          this.$errorMessage('请选择课程有效期')
          return;
        }
        this.form.rules = this.guigeList;
        if (this.form.onLive) {
          this.form.onLive = 1;
        } else {
          this.form.onLive = 0;
        }
        this.form.productPrice = Number(this.form.productPrice);
        this.http.post('/activity/saveActivity', this.form).then(res => {
          if (res.code == 0) {
            this.$successMessage('添加成功')
            Object.assign(this.$data, this.$options.data())
            this.getGoodsList()
            this.getClassTypeList();
            this.getGuiGeList();
            this.dialogFormVisible = false;
          }
        })
      },

      submitEditData() {
        if (!this.editForm.productName) {
          this.$errorMessage('请填写课程标题')
          return;
        }
        if (!this.editForm.productIntro) {
          this.$errorMessage('请填写简单描述')
          return;
        }
        if (!this.editForm.productDesc) {
          this.$errorMessage('请填写课程详细描述')
          return;
        }
        if (!this.editForm.productImage) {
          this.$errorMessage('请上传课程图片')
          return;
        }
        console.log(this.editForm.imageList)
        if (this.editForm.imageList.length == 0) {
          this.$errorMessage('请上传轮播图')
          return;
        }
        if (!this.editForm.purchaseNum) {
          this.$errorMessage('请填写购买人数')
          return;
        }
        if (!this.editForm.browseNum) {
          this.$errorMessage('请填写浏览人数')
          return;
        }
        if(this.editForm.isShelves){
          this.editForm.isShelves = 1;
        }else{
          this.editForm.isShelves = 0;
        }
        this.http.post('/activity/updateActivityInfo', this.editForm).then(res => {
          if (res.code == 0) {
            this.dialogEditVisible = false;
            this.$successMessage('编辑成功')
            this.getGoodsList()


          }
        })
      },
      //编辑
      editGoods(data) {
        this.http.post('/activity/queryActivityInfo ', {productAid: data.productAid}).then(res => {
          if (res.code == 0) {
            this.dialogEditVisible = true;
            this.editForm.productImage = res.data.attachment.attachmentId;
            this.editForm.productImg = res.data.attachment.fileUrl;
            this.editForm.productAid = res.data.productAid;
            this.editForm.purchaseNum = res.data.purchaseNum;
            this.editForm.browseNum = res.data.browseNum;
            this.editForm.productName = res.data.productName;
            this.editForm.productIntro = res.data.productIntro;
            this.editForm.productDesc = res.data.productDesc;
            // this.editForm.alSaleId = res.data.alSaleId;
            // this.editForm.alClassId = res.data.alClassId;
            // this.editForm.productPrice = res.data.productPrice;
            this.editForm.isCommission = res.data.productList.isCommission.toString()
            this.editForm.isCoin = res.data.productList.isCoin.toString()
            this.editForm.commissionRebate = res.data.productList.commissionRebate
            this.editForm.coinLimit = res.data.productList.coinLimit;
            this.editForm.imgList = [];
            this.editForm.imageList = [];
            this.editForm.isShelves = res.data.isShelves == 0 ? false : true;

            for (var i = 0; i < res.data.imageList.length; i++) {
              this.editForm.imgList.push(res.data.imageList[i].attachment.fileUrl) //显示列表
              this.editForm.imageList.push({ //post给后台的数组
                imageId: res.data.imageList[i].imageId,
                imageType: 1,
                cycleValue: '',
                url: res.data.imageList[i].attachment.fileUrl
              })
            }
            if (res.data.productList.memberLevels) {
              var arr = [];
              for (var i = 0; i < res.data.productList.memberLevels.length; i++) {
                arr.push(res.data.productList.memberLevels[i].memberId)
              }
              this.editForm.memberIds = arr;
            }
            var subjectIds = JSON.parse(res.data.productSale.subjectIds) || [];
            this.editForm.subjectIds = subjectIds;
          }
        })
//        this.editForm = data.row;
      },
      //删除方法
      handleClick(data) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteGoods(data.row.productAid, data.$index);
        }).catch(() => {
        });
      },
      deleteGoods(id, index) {
        this.http.post('/activity/deleteOrUpdateActivity', {flag: 0, productAid: id}).then(res => {
          if (res.code == 0) {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      },
      groupNow(data) {
        this.http.post('/activity/queryGroupList', {productAid: data.row.productAid}).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].groupEndTime = new Date(res.data[i].groupEndTime)
            }
            this.goodsGroupList = res.data

            this.groupFlag = true;
          }
        })
      },
      handleGroupNow(data) {
        this.http.post('/activity/doneGroup', {groupId: data.row.groupId}).then(res => {
          if (res.code == 0) {
            this.$successMessage('操作成功')
            this.groupFlag = false;
          }
        })
      },
    },
    watch: {
      seeVideoFlag(val, oval) {
        if (!val) {
          this.videoUrl = ''
        }
      },
    },
  }
</script>

<style>
  .el-main {
    line-height: 30px !important;
  }

  .ql-container {
    height: 200px;
  }

  .el-upload {
    display: block;
  }

  .el-main {
    text-align: left !important;
  }

  .el-message-box__message p {
    white-space: pre
  }

  .el-message-box {
    width: 50% !important;
  }
</style>
