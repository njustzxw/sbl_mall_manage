<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login" @keydown.enter="handleLogin">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
				<FormItem prop="userName">
					<Input v-model="form.loginname" placeholder="请输入用户名" >
						<span slot="prepend">
							<Icon :size="16" type="person"></Icon>
						</span>
					</Input>
				</FormItem>
				<FormItem prop="password">
					<Input type="password" v-model="form.pass" placeholder="请输入密码">
						<span slot="prepend">
							<Icon :size="14" type="locked"></Icon>
						</span>
					</Input>
				</FormItem>
				<FormItem>
					<Button @click="handleSubmit" type="primary" long>登录</Button>
				</FormItem>
			</Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { mapActions } from "vuex";
import { fetchGet, fetchPost } from "@/api/ajax";
import { login } from "@/api/index.js";
export default {
  name: "login",
  data() {
    return {
      form: {
        loginname: "",
        pass: ""
      },
      rules: {
        loginname: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        pass: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions(["handleLogin"]),
    handleSubmit() {
      var params = {
        username: this.form.loginname,
        password: this.form.pass
      };
      login(params).then(res => {
        console.log(res);
        if (res.status) {
          //登录失败
          this.$Message.error(res.msg);
        } else {
          //登陆成功
          Cookies.set("userlogfag", true);
          this.$Message.success("登陆成功");
          this.$store.commit("saveuserInfo", JSON.stringify(res.data));
          this.$router.push({ path: "/home" });
        }
      });
    }
  }
};
</script>

<style>
</style>
