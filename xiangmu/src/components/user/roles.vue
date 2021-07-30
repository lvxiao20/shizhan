<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col :span="2">
          <el-button type="primary" @click="rolesVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 权限列表 -->
      <el-table border stripe :data="roleslist">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', 'bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeby(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeby(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeby(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->

            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >

            <!-- 删除按钮 -->

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="open(scope.row.id)"
              >删除</el-button
            >

            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="showdlog(scope.row)"
                type="warning"
                icon="el-icon-setting"
                size="mini"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
        -->
      </el-table>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="rolesVisible"
        width="50%"
        @close="addclosed"
      >
        <!-- 内容主体区 -->
        <el-form
          :model="rolesForm"
          :rules="rolesRules"
          ref="roleFormRef"
          label-width="70px"
        >
          <el-form-item label="角色 ID" prop="roleId">
            <el-input v-model="rolesForm.roleId"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="rolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="rolesVisibless">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog title="修改" :visible.sync="xiuVisible" width="50%">
        <el-form
          :model="xiurolesForm"
          ref="xiurolesFormRef"
          label-width="70px"
          @close="xiuClose"
        >
          <el-form-item label="角色 ID" prop="roleId">
            <el-input v-model="xiurolesForm.roleId"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="xiurolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="xiurolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="xiuVisible = false">取 消</el-button>
          <el-button type="primary" @click="xiuV">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="fenVisible"
        width="30%"
        @close="setloglosed"
      >
        <!-- 树形空件 -->
        <el-tree
          :data="rightlist"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defkeys"
          ref="treeRef"
        ></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="fenVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      roleslist: [],
      // 表单显示隐藏
      rolesVisible: false,
      xiuVisible: false,
      fenVisible: false,
      // 添加角色数据
      rolesForm: {},
      xiurolesForm: {},
      //验证表单规则
      rolesRules: {},
      // 权限分配
      rightlist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中节点
      defkeys: [],
      // 即将分配权限的id
      roleId: "",
    };
  },
  created() {
    // 获取所有角色
    this.getRoleslist();
  },
  methods: {
    // 获取角色列表
    async getRoleslist() {
      const { data: res } = await this.$http.get("roles/");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      }
      this.roleslist = res.data;
    },
    // 添加角色
    // 重置
    addclosed() {
      this.$refs.roleFormRef.resetFields();
    },
    rolesVisibless() {
      this.$refs.roleFormRef.validate(async (valid) => {
        if (!valid) return;
        //可以发送添加用户网络请求
        const { data: res } = await this.$http.post("roles", {
          roleId: this.rolesForm.roleId,
          roleName: this.rolesForm.roleName,
          roleDesc: this.rolesForm.roleDesc,
        });
        if (res.meta.status != 201) {
          this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.rolesVisible = false;
        // 刷新数据库
        this.getRoleslist();
      });
    },
    // 删除用户
    open(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.$http.delete("roles/" + id);
          // 刷新数据库

          this.getRoleslist();
          console.log(this.getRoleslist());
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 编辑角色
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询角色失败");
      }
      this.xiurolesForm = res.data;
      this.xiuVisible = true;
      console.log(res);
    },
    // 修改用户关闭事件
    xiuClose() {
      this.$refs.xiurolesFormRef.resetFields();
    },
    // 提交编辑角色
    xiuV() {
      this.$refs.xiurolesFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.xiurolesForm.roleId,
          {
            roleName: this.xiurolesForm.roleName,
            roleDesc: this.xiurolesForm.roleDesc,
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
    // 根据id删除对应权限
    async removeby(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      role.children = res.data;
    },
    // 分配权限弹框
    async showdlog(role) {
      this.roleId = role.id;
      // 获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      //  获取权限数据保存data中
      this.rightlist = res.data;
      this.getLeafKeys(role, this.defkeys);
      this.fenVisible = true;
    },
    // 通过递归传递三级
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    setloglosed() {
      this.defkeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.$message.success("权限分配成功");
      this.getRoleslist();
      this.fenVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>