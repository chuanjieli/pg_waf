<template>
  <div style="padding: 10px;background: #f8f8f9;height:100%">
    <Tabs value="name1" style="margin-bottom:60px">
      <TabPane label="漏洞规则" name="name1">
        <!-- <Table stripe @on-row-click="showdetail" :columns="columns2" :data="data2"></Table> -->
        <CellGroup>
          <Cell title="添加策略" to="/master/wafdetail/0">
            <Icon type="ios-add-circle-outline" slot="icon" size="24" />
            <span slot="arrow" />
          </Cell>
        </CellGroup>
        <Collapse accordion @on-change="open">
          <Panel :name="i" v-for="(items,i) in data " :key="i">
            {{i}}
            <CellGroup slot="content">
              <Table
                stripe
                @on-row-click="showdetail"
                :columns="columns2"
                :data="items"
                :loading="loading"
                :key="i"
              ></Table>
            </CellGroup>
          </Panel>
        </Collapse>
      </TabPane>
      <!-- <TabPane label="CC策略" name="name2">
        <cc></cc>
      </TabPane>-->
      <TabPane label="策略模板" name="name3">
        <policyTmp></policyTmp>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
// import cc from './cc.vue'
import policyTmp from './Policytmp.vue'
export default {
  data () {
    return {
      loading: true,
      columns2: [
        {
          title: 'ID',
          key: 'policy_num'
        },
        {
          title: '描述',
          key: 'policy_describe'
        },
        {
          title: '防御动作',
          key: 'action',
          render (h, params) {
            let obj = {
              100: '阻隔并记录',
              200: '放行并记录',
              300: '验证码阻隔',
              400: '放行不记录'
            }
            return h('span', obj[params.row.action])
          }
        }
      ],
      data: {}
    }
  },
  created () {
    this.axios
      .get('/policy_manage/?action=getpolicys')
      .then(res => {
        if (!res.data.code) {
          this.data = res.data.data.policy_info
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    open (num) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 200)
    },
    showdetail (params) {
      let url = '/master/wafdetail/' + params.policy_id
      this.$router.push(url)
    }
  },
  components: {
    policyTmp
  }
}
</script>
