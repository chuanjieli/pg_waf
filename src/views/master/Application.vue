<template>
  <div style="padding: 10px;background: #f8f8f9;position: relative;">
    <Card title="应用管理" :padding="0" shadow style>
      <CellGroup>
        <Cell title="添加应用程序" to="/master/appdetail/0">
          <Icon type="ios-add-circle-outline" slot="icon" size="24" />
          <span slot="arrow" />
        </Cell>
      </CellGroup>

      <Collapse accordion>
        <Panel :name="i" v-for="(items,i) in data " :key="i">
          {{i}}
          <CellGroup slot="content">
            <Cell
              v-for="(item,i) in items"
              :title="item.app_name"
              :to="'/master/appdetail/'+ item.app_id"
              :key="i"
            >
              <span slot="label" v-for="(item1,j) in item.domains" :key="j">{{item1.name}}</span>
              <Icon type="md-apps" slot="icon" size="24" />
              <Tooltip content="应用详情" placement="left" slot="arrow">
                <Icon type="ios-ionic-outline" size="24" />
              </Tooltip>
            </Cell>
          </CellGroup>
        </Panel>

        <!-- <Panel name="1">
          广西网安
          <CellGroup slot="content">
            <Cell
              v-for="item,i in data"
              :title="item.app_name"
              :to="'/application/'+ item.app_id"
              :key="i"
            >
              <span slot="label" v-for="item1,j in item.domains" :key="j">{{item1.name}}</span>
              <Icon type="md-apps" slot="icon" size="24" />
              <Tooltip content="应用详情" placement="left" slot="arrow">
                <Icon type="ios-ionic-outline" size="24" />
              </Tooltip>
            </Cell>
          </CellGroup>
        </Panel>
        <Panel name="2">
          河北人社
          <CellGroup slot="content">
            <Cell
              v-for="item,i in data"
              :title="item.app_name"
              :to="'/application/'+ item.app_id"
              :key="i"
            >
              <span slot="label" v-for="item1,j in item.domains" :key="j">{{item1.name}}</span>
              <Icon type="md-apps" slot="icon" size="24" />
              <Tooltip content="应用详情" placement="left" slot="arrow">
                <Icon type="ios-ionic-outline" size="24" />
              </Tooltip>
            </Cell>
          </CellGroup>
        </Panel>
        <Panel name="3">
          移动
          <CellGroup slot="content">
            <Cell
              v-for="item,i in data"
              :title="item.app_name"
              :to="'/application/'+ item.app_id"
              :key="i"
            >
              <span slot="label" v-for="item1,j in item.domains" :key="j">{{item1.name}}</span>
              <Icon type="md-apps" slot="icon" size="24" />
              <Tooltip content="应用详情" placement="left" slot="arrow">
                <Icon type="ios-ionic-outline" size="24" />
              </Tooltip>
            </Cell>
          </CellGroup>
        </Panel>-->
      </Collapse>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
export default {
  data () {
    return {
      switchValue: true,
      val: '1',
      spinShow: false,
      data: [],
      data1: []
    }
  },
  created () {
    this.axios
      .get('/app_manage/?action=getapps')
      .then(res => {
        if (!res.data.code) {
          this.spinShow = false
          this.data = res.data.data.app_info
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>
