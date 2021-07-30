<template>
  <div class="Home">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../assets/home.jpg" alt="" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="tui">退出</el-button>
      </el-header>
      <el-container>
        <!-- 左侧 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 线 -->
          <div class="xian" @click="xians">|||</div>
          <!-- 菜单 -->
          <el-menu
            :default-active="v"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in list"
              :key="item.id"
            >
              <!-- 一级菜单模板 -->
              <template slot="title">
                <i :class="arry[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="items.path"
                v-for="items in item.children"
                :key="items.id"
                @click="yanse(items.path)"
              >
                <!-- 二级菜单模板 -->
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ items.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      arry: {
        125: "iconfont icon-renyuan",
        103: "iconfont icon-quanxianguanli",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-dingdanguanli",
        145: "iconfont icon-shujutongji",
      },
      isCollapse: false,
      v:''
    };
  },
  created() {
    this.getMenuList();
    this.v=window.sessionStorage.getItem('ni')
  },
  methods: {
    tui() {
      window.sessionStorage.clear();
      this.$router.push("/");
    },
    // 获取所有的菜单
    getMenuList() {
      this.axios
        .get("http://127.0.0.1:8888/api/private/v1/menus")
        .then((res) => {
          this.list = res.data.data;
          if (res.data.meta.status !== 200)
            return this.$message.error(res.data.meta.msg);
        });
    },
    xians() {
      this.isCollapse = !this.isCollapse;
    },
    yanse(v){
      window.sessionStorage.setItem('ni',v)
      this.v=v
    }
  },
};
</script>

<style lang="less" scoped>
.Home,
.el-container {
  height: 100%;
}
// 头部
.el-header {
  background-color: #373d41;
  color: white;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  box-sizing: border-box;
  align-content: center;
  font-size: 15px;
  div {
    display: flex;
    img {
      width: 70px;
      border-radius: 50%;
    }
    span {
      margin-left: 10px;
    }
  }
}
// 侧边栏
.el-aside {
  background-color: #545c64;
  color: #333;
  line-height: 200px;
  .iconfont {
    margin-right: 7px;
  }
  .el-menu {
    border: none;
  }
  .xian {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 20px;
    color: white;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
// 内容
.el-main {
  background-color: #eaedf1;
  color: #333;
  text-align: center;
  line-height: 160px;
}
</style>