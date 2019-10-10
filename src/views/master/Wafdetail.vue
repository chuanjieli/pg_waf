<template>
  <div style="padding: 10px;background: #f8f8f9">
    <Card title="策略详情" shadow style>
      <div>
        <Form
          ref="form"
          :model="form"
          label-position="right"
          :rules="ruleValidate"
          :label-width="100"
        >
          <!-- <FormItem label="应用范围">
            <Input disabled="disabled" type="text" v-model="form.range"></Input>
          </FormItem>-->
          <FormItem label="策略类型" prop="policy_type">
            <!-- <Input
              :disabled="disabled"
              type="text"
              v-model="form.policy_type"
              placeholder="请输入策略类型"
            ></Input>-->
            <Select :disabled="disabled" v-model="form.policy_type">
              <Option value="文件上传">文件上传</Option>
              <Option value="DOS类">DOS类</Option>
              <Option value="文件包含(LFI/RFI)">文件包含(LFI/RFI)</Option>
              <Option value="扫描器">扫描器</Option>
              <Option value="远程代码执行（RCE）">远程代码执行（RCE）</Option>
              <Option value="代码泄露">代码泄露</Option>
              <Option value="sql注入（SQL）">sql注入（SQL）</Option>
              <Option value="跨站脚本（XSS）">跨站脚本（XSS）</Option>
              <Option value="应用类（DRUPAL,WORDPRESS...）">应用类（DRUPAL,WORDPRESS...）</Option>
              <Option value="数据泄露（Sensitive Data Leakage）">数据泄露（Sensitive Data Leakage）</Option>
              <Option value="WebShell">WebShell</Option>
              <Option value="SSRF">SSRF</Option>
              <Option value="CSRF">CSRF</Option>
              <Option value="LDAP Injection">LDAP Injection</Option>
              <Option value="XPATH Injection">XPATH Injection</Option>
              <Option value="不安全的反序列化（Insecure Deserialization）">不安全的反序列化（Insecure Deserialization）</Option>
              <Option value="XML External Entity(XXE)">XML External Entity(XXE)</Option>
              <Option value="路径遍历（Path Traversal）">路径遍历（Path Traversal）</Option>
              <Option value="Broken Authentication">Broken Authentication</Option>
              <Option value="Broken Access Control">Broken Access Control</Option>
              <Option value="Misconfiguration">Misconfiguration</Option>
              <Option value="其他（Other）">其他（Other）</Option>
            </Select>
          </FormItem>
          <FormItem label="策略描述" prop="policy_describe">
            <Input
              :disabled="disabled"
              type="text"
              v-model="form.policy_describe"
              placeholder="请输入策略描述"
            ></Input>
          </FormItem>
          <FormItem label="防御动作">
            <Select :disabled="disabled" v-model="form.action">
              <Option value="100">阻隔并记录</Option>
              <Option value="200">放行并记录</Option>
              <Option value="300">验证码阻隔</Option>
              <Option value="400">放行不记录</Option>
            </Select>
          </FormItem>
          <FormItem label="检查点">
            <Select multiple :disabled="disabled" v-model="form.check_point">
              <Option :value="1">Host</Option>
              <Option :value="2">IPAddress</Option>
              <Option :value="3">Method</Option>
              <Option :value="4">URLPath</Option>
              <Option :value="5">URLQuery</Option>
              <Option :value="6">ValueLength</Option>
              <Option :value="7">GetPostKey</Option>
              <Option :value="8">GetPostValue</Option>
              <Option :value="9">UploadFileExt</Option>
              <Option :value="10">CookieKey</Option>
              <Option :value="11">CookieValue</Option>
              <Option :value="12">UserAgent</Option>
              <Option :value="13">ContentType</Option>
              <Option :value="14">HeaderKey</Option>
              <Option :value="15">HeaderValue</Option>
              <Option :value="16">Proto</Option>
              <Option :value="17">ResponseStatusCode</Option>
              <Option :value="18">ResponseHeaderKey</Option>
              <Option :value="19">ResponseHeaderValue</Option>
              <Option :value="20">ResponseBodyLength</Option>
              <Option :value="21">ResponseBody</Option>
            </Select>
          </FormItem>
          <FormItem label="操作形式">
            <Select :disabled="disabled" v-model="form.operation">
              <Option value="1">Regex_Match</Option>
              <Option value="2">Equals_String_Case_InSensitive</Option>
              <Option value="3">GreaterThan_Integer</Option>
              <Option value="4">Equals_Integer</Option>
            </Select>
          </FormItem>
          <FormItem
            label="正则策略"
            prop="regex_policy"
            :rules="{required: true, message: '正则策略不能为空', trigger: 'blur'}"
          >
            <Input
              :disabled="disabled"
              v-model="form.regex_policy"
              type="text"
              placeholder="请输入正则策略"
            ></Input>
          </FormItem>
          <!-- <div style="backgroung:#999" v-for="(item,index) in form.tactics" :key="'b'+index">
            <FormItem label="检查点">
              <Select :disabled="disabled" v-model="form.tactics[index].check">
                <Option value="URLPath">URLPath</Option>
                <Option value="CookieValue">CookieValue</Option>
              </Select>
            </FormItem>
            <FormItem label="操作形式">
              <Select :disabled="disabled" v-model="form.tactics[index].operation">
                <Option value="1">Regex_Match</Option>
                <Option value="2">Equals_String_Case_InSensitive</Option>
                <Option value="3">GreaterThan_Integer</Option>
                <Option value="4">Equals_Integer</Option>
              </Select>
            </FormItem>
            <FormItem
              label="正则策略"
              :prop="'tactics.' + index + '.reg'"
              :rules="{required: true, message: '请输入正则策略', trigger: 'blur'}"
            >
              <Input
                :disabled="disabled"
                v-model="form.tactics[index].reg"
                type="text"
                placeholder="(Google RE2,忽略大小写以(?i)开头)"
              >
                <Icon type="md-add" size="16" slot="append" @click="addDomain" />
                <Icon v-if="delReg" type="md-close" size="16" slot="append" @click="delReg1" />
              </Input>
            </FormItem>
          </div>-->

          <FormItem>
            <Button
              style="margin-right:10px"
              v-if="!addpolicy"
              @click="disabled = !disabled"
              type="primary"
            >编辑</Button>
            <Button
              style="margin-right:10px"
              :disabled="disabled"
              @click="handleSubmit"
              type="primary"
            >保存</Button>
            <Button :disabled="disabled" @click="handleSubmit1" type="primary">删除</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
    <Card title="正则表达式测试工具" shadow style="margin-top:20px">
      <div>
        <Form
          ref="form1"
          :model="form1"
          label-position="right"
          :rules="ruleValidate"
          :label-width="100"
        >
          <FormItem label="策略模式" prop="re2">
            <Input type="text" v-model="form1.re2" placeholder="(Google RE2正则表达式)"></Input>
          </FormItem>
          <FormItem label="Payload值" prop="payload">
            <Input type="text" v-model="form1.payload" placeholder="需要测试的Payload值"></Input>
          </FormItem>
          <FormItem label="匹配结果">
            <Input readonly type="text" v-model="form1.result"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="regTest">测试</Button>
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
      delReg: false,
      disabled: true,
      addpolicy: false,
      form: {
        policy_describe: '',
        // range: '全部应用',
        policy_type: '',
        action: '100',
        operation: '1',
        check_point: [1],
        regex_policy: ''
      },
      form1: {
        re2: '',
        payload: '',
        result: ''
      },
      ruleValidate: {
        policy_describe: [
          {
            required: true,
            message: '策略描述不能为空',
            trigger: 'blur'
          }
        ],
        policy_type: [
          {
            required: true,
            message: '策略类型不能为空',
            trigger: 'blur'
          }
        ],
        re2: [
          {
            required: true,
            message: '请输入正则表达式',
            trigger: 'blur'
          }
        ],
        payload: [
          {
            required: true,
            message: '请输入Payload值',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    if (this.$route.params.id !== '0') {
      let url =
        '/policy_manage/?action=getpolicy&policy_id=' + this.$route.params.id
      this.request('get', url)
    } else {
      this.disabled = false
      this.addpolicy = true
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
            let data = res.data.data.policy_info
            this.form = data
            this.form1.re2 = data.regex_policy
          } else if (type === 'delete') {
            if (res.data.data.delete_policy) {
              this.$Message.info('删除成功')
              this.$router.push('/waf/')
            }
          } else if (type === 'post') {
            if (res.data.data.add_policy) {
              this.$Message.info('添加成功')
              this.$router.push('/waf/')
            }
          } else {
            if (res.data.data.update_policy) {
              this.$Message.info('更新成功')
              this.disabled = true
            }
          }
        }
      })
    },
    regTest () {
      let data = JSON.stringify({
        action: 'patternValidate',
        patternReg: this.form1.re2.replace(/\\\\/g, '\\'), // 俩个反斜杠变成一个
        patternValue: { data: this.form1.payload }
      })
      // let data = JSON.stringify({
      //   action: 'patternValidate',
      //   patternReg:
      //     "(?:')|(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|(\\b(select|update|union|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute|OgnlContext)\\b)",
      //   patternValue: { data: 'var=-1839\x22 or \x221\x22=\x222' }
      // })
      this.axios
        .post('http://119.23.189.246:8082/janusec-api', data, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        })
        .then(res => {
          if (res.data.result === 'success') {
            this.form1.result = '成功'
          } else {
            this.form1.result = '失败'
          }
          this.$Message.info('匹配结果：' + this.form1.result)
        })
    },
    // addDomain() {
    //   if (this.disabled === false) {
    //     this.form.tactics.push({ check: '', operation: '', reg: '' })
    //     this.delReg = true
    //   } else {
    //     this.$Message.info('请点击编辑')
    //   }
    // },
    // delReg1() {
    //   if (this.disabled === false) {
    //     this.form.tactics.pop()
    //   } else {
    //     this.$Message.info('请点击编辑')
    //   }
    // },
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.addpolicy) {
            let form = JSON.stringify(this.form)
            let data = Qs.stringify({ data: form })
            this.request('post', '/policy_manage/', data)
          } else {
            let form = JSON.stringify(this.form)
            let data = Qs.stringify({ data: form })
            this.request('put', '/policy_manage/', data)
          }
        }
      })
    },
    handleSubmit1 () {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认要删除吗？</p>',
        onOk: () => {
          let data = Qs.stringify(
            { policy_id: this.$route.params.id },
            {
              arrayFormat: 'indices',
              allowDots: true
            }
          )

          this.request('delete', '/policy_manage/', data)
        },
        onCancel: () => {
          this.$Message.info('Clicked cancel')
        }
      })
    }
  },
  watch: {
    // 'form.tactics': function() {
    //   if (this.form.tactics.length === 1) {
    //     this.delReg = false
    //   }
    // }
  }
}
</script>
