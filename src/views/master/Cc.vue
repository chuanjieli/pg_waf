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
      <cctmp :obj="{id:tmpId,show:modalShow,flag:flag}" @showstatus="showstatus"></cctmp>
    </Col>
  </Row>
</template>
<script>
import cctmp from '@/components/Cctemplate.vue'
import Qs from 'qs'
export default {
  data () {
    return {
      modalShow: false,
      loading: true,
      flag: false, // 是否是扩展
      tmpId: 1,
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
      data6: []
    }
  },
  components: {
    cctmp
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
    showstatus (status, fun = false) {
      this.modalShow = status
      if (fun) {
        this.init()
      }
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    extend (row) {
      this.flag = true
      this.tmpId = row.template_id
      this.modalShow = true
    },
    show (row) {
      if (row.template_id) {
        this.tmpId = row.template_id
        this.modalShow = true
      } else {
        this.tmpId = 0
        this.modalShow = true
      }
    },
    remove (row) {
      this.$Modal.confirm({
        title: '确认框',
        content: '<p>确认要删除吗？</p>',
        okText: '确认',
        onOk: () => {
          this.axios({
            method: 'delete',
            url: '/template_manage/?template_type=ccTemplate',
            data: Qs.stringify({ template_id: row.template_id }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded' // 指定消息格式
            }
          }).then(res => {
            if (!res.data.code) {
              setTimeout(() => {
                this.$Message.success('删除成功')
              }, 1500)
              this.init()
            }
          })
        },
        cancelText: '取消'
      })
    }
  }
}
</script>
