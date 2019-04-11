import {loginService} from './login.service';
import {httpHelperProvider} from '@/config/http';
import Config, {baseRoutes} from '@/config/config';
import store from '@/store';

export default {
  data() {
    return {
      setting: {},
      hospitalName: '杭州智团病理管理',
      version: 'v1.0.0',
      rememberPassChecked: false,
      loginForm: {
        username: '',
        password: '',
      },
      mainTitle: Config.mainTitle,
      loginRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
      },
    };
  },
  created() {

  },
  computed: {},
  methods: {
    login(formName) {
      if (!this.$refs[formName]) return;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          loginService.login(this.loginForm)
            .then(({body}) => {
              if (body.status_code === undefined) {
                store.commit('setURL', baseRoutes);
                this.$store.commit('setMenus', []);
                this.$router.replace('/diagnostic/finish');
                const Authorization = `bearer ${body.access_token}`;
                window.sessionStorage.setItem('accessToken',Authorization);
                httpHelperProvider.setHeaders([{
                  'Authorization': Authorization,
                }]);
              } else {
                this.$message.error(body.message || '登录失败');
              }
          }).catch(() => {
            this.$message.error('登录失败');
          })
        } else {
          return false;
        }
      });
    },
  },
};
