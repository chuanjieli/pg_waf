<template>
  <Row>
    <Col span="24">
      <CellGroup @on-click="show(0)">
        <Cell title="添加策略模板">
          <Icon type="ios-add-circle-outline" slot="icon" size="24" />
          <span slot="arrow" />
        </Cell>
      </CellGroup>
      <Table border :columns="columns12" :data="data6">
        <template slot-scope="{ row }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="extend(row)">扩展</Button>
          <Button
            :disabled="!row.modified"
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="show(row)"
          >修改</Button>
          <Button :disabled="!row.modified" type="error" size="small" @click="remove(row)">删除</Button>
        </template>
      </Table>
      <Modal v-model="modalShow" title="策略模板">
        <Form
          ref="form"
          :model="form"
          label-position="right"
          :rules="ruleValidate"
          :label-width="70"
        >
          <FormItem label="模板名称" prop="name">
            <Input type="text" v-model="form.name" placeholder="模板名称"></Input>
          </FormItem>
          <FormItem label="模板描述" prop="describe">
            <Input type="text" v-model="form.describe" placeholder="模板描述"></Input>
          </FormItem>
          <FormItem label="通用模板">
            <i-switch size="small" v-model="form.zero_template" />&nbsp;&nbsp;&nbsp;(适用于所有应用)
            <!-- <Checkbox v-model="form.zero_template">(适用于所有应用)</Checkbox> -->
          </FormItem>
        </Form>

        <Tree :data="data2" show-checkbox check-directly @on-check-change="getSelectedNodes"></Tree>
        <div slot="footer">
          <Button type="default" @click="cancel">取消</Button>
          <Button type="primary" @click="ok">确定</Button>
        </div>
      </Modal>
    </Col>
  </Row>
</template>
<script>
import Qs from 'qs'
export default {
  data () {
    return {
      modalShow: false,
      value: true,
      flag: false,
      tmpId: 0,
      checkId: [],
      data: [],
      columns12: [
        {
          title: 'ID',
          key: 'id_num'
        },
        {
          title: '模板名称',
          key: 'template_name'
        },
        {
          title: '描述',
          key: 'template_describe'
        },
        {
          title: '创建时间',
          key: 'create_time'
        },
        {
          title: '操作',
          slot: 'action',
          width: 180,
          align: 'center'
        }
      ],
      data6: [],
      form: {
        name: '',
        describe: '',
        zero_template: false
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: '请填写模板名称',
            trigger: 'blur'
          }
        ],
        describe: [
          {
            required: true,
            message: '请填写模板描述',
            trigger: 'blur'
          }
        ]
      },
      data2: [
        // {
        //   title: '策略分类',
        //   expand: true,
        //   children: [
        //     {
        //       title: 'sql',
        //       expand: true,
        //       children: [
        //         {
        //           title: 'leaf 1-1-1'
        //         },
        //         {
        //           title: 'leaf 1-1-2'
        //         }
        //       ]
        //     },
        //     {
        //       title: 'xss',
        //       expand: true,
        //       children: [
        //         {
        //           title: 'leaf 1-2-1'
        //         },
        //         {
        //           title: 'leaf 1-2-1'
        //         }
        //       ]
        //     }
        //   ]
        // }
      ]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.axios
        .get(
          '/template_manage/?template_type=groupTemplate&action=gettemplates'
        )
        .then(res => {
          this.data6 = res.data.data.template_info
        })
        .catch(error => {
          console.log(error)
        })
    },
    request (type, url, data) {
      this.axios({
        method: type,
        url: url,
        data: data
      }).then(res => {
        if (!res.data.code) {
          if (type === 'get') {
            this.modalShow = true
            if (this.tmpId === 0) {
              this.data2 = this.convertData(res.data.data.template_info)
              this.form.zero_template = false
            } else {
              this.form.zero_template =
                res.data.data.template_info.zero_template
              this.data2 = this.convertData(
                res.data.data.template_info.regex_policy_list
              )
            }
            this.form.name = res.data.data.template_info.template_name
            this.form.describe = res.data.data.template_info.template_describe

            this.modalShow = true
          } else if (type === 'post') {
            this.flag = false
            this.modalShow = false
            this.$Message.success('添加成功')
            this.init()
          } else if (type === 'put') {
            this.modalShow = false
            this.$Message.success('修改成功')
            this.init()
          } else if (type === 'delete') {
            this.modalShow = false
            setTimeout(() => {
              this.$Message.success('删除成功')
            }, 2000)
            this.init()
          }
        }
      })
    },
    convertData (data) {
      let obj = {
        title: '策略分类',
        expand: true,
        children: []
      }
      for (let key in data) {
        let objOne = {
          title: key,
          children: []
        }
        for (let i = 0; i < data[key].length; i++) {
          objOne.children.push(data[key][i])
          if (data[key][i].checked) {
            this.checkId.push(data[key][i].policy_id)
          }
        }
        obj.children.push(objOne)
      }
      return [obj]
    },
    getSelectedNodes (checkData) {
      this.checkId = []
      let data = []
      for (let i = 0; i < checkData.length; i++) {
        if (!checkData[i].children) {
          data.push(checkData[i].policy_id)
        }
      }
      this.data = data
    },
    extend (row) {
      this.data = []
      this.checkId = []
      this.flag = true
      this.tmpId = row.template_id
      this.request(
        'get',
        '/template_manage/?template_type=groupTemplate&action=gettemplate&template_id=' +
          row.template_id
      )
    },
    show (row) {
      this.data = []
      this.checkId = []
      this.flag = false
      this.handleReset('form')
      this.form.zero_template = false
      if (row.template_id) {
        this.tmpId = row.template_id
        this.request(
          'get',
          '/template_manage/?template_type=groupTemplate&action=gettemplate&template_id=' +
            row.template_id
        )
      } else {
        this.tmpId = 0
        this.request(
          'get',
          '/template_manage/?template_type=groupTemplate&action=gettemplate&template_id=0'
        )
      }
    },
    remove (row) {
      this.request(
        'delete',
        '/template_manage/?template_type=groupTemplate',
        Qs.stringify({ template_id: row.template_id })
      )
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    ok () {
      this.$refs.form.validate(valid => {
        if (valid) {
          var regexPolicyList = ''
          if (this.data.length === 0 && this.checkId.length > 0) {
            regexPolicyList = this.checkId
          } else if (this.data.length > 0) {
            regexPolicyList = this.data
          } else {
            this.$Message.info('请勾选策略')
            return
          }

          if (this.tmpId === 0 || this.flag) {
            let data = {
              template_name: this.form.name,
              zero_template: this.form.zero_template,
              template_describe: this.form.describe,
              regex_policy_list: regexPolicyList
            }
            let form = JSON.stringify(data)
            let formData = Qs.stringify({ template_data: form })
            this.request(
              'post',
              '/template_manage/?template_type=groupTemplate',
              formData
            )
          } else {
            let data = {
              template_id: this.tmpId,
              template_name: this.form.name,
              zero_template: this.form.zero_template,
              template_describe: this.form.describe,
              regex_policy_list: regexPolicyList
            }
            let form = JSON.stringify(data)
            let formData = Qs.stringify({ template_data: form })
            this.request(
              'put',
              '/template_manage/?template_type=groupTemplate',
              formData
            )
          }
        }
      })
    },
    cancel () {
      this.modalShow = false
      this.$Message.info('Clicked cancel')
    }
  }
}
</script>
