<template>
  <div class="main-container">
    <div class="common-header">
      <hzzt-title>用户管理</hzzt-title>
      <div class="common-header-end flex align-items-center">
        <!--<el-input style="margin-right: 22px" v-model="keyword" size="small" clearable
                  placeholder="请输入用户名称"
                  suffix-icon="el-icon-search"></el-input>-->
        <el-button type="primary" size="small" @click="addUser">新增用户</el-button>
      </div>
    </div>
    <div class="common-table">
      <el-table
        ref="pTable"
        v-loading="loading"
        :data="data"
        style="width: 100%">
        <el-table-column prop="name"
                         label="用户名"
                         min-width="120"
                         align="center">
        </el-table-column>
        <el-table-column prop="realname"
                         label="角色名"
                         min-width="120"
                         align="center">
        </el-table-column>
        <el-table-column prop="email"
                         label="邮箱"
                         min-width="120"
                         align="center">
        </el-table-column>
        <el-table-column prop="operate" align="center" label="操作" fixed="right" min-width="120">
          <template slot-scope="scope">
            <div class="flex align-items-center justify-content-center wrap">
              <!--<el-button type="primary" size="small" @click="editUser(scope.row)">编辑</el-button>-->
              <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="用户信息" :visible.sync="dialogUser" center width="40%">
      <el-form
        size="small" :model="userForm" label-width="80px" label-position="left"
        class="edit-user-form" ref="userForm" :rules="userRules">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="userForm.name" auto-complete="off" placeholder="用以登录系统"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newpassword">
          <el-input type="password" v-model="userForm.newpassword" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveUser">保 存
        </el-button>
        <el-button size="small" @click="cancelUser">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {userService} from "./user.service";

  export default {
    created() {
      this.userList();
    },
    components: {
      hzztTitle,
    },
    data() {
      return {
        data: [],
        dialogUser: false,
        keyword: '',
        loading: false,
        tableHeight: undefined,
        userForm: {},
        userRules: {
          name: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
          newpassword: [{required: true, message: '请输入密码', trigger: 'blur'}, {
            validator: this.valPwd, trigger: 'blur',
          }],
          email: [
            {required: true, message: '请输入用户邮箱', trigger: 'blur'},
          ],
        },
      }
    },
    methods: {
      addUser() {
        this.dialogUser = true;
        this.$refs?.['userForm']?.resetFields();
        this.userForm = {};
      },
      cancelUser() {
        this.dialogUser = false;
      },
      deleteUser(id) {
        userService.delUser(id)
          .then(({body}) => {
            this.$message.success('删除成功');
            this.userList();
          })
      },
      editUser(user) {
        this.dialogUser = true;
        this.$refs?.['userForm']?.resetFields();
        let _form = Object.assign({}, user);
        _form.password = encodeURIComponent('//:,;');
        _form.newpassword = encodeURIComponent('//:,;');
        this.userForm = _form;
      },
      handleClick() {

      },
      saveUser() {
        let params = {
          id: this.userForm?.id,
          name: this.userForm.name,
          password: this.userForm.password === encodeURIComponent('//:,;') ? undefined : this.userForm.password,
          email: this.userForm.email,
        };
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            if (this.userForm.id) {
              userService.saveUser(params)
                .then(({body}) => {
                  if (!body?.status_code) {
                    this.$message.success('修改用户信息成功');
                    this.userList();
                    this.dialogUser = false;
                  } else {
                    this.$message.error('修改用户信息失败');
                  }
                }).catch(() => {
                this.$message.error('修改用户信息失败');
              });
            } else {
              this.$refs['userForm'].validate((valid) => {
                if (valid) {
                  userService.addUser(params)
                    .then(({body}) => {
                      if (!body?.status_code) {
                        this.$message.success('新增用户成功');
                        this.userList();
                        this.dialogUser = false;
                      } else {
                        this.$message.error('新增用户失败');
                      }
                    }).catch(() => {
                    this.$message.error('新增用户失败');
                  });
                }
              });
            }
          }
        });
      },
      userList() {
        this.loading = true;
        userService.userList()
          .then(({body}) => {
            if (!body?.status_code) {
              this.data = body.data;
            }
          }).finally(() => {
          this.loading = false;
        })
      },
      valPwd(rule, value, callback) {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.userForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .common-table-header {
    margin: 0 0 25px;
  }
</style>
