<template>
  <div style="padding: 10px;background: #f8f8f9">
    <Card title="应用详情" shadow style>
      <div>
        <Form
          ref="form"
          :model="form"
          label-position="right"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem label="应用名称" prop="name">
            <Input :disabled="disabled" type="text" v-model="form.name" placeholder="应用名称"></Input>
          </FormItem>
          <div v-for="(item,index) in form.domains" :key="'b'+index">
            <FormItem
              label="域名"
              :prop="'domains.' + index + '.name'"
              :rules="{required: true, message: '请填写域名', trigger: 'blur'}"
            >
              <Input
                :disabled="disabled"
                v-model="form.domains[index].name"
                type="text"
                placeholder="例如 www.hedun.com:80"
              >
                <Icon type="md-add" size="16" slot="append" @click="addDomain" />
                <Icon v-if="delDomain" type="md-close" size="16" slot="append" @click="delDomain1" />
              </Input>
            </FormItem>
            <!-- <FormItem
              label="证书"
              :prop="'domains.' + index + '.appCertificate'"
              :rules="{required: true, message: '请填写证书', trigger: 'blur'}"
            >
              <Input
                :disabled="disabled"
                type="text"
                v-model="form.domains[index].appCertificate"
                placeholder="No Certificate (HTTP Only)"
              ></Input>
            </FormItem>-->
          </div>

          <!-- <FormItem label="获取客户IP途径">
            <Select :disabled="disabled" v-model="form.way">
              <Option value="REMOTE_ADDR">REMOTE_ADDR</Option>
              <Option value="X_Forwareded_For">X_Forwareded_For</Option>
              <Option value="X_REAL_IP">X_REAL_IP</Option>
              <Option value="REAL_IP">REAL_IP</Option>
            </Select>
          </FormItem>-->
          <FormItem label="协议类型">
            <Select :disabled="disabled" v-model="form.internal_scheme">
              <Option value="http">http</Option>
              <Option value="https">https</Option>
            </Select>
          </FormItem>
          <FormItem
            v-for="(item, index) in form.destinations"
            :key="index"
            label="转发地址"
            :prop="'destinations.' + index + '.destination'"
            :rules="{required: true, message: '请填写转发地址', trigger: 'blur'}"
          >
            <Input
              :disabled="disabled"
              v-model="form.destinations[index].destination"
              type="text"
              placeholder="例如 10.10.10.10:80"
            >
              <Icon type="md-add" size="16" slot="append" @click="addSite" />
              <Icon v-if="delSite" type="md-close" size="16" slot="append" @click="delSite1" />
            </Input>
          </FormItem>
          <FormItem label="真实地址" prop="real_destination">
            <Input
              :disabled="disabled"
              type="text"
              v-model="form.real_destination"
              placeholder="例如 10.10.10.10"
            ></Input>
          </FormItem>
          <FormItem label="用户名" prop="username">
            <Input :disabled="disabled" type="text" v-model="form.username" placeholder="请输入用户名"></Input>
          </FormItem>
          <FormItem label="接入时间">
            <Date-picker
              type="date"
              format="yyyy-MM-dd"
              :value="form.web_pro_time||new Date()"
              :editable="false"
              :open="false"
              readonly
              style="width:100%"
            ></Date-picker>
          </FormItem>

          <FormItem label="waf策略">
            <Select :disabled="disabled" v-model="waf">
              <Option
                v-for="item in grouplist"
                :value="item.template_id"
                :key="item.template_id"
              >{{item.template_name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="cc策略">
            <Select :disabled="disabled" v-model="cc">
              <Option
                v-for="item in cclist"
                :value="item.template_id"
                :key="item.template_id"
              >{{item.template_name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="描述">
            <Input :disabled="disabled" type="text" v-model="form.description" placeholder="描述"></Input>
          </FormItem>
          <FormItem>
            <!-- <CheckboxGroup v-model="form.waf_enabled" size="large">
              <Checkbox label="1" :disabled="disabled">将HTTP重定向到HTTPS(301)</Checkbox>
              <br>
              <Checkbox label="2" :disabled="disabled">https启用hsts(添加响应头:严格传输安全)</Checkbox>
              <br>
              <Checkbox label="1" :disabled="disabled">启用WAF(Web应用程序防火墙)</Checkbox>
            </CheckboxGroup>-->
            <Checkbox v-model="waf_enabled" :disabled="disabled">启用WAF策略</Checkbox>
            <br />
            <Checkbox v-model="cc_enabled" :disabled="disabled">启用CC策略</Checkbox>
          </FormItem>
          <FormItem>
            <Button
              class="marginRight"
              v-if="addUser"
              @click="disabled = !disabled"
              type="primary"
            >编辑</Button>
            <Button class="marginRight" :disabled="disabled" @click="handleSubmit" type="primary">保存</Button>
            <Button v-if="addUser" :disabled="disabled" @click="handleSubmit1" type="primary">删除</Button>
          </FormItem>
        </Form>
      </div>
      <Modal v-model="modal" width="300" @on-ok="ok" @on-cancel="cancel">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>删除确认</span>
        </p>
        <p style="text-align:center">确认要删除码？</p>
      </Modal>
    </Card>
  </div>
</template>
<script>
import Qs from 'qs'
export default {
  data () {
    return {
      modal: false,
      delSite: false,
      delDomain: false,
      disabled: true,
      putData: false,
      addUser: true,
      grouplist: [],
      cclist: [],
      waf: '',
      waf_enabled: true,
      cc: '',
      cc_enabled: true,
      form: {
        name: '',
        internal_scheme: 'http',
        // way: 'REAL_IP',
        username: '',
        description: '',
        real_destination: '',
        destinations: [{ destination: '' }],
        web_pro_time: '',
        domains: [{ name: '' }]
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请填写应用名称',
            trigger: 'blur'
          }
        ],
        destination: [
          {
            required: true,
            message: '请填写转发地址',
            trigger: 'blur'
          }
        ],
        real_destination: [
          {
            required: true,
            message: '请填写真实地址',
            trigger: 'blur'
          }
        ],
        username: [
          {
            required: true,
            message: '请填用户名',
            trigger: 'blur'
          }
        ],
        appCertificate: [
          {
            required: true,
            message: '请填写证书',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    if (this.$route.params.id !== '0') {
      let url = '/app_manage/?action=getapp&app_id=' + this.$route.params.id
      this.request('get', url)
    } else {
      let url = '/app_manage/?action=getapp&app_id=0'
      this.request('get', url)
      this.disabled = false
      this.addUser = false
    }
  },
  methods: {
    request (type, url, data) {
      this.axios({
        method: type,
        url: url,
        data: data
      }).then(res => {
        if (!res.data.code) {
          if (type === 'get') {
            if (this.addUser) {
              this.form = res.data.data.app_info.app_conf_info
              this.waf_enabled =
                res.data.data.app_info.group_template_list[0].is_enabled
              this.cc_enabled =
                res.data.data.app_info.cc_template_list[0].is_enabled
            }
            this.cclist = res.data.data.app_info.cc_template_list
            this.grouplist = res.data.data.app_info.group_template_list
            this.waf = res.data.data.app_info.group_template_list[0].template_id
            this.cc = res.data.data.app_info.cc_template_list[0].template_id
          } else if (type === 'delete') {
            if (res.data.data.delete_app) {
              this.$Message.info('删除成功')
              this.$router.push('/application/')
            }
          } else if (type === 'post') {
            if (res.data.data.add_app) {
              this.$Message.info('添加成功')
              this.$router.push('/application/')
            }
          } else {
            if (res.data.data.update_app) {
              this.$Message.info('更新成功')
              this.disabled = true
            }
          }
        }
      })
    },
    addSite () {
      if (this.disabled === false) {
        // this.form.destinations.push({ destination: '' })
        // this.delSite = true
      } else {
        this.$Message.info('请点击编辑')
      }
    },
    delSite1 () {
      if (this.disabled === false) {
        this.form.destinations.pop({ destination: '' })
      } else {
        this.$Message.info('请点击编辑')
      }
    },
    addDomain () {
      if (this.disabled === false) {
        // this.form.domains.push({ appCertificate: '', name: '' })
        // this.delDomain = true
      } else {
        this.$Message.info('请点击编辑')
      }
    },
    delDomain1 () {
      if (this.disabled === false) {
        this.form.domains.pop({ destination: '' })
      } else {
        this.$Message.info('请点击编辑')
      }
    },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let obj = {
            app_conf_info: this.form,
            cc_Template_conf_info: {
              cc_Template_id: this.cc,
              cc_enabled: this.cc_enabled
            },
            group_Template_conf_info: {
              group_Template_id: this.waf,
              waf_enabled: this.waf_enabled
            }
          }
          let form = JSON.stringify(obj)
          let data = Qs.stringify(
            { data: form },
            {
              arrayFormat: 'indices',
              allowDots: true
            }
          )

          if (this.$route.params.id !== '0' && this.putData) {
            this.request('put', '/app_manage/', data)
          } else if (this.$route.params.id === '0') {
            this.request('post', '/app_manage/', data)
          }
        }
      })
    },
    handleSubmit1 () {
      this.modal = true
    },
    ok () {
      let data = Qs.stringify(
        { app_id: this.form.app_id },
        {
          arrayFormat: 'indices',
          allowDots: true
        }
      )
      this.request('delete', '/app_manage/', data)
    },
    cancel () {
      this.$Message.info('Clicked cancel')
    }
  },
  watch: {
    delSite () {
      console.log(this.delSite)
    },
    form: {
      handler (newVal, oldVal) {
        if (!this.disabled) {
          this.putData = true
        }
      },
      deep: true
    },
    cc_enabled: {
      handler (newVal, oldVal) {
        if (!this.disabled) {
          this.putData = true
        }
      }
    },
    waf_enabled: {
      handler (newVal, oldVal) {
        if (!this.disabled) {
          this.putData = true
        }
      }
    },
    cc: {
      handler (newVal, oldVal) {
        if (!this.disabled) {
          this.putData = true
        }
      }
    },
    waf: {
      handler (newVal, oldVal) {
        if (!this.disabled) {
          this.putData = true
        }
      }
    },
    'form.destinations': function () {
      if (this.form.destinations.length === 1) {
        this.delSite = false
      }
    },
    'form.domains': function () {
      if (this.form.domains.length === 1) {
        this.delDomain = false
      }
    }
  }
}
</script>
<style lang="less" scope>
.marginRight {
  margin-right: 10px;
}
</style>
