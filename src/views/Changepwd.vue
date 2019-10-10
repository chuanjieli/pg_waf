<template>
  <div>
    <Card>
      <p slot="title">修改密码</p>
      <Row>
        <Col span="9">
          <Form
            ref="form"
            :model="form"
            label-position="right"
            :rules="ruleValidate"
            :label-width="100"
          >
            <FormItem label="原始密码" prop="oldpwd">
              <Input type="password" v-model="form.oldpwd" placeholder="请输入原始密码"></Input>
            </FormItem>
            <FormItem label="新密码" prop="newpwd">
              <Input type="password" v-model="form.newpwd" :maxlength="15" placeholder="密码(6-15位)"></Input>
            </FormItem>
            <FormItem label="确认新密码" prop="pwdCheck">
              <Input type="password" v-model="form.pwdCheck" placeholder="确认密码"></Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" style="margin-right:20px">保存</Button>
              <Button @click="handleSubmit1" type="primary">取消</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import Qs from 'qs'
export default {
  data () {
    return {
      user: '',
      form: {
        oldpwd: '',
        newpwd: '',
        pwdCheck: ''
      },
      ruleValidate: {
        oldpwd: [
          {
            required: true,
            message: '请输入原始密码',
            trigger: 'blur'
          }
        ],
        newpwd: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let reg = /^[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,15}$/
              if (value === '') {
                callback(new Error('请输入密码'))
              } else if (value === this.form.oldpwd) {
                callback(new Error('新密码不能与原密码相同'))
              } else if (new RegExp(reg).test(value) === false) {
                callback(new Error('密码无效'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        pwdCheck: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('确认密码不能为空'))
              } else if (this.form.newpwd !== value) {
                callback(new Error('新密码和确认密码不相同'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.user = localStorage.getItem('user').replace(/"([^"]*)"/g, '$1')
  },
  methods: {
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let form = JSON.stringify({
            change_user: 0,
            username: this.user,
            oldpwd: this.form.oldpwd,
            newpwd: this.form.newpwd
          })
          let data = Qs.stringify({ data: form })
          this.axios.put('/user_manage/', data).then(res => {
            if (!res.data.code) {
              this.$Message.info('修改成功')
              this.form.oldpwd = ''
              this.form.newpwd = ''
              this.form.pwdCheck = ''
              this.$router.push('/login')
            }
          })
        }
      })
    },
    handleSubmit1 () {
      this.$router.go(-1)
    }
  }
}
</script>
