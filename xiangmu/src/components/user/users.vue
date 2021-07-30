<template>
  <div class="user">
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- input框 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            clearable
            @clear="getUsers"
            placeholder="请输入内容"
            v-model="usersInfo.query"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>

      <!-- 用户列表 -->
      <el-table border stripe :data="userlist" style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="kaiguan(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip
              effect="dark"
              content="修改角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip
              effect="dark"
              content="删除角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="open(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="usersInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户的对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogVisibles"
      >
        <!-- 内容主体区 -->
        <span
          ><el-form
            :model="ruleForm"
            :rules="rulesRules"
            ref="ruleFormRef"
            label-width="70px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisibless">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改 "
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="juesVisible"
        width="50%"
        @close="setrolecosed"
      >
        <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>
            分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="juesVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //  验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}/;
      if (regEmail.test(value)) {
        // 合法的
        return cb();
      }
      cb(new Error("请输入合法邮箱"));
    };

    // 验证手机号的规则

    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (regMobile.test(value)) {
        // 合法的
        return cb();
      }
      cb(new Error("请输入合法手机号"));
    };

    return {
      input1: "",
      input2: "",
      input3: "",
      select: "",
      usersInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 每页多少行
        pagesize: 10,
      },
      userlist: [],
      total: 0,
      // 控制对话框
      dialogVisible: false,
      // 添加用户的表单数据
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户的验证规则
      rulesRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      }, //控制修改用户对话框
      editDialogVisible: false,
      // 查询到用户信息对象
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      juesVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 保存已选择的值
      selectedRoleId: "",
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      const { data: res } = await this.$http.get("users", {
        params: this.usersInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.userlist = res.data.users;
      this.total = res.data.total;
    },

    // 分页器
    handleSizeChange(newSize) {
      // console.log(`每页 ${val} 条`);
      this.usersInfo.pagesize = newSize;
      this.getUsers();
    },
    handleCurrentChange(newNum) {
      this.usersInfo.pagenum = newNum;
      this.getUsers();
    },
    // 监听开关状态
    async kaiguan(v) {
      await this.axios
        .put(
          `http://127.0.0.1:8888/api/private/v1/users/${v.id}/state/${v.mg_state}`,
          {}
        )
        .then((res) => {
          this.$message.success("更新用户状态成功");
        })
        .catch((err) => {
          v.mg_state = !v.mg_state;
          this.$message.error("更新用户状态失败");
        });
    },
    // 取消按钮
    dialogVisibles() {
      this.$refs.ruleFormRef.resetFields();
    },
    // 确定按钮
    dialogVisibless() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return;
        //可以发送添加用户网络请求
        const { data: res } = await this.$http.post("users", this.ruleForm);
        if (res.meta.status != 201) {
          this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.dialogVisible = false;
        // 刷新数据库
        this.getUsers();
      });
    },
    // 编辑用户
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询失败");
      }
      this.editForm = res.data;
      // 刷新数据库
      this.getUsers();
      this.editDialogVisible = true;
    },
    // 修改用户关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        //可以发送添加用户网络请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.editDialogVisible = false;
        // 刷新数据库
        this.getUsers();
        this.$message.success("修改成功");
      });
    },
    // 删除用户
    open(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          const { data: res } = this.$http.delete("users/" + id);
          // 刷新数据库
          this.getUsers();
          console.log(this.getUsers());
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.rolesList = res.data;
      this.juesVisible = true;
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择分配角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      );
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("分配失败");
      }
      this.$message.success("更新角色成功");
      this.getUsers();
      this.juesVisible = false;
    },
    // 关闭重置对话框
    setrolecosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
    },
  },
};
</script>

<style lang="less" scoped>
</style>