<template>
  <div style="padding: 10px;background: #f8f8f9">
    <Card title="CC日志" :padding="0" shadow>
      <Form ref="form" :model="form" inline label-position="right" style="margin-top:20px">
        <FormItem label="应用" :label-width="50">
          <Select v-model="select" style="width:120px">
            <Option v-for="item in form.list" :value="item" :key="item">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem label="开始时间(00:00:00)" :label-width="120">
          <Date-picker
            type="date"
            format="yyyy-MM-dd"
            :value="st_time||new Date()"
            :options="options"
            :editable="false"
            @on-change="handleChange"
          ></Date-picker>
        </FormItem>
        <FormItem label="结束时间(23:59:59)" :label-width="120">
          <Date-picker
            type="date"
            format="yyyy-MM-dd"
            :value="ed_time||new Date()"
            :options="options"
            :editable="false"
            @on-change="handleChange1"
          ></Date-picker>
        </FormItem>
        <FormItem :label-width="10">
          <Button type="primary" @click="queryLogs">查询CC日志</Button>
        </FormItem>
      </Form>
      <Table
        stripe
        @on-row-click="showdetail"
        :columns="column"
        :loading="loading"
        :data="data"
        style="margin:0 10px;"
      ></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;margin-bottom:20px">
          <Page
            :total="total"
            :current.sync="currentpage"
            :page-size="page_size"
            size="small"
            show-elevator
            show-sizer
            @on-page-size-change="pageNum"
            @on-change="changePage"
          ></Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import Qs from 'qs'
export default {
  name: 'cclogs',
  data () {
    return {
      loading: true,
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      currentpage: 1,
      form: {
        list: []
      },
      total: 100,
      select: '',
      select_true: false,
      st_time: '',
      ed_time: '',
      column: [
        {
          title: 'ID编号',
          key: 'log_id',
          maxWidth: 80
        },
        {
          title: '攻击时间',
          key: 'attack_time',
          width: 150,
          render: (h, params) => {
            let date = params.row.attack_time
            date = date.replace('T', '  ')
            if (date.indexOf('.') > 0) {
              date = date.substring(0, date.indexOf('.'))
            }
            return h('div', [h('span', date)])
          }
        },
        {
          title: '攻击源IP',
          key: 'attack_ip',
          width: 130
        },
        {
          title: '攻击方式',
          key: 'attack_method',
          width: 90
        },
        {
          title: '被攻击主机名',
          key: 'be_attack_host'
        },
        {
          title: 'URL路径',
          key: 'attack_url_path',
          render: (h, params) => {
            let str = params.row.attack_url_path
            if (str.length > 30) {
              str = str.substring(0, 30) + '   ...'
            }
            return h('div', [h('span', str)])
          }
        },
        {
          title: '攻击类型',
          key: 'vulntype',
          maxWidth: 150
        },
        {
          title: '防御动作',
          key: 'action',
          width: 120
        },
        {
          title: '查看详情',
          maxWidth: 85,
          key: 'cont',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    to: 'logsdetail/ccLog/' + params.row.mongdb_id
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      // this.show(params.index);
                    }
                  }
                },
                '查看'
              )
            ])
          }
        }
      ],
      data: [],
      page_num: 1,
      page_size: 10,
      new_log: 0
    }
  },
  created () {
    this.request()
  },
  methods: {
    handleChange (date) {
      if (date < this.ed_time || this.ed_time === '') {
        this.st_time = date
      } else {
        this.$Message.info('日期选择不对')
      }
    },
    handleChange1 (date) {
      if (date >= this.st_time && this.st_time) {
        this.ed_time = date
      } else {
        this.$Message.info('日期选择不对')
        this.ed_time = new Date()
      }
    },
    showdetail (params) {
      //   let url = 'logsdetail/ccLog/' + params.mongdb_id
      //   this.$router.push(url)
    },
    queryLogs () {
      this.select_true = true
      this.loading = true
      this.currentpage = 1
      this.page_num = 1
      this.page_size = 10
      this.new_log = 0
      this.request()
    },
    request () {
      let data = Qs.stringify({
        log_type: 'ccLog',
        appname: this.select,
        st_time: this.st_time,
        ed_time: this.ed_time,
        page_num: this.page_num,
        page_size: this.page_size,
        new_log: this.new_log
      })
      this.axios
        .post('/user_logs/', data)
        .then(res => {
          this.loading = false
          if (!res.data.code) {
            let data = res.data.data
            this.total = data.all_logs_num
            this.form.list = data.user_pro_appname
            this.data = data.user_web_logs_list
            if (!this.select_true) {
              this.select = this.form.list[0]
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    changePage (num) {
      this.new_log = 1
      this.loading = true
      this.page_num = num
      this.request()
    },
    pageNum (num) {
      this.new_log = 1
      this.loading = true
      this.page_size = num
      this.request()
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path.indexOf('logsdetail') > -1) {
      this.$store.commit('setKeepAlive', ['cclogs'])
      this.$route.meta.name = 'cclogs'
    } else {
      this.$store.commit('setKeepAlive', [])
    }
    next()
  },
  watch: {}
}
</script>
