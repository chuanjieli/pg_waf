<template>
  <div style="padding: 10px;background: #f8f8f9">
    <Card title="用户管理" :padding="0" shadow style>
      <CellGroup>
        <Cell title="添加用户" to="/master/userdetail/0">
          <Icon type="ios-add-circle-outline" slot="icon" size="24" />
          <span slot="arrow" />
        </Cell>
        <Cell
          v-for="(item,i) in data"
          :title="item.username"
          :key="i"
          :to="'/master/userdetail/'+ item.user_id"
        >
          <Icon type="ios-contact-outline" slot="icon" size="24" />
        </Cell>
        <!-- <Cell title="admin" to="/users/1">
          <Icon type="ios-contact-outline" slot="icon" size="24" />
        </Cell>
        <Cell title="hedun" to="/users/2">
          <Icon type="ios-contact-outline" slot="icon" size="24" />
        </Cell>
        <Cell title="pogou" to="/users/3">
          <Icon type="ios-contact-outline" slot="icon" size="24" />
        </Cell>-->
      </CellGroup>
    </Card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      switchValue: true,
      data: []
    }
  },
  created () {
    this.axios
      .get('/user_manage/?action=getusers')
      .then(res => {
        if (!res.data.code) {
          this.data = res.data.data.user_info
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }
}
</script>
<style scoped>
.node-key {
  padding: 5px 15px;
  font-size: 16px;
}
</style>
