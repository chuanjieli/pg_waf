<template>
  <Row style="padding: 10px;background: #f8f8f9;height:100%">
    <Col span="24">
      <CellGroup @on-click="show(0)">
        <Cell title="添加CC策略模板">
          <Icon type="ios-add-circle-outline" slot="icon" size="24" />
          <span slot="arrow" />
        </Cell>
      </CellGroup>
      <Table border :columns="columns12" :data="data6" :loading="loading">
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
          inline
          :model="form"
          label-position="right"
          :rules="ruleValidate"
          :label-width="90"
        >
          <FormItem label="模板名称" prop="template_name" style="width: 100%">
            <Input type="text" v-model="form.template_name" placeholder="模板名称"></Input>
          </FormItem>
          <FormItem label="模板描述" prop="template_describe" style="width: 100%">
            <Input type="text" v-model="form.template_describe" placeholder="模板描述"></Input>
          </FormItem>
          <FormItem label="统计周期(秒)">
            <InputNumber
              :min="1"
              v-model="form.cc_policy_dict.interval_seconds"
              style="width: 130px"
            ></InputNumber>
          </FormItem>
          <FormItem label="最大请求个数">
            <InputNumber :min="1" v-model="form.cc_policy_dict.max_count" style="width: 130px"></InputNumber>
          </FormItem>
          <FormItem label="阻隔秒数">
            <InputNumber :min="1" v-model="form.cc_policy_dict.block_seconds" style="width: 130px"></InputNumber>
          </FormItem>

          <FormItem label="防御动作">
            <Select v-model="form.cc_policy_dict.action" style="width: 130px">
              <Option value="100">阻隔并记录</Option>
              <Option value="200">放行并记录</Option>
              <Option value="300">验证码阻隔</Option>
              <Option value="400">放行不记录</Option>
            </Select>
          </FormItem>
          <br />
          <FormItem label="通用模板">
            <i-switch size="small" v-model="form.zero_template" />&nbsp;&nbsp;&nbsp;(适用于所有应用)
            <!-- <Checkbox v-model="form.zero_template">(适用于所有应用)</Checkbox> -->
          </FormItem>
          <FormItem :label-width="90">
            <Checkbox v-model="form.cc_policy_dict.stat_by_url">分别统计不同URL个数</Checkbox>
            <br />
            <Checkbox v-model="form.cc_policy_dict.stat_by_ua">分别统计不同User-Agent个数</Checkbox>
            <br />
            <Checkbox v-model="form.cc_policy_dict.stat_by_cookie">分别统计不同Cookies个数</Checkbox>
            <!-- <br /> -->
            <!-- <Checkbox v-model="form.cc_policy_dict.is_enabled">启用此CC阻止策略</Checkbox> -->
          </FormItem>
        </Form>
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
      loading: true,
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
        template_name: '',
        template_describe: '',
        zero_template: false,
        cc_policy_dict: {
          interval_seconds: 12,
          max_count: 3,
          block_seconds: 23,
          action: '100',
          // is_enabled: false,
          stat_by_url: false,
          stat_by_cookie: false,
          stat_by_ua: false
        }
      },
      ruleValidate: {
        template_name: [
          {
            required: true,
            message: '请填写模板名称',
            trigger: 'blur'
          }
        ],
        template_describe: [
          {
            required: true,
            message: '请填写模板名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.axios
        .get('/template_manage/?template_type=ccTemplate&action=gettemplates')
        .then(res => {
          this.data6 = res.data.data.template_info
          this.loading = false
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
            this.form = res.data.data.template_info
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
            this.$Message.success('删除成功')
            this.init()
          }
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    extend (row) {
      this.flag = true
      this.tmpId = row.template_id
      this.request(
        'get',
        '/template_manage/?template_type=ccTemplate&action=gettemplate&template_id=' +
          row.template_id
      )
    },
    show (row) {
      if (row.template_id) {
        this.tmpId = row.template_id
        this.request(
          'get',
          '/template_manage/?template_type=ccTemplate&action=gettemplate&template_id=' +
            row.template_id
        )
      } else {
        this.tmpId = 0
        this.modalShow = true
        this.form = {
          template_name: '',
          template_describe: '',
          zero_template: false,
          cc_policy_dict: {
            interval_seconds: 12,
            max_count: 3,
            block_seconds: 23,
            action: '100',
            stat_by_url: false,
            stat_by_cookie: false,
            stat_by_ua: false
          }
        }
      }
    },
    remove (row) {
      this.request(
        'delete',
        '/template_manage/?template_type=ccTemplate',
        Qs.stringify({ template_id: row.template_id })
      )
    },
    ok () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.tmpId === 0 || this.flag) {
            let data = this.form
            delete data['template_id']
            let form = JSON.stringify(data)
            let formData = Qs.stringify({ template_data: form })
            this.request(
              'post',
              '/template_manage/?template_type=ccTemplate',
              formData
            )
          } else {
            let form = JSON.stringify(this.form)
            let formData = Qs.stringify({ template_data: form })
            this.request(
              'put',
              '/template_manage/?template_type=ccTemplate',
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
