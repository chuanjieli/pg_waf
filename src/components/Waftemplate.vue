<template>
  <div>
    <Modal v-model="modalShow" title="策略模板">
      <Form ref="form" :model="form" label-position="right" :rules="ruleValidate" :label-width="70">
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
  </div>
</template>
<script>
export default {}
</script>
