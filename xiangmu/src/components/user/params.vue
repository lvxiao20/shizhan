<template>
  <div class="params">
    <!-- 头部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三极分类设置相关参数！"
        show-icon
        :closable="false"
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="catelist"
            :props="cateProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>

      <!-- 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数 -->
          <el-button type="primary" size="mini" :disabled='isBtnDisabled'>添加参数</el-button>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性 -->
          <el-button type="primary" size="mini" :disabled='isBtnDisabled'>添加属性</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      catelist: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedCateKeys: [],
      // 被激活的页签名称
      activeName: "many",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.catelist = res.data;
    },
 handleChange() {
      //  证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      // 根据所选分类的id 和当前所处的面板，获取对应参数
       this.getParamsData()

    },
    // tab页签点击事件
    handleClick() {
      this.getParamsData()

    },
   async getParamsData(){
          if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        return;
      }
      // 根据所选分类的id 和当前所处的面板，获取对应参数
  const{data:res}=   await this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{sel:this.activeName}
      })
      if(res.meta.status !==200){
        return this.$message.error('获取参数失败')
      }
      console.log(res.data);
    }
  },
  computed: {
    isBtnDisabled(){
       if(this.selectedCateKeys.length!==3){
      return true
    }
    return false
    },
    cateId(){
        if(this.selectedCateKeys.length!==3){
      return this.selectedCateKeys[2]
    }
    return false
    }
  
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>