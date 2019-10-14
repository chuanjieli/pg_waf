<template>
  <div style="padding: 10px;background: #f8f8f9">
    <Card title="用户详情" shadow style>
      <div>
        <Form
          ref="form"
          :model="form"
          label-position="right"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem label="用户名" prop="username">
            <Input :disabled="!addUser" type="text" v-model="form.username" placeholder="用户名"></Input>
          </FormItem>
          <FormItem>
            <RadioGroup v-model="form.user_type">
              <Radio label="2" :disabled="disabled">普通用户</Radio>
              <br />
              <Radio label="1" :disabled="disabled">配置管理员</Radio>
              <br />
              <Radio label="0" :disabled="disabled">超级管理员</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem>
            <Button
              style="margin-right:10px"
              v-if="!addUser"
              @click="disabled = !disabled"
              type="primary"
            >修改权限</Button>
            <Button style="margin-right:10px" v-if="!addUser" @click="changePwd" type="primary">重置密码</Button>
            <Button
              style="margin-right:10px"
              :disabled="disabled"
              @click="saveUser"
              type="primary"
            >保存</Button>
            <Button @click="delUser" type="primary">删除</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>
<script>
import Qs from 'qs'
export default {
  data () {
    return {
      disabled: true,
      addUser: false,
      form: {
        username: '',
        user_type: '2'
      },
      ruleValidate: {
        username: [
          {
            required: true,
            message: '请填写用户名',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    if (this.$route.params.id !== '0') {
      let url = '/user_manage/?action=getuser&user_id=' + this.$route.params.id
      this.request('get', url)
    } else {
      this.disabled = false
      this.addUser = true
    }
  },
  methods: {
    request (type, url, data) {
      this.axios({
        method: type,
        url: url,
        data: data
      }).then(res => {
        this.form.user_type = this.form.user_type.toString()
        if (!res.data.code) {
          if (type === 'get') {
            let data = res.data.data.user_info
            if (!data.user_type && data.user_type !== 0) {
              data.user_type = '2'
            } else {
              data.user_type = data.user_type.toString()
            }

            this.form = data
          } else if (type === 'delete') {
            if (res.data.data.delete_user) {
              this.$Message.info('删除成功')
              this.$router.push('/master/users')
            }
          } else if (type === 'post') {
            if (res.data.data.add_user) {
              this.$Message.info('添加成功')
              this.$router.push('/master/users')
            }
          } else {
            if (res.data.data.update_user) {
              this.$Message.info('更新成功')
              this.disabled = true
            } else {
              this.$Message.info('重置密码成功')
            }
          }
        }
      })
    },
    changeUser () {},
    changePwd () {
      this.$Modal.confirm({
        title: '重置密码',
        content: '<p>确认要重置密码吗？</p>',
        onOk: () => {
          let form = JSON.stringify({
            user_id: this.form.user_id,
            user_type: Number(this.form.user_type),
            change_user: 1
          })
          let data = Qs.stringify({ data: form })
          this.request('put', '/user_manage/', data)
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    },
    saveUser () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.addUser) {
            let form = JSON.stringify({
              username: this.form.username,
              user_type: Number(this.form.user_type)
            })
            let data = Qs.stringify({ data: form })
            this.request('post', '/user_manage/', data)
          } else {
            let form = JSON.stringify({
              change_user: 2,
              user_id: this.$route.params.id,
              user_type: Number(this.form.user_type)
            })
            let data = Qs.stringify({ data: form })
            this.request('put', '/user_manage/', data)
          }
        }
      })
    },
    delUser () {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认要删除吗？</p>',
        onOk: () => {
          let data = Qs.stringify(
            { user_id: this.form.user_id },
            {
              arrayFormat: 'indices',
              allowDots: true
            }
          )

          this.request('delete', '/user_manage/', data)
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    }
  }
}
</script>
