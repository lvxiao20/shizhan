<template>
  <div class="categories">
    <!-- 头部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加分类按钮区 -->
      <el-row class="treetable">
        <el-col :span="2">
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="categorieslist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="openn(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options指定数据源 -->
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChanged"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog title="修改" :visible.sync="xiuVisible" width="50%">
        <el-form
          :model="xiuCateForm"
          ref="xiuCateFormRef"
          label-width="70px"
          @close="xiuClose"
        >
          <el-form-item label="角色 ID" prop="cat_id">
            <el-input v-model="xiuCateForm.cat_id"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="cat_name">
            <el-input v-model="xiuCateForm.cat_name"> </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="xiuVisible = false">取 消</el-button>
          <el-button type="primary" @click="xiuV">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      categorieslist: [],
      total: 0,
      // 控制添加分类对话框显示隐藏
      addCateDialogVisible: false,
      // 添加表单的数据对象
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      // 添加分类表单校验规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      // 父级类别的数据
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      xiuCateForm: {},
      xiuVisible : false,
    };
  },
  created() {
    // 获取所有角色
    this.getCategorieslist();
  },
  methods: {
    async getCategorieslist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("数据拉取失败");
      }
      this.categorieslist = res.data.result;
      // 为总数据条数赋值
      this.total = res.data.total;
    },

    //  分页区
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCategorieslist();
    },
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCategorieslist();
    },
    // 点击按钮展示对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("信息获取失败");
      }
      this.parentCateList = res.data;
    },
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        // 父级分类id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        //可以发送添加用户网络请求
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status != 201) {
          this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.addCateDialogVisible = false;
        // 刷新数据库
        this.getCategorieslist();
      });
    },
    // 监听对话框的关闭事件，重置清空
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 删除用户
    async openn(id) {
      const confitmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confitmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getCategorieslist();
    },
    // 编辑角色
    async showDialog(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色失败");
      }
      this.xiuCateForm= res.data;
      this.xiuVisible = true;
      console.log(res);
    },
    // 修改用户关闭事件
    xiuClose() {
      this.$refs.xiuCateFormRef.resetFields();
    },
    // 提交编辑角色
    xiuV() {
      this.$refs.xiuCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "categories/" + this.xiuCateForm.cat_id,
          {
            cat_name: this.xiuCateForm.cat_name,
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.xiuVisible = false;
        // 刷新数据库
        this.getRoleslist();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.treetable {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>