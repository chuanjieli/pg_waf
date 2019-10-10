<template>
  <div>
    <Row style="padding:10px" :gutter="16">
      <Col span="24">
        <Card :bordered="false">
          <p slot="title">日志详情</p>

          <Row style="padding:10px" :gutter="16">
            <Col span="12">
              <Card>
                <h4>基本信息</h4>
                <ul>
                  <li v-for="(item,i) in basic_data" :key="i">{{i + ' : ' + item }}</li>
                  <!-- <li>攻击源IP地址 : 106.13.46.67</li>
                  <li>攻击方式 : GET</li>
                  <li>被攻击网站 : www.hedun.top : 80</li>
                  <li>attack_url_path : /index.html</li>
                  <li>attack_url_query : id=1 and 1=1</li>
                  <li>attack_content_type : text/html; charset=utf-8</li>
                  <li>attack_user_agent : Mozilla/5.0 (Windows NT 6.1;)</li>
                  <li>Cookie : [xxx,xxx,xxx]</li>
                  <li>raw_request : xxxxxxxx</li>
                  <li>防御动作 : Block</li>
                  <li>扫描包大小 : 128</li>-->
                </ul>
              </Card>
            </Col>
            <Col span="12">
              <Card>
                <div v-if="scan_block">
                  <h4>扫描相关信息</h4>
                  <ul>
                    <li v-for="(item,i) in scan_info" :key="item">{{i + ' : ' + item }}</li>
                    <!-- <li>扫描工具 : nmap</li>
                    <li>扫描位置 : xxx</li>
                    <li>扫描工具描述 : xxxxxxxxx</li>
                    <li>扫描详情 : xxxxxx</li>-->
                  </ul>
                </div>
                <div v-if="attack_block">
                  <h4>攻击详情</h4>
                  <ul>
                    <li v-for="(item,i) in attack_info" :key="item">{{i + ' : ' + item }}</li>
                  </ul>
                </div>
                <div v-if="dto_block">
                  <h4>配置信息</h4>
                  <ul>
                    <li v-for="(item,i) in confInfoDto" :key="item">{{i + ' : ' + item }}</li>
                  </ul>
                </div>
                <div v-if="conf_block">
                  <h4>配置信息</h4>
                  <ul>
                    <li v-for="(item,i) in conf_info" :key="item">{{i + ' : ' + item }}</li>
                    <!-- <li>应用名称 : Hedun</li>
                    <li>协议类型 : http</li>
                    <li>防护域名 : www.hedun.top:80</li>
                    <li>检查点 : url_path</li>
                    <li>描述 : xxx</li>
                    <li>用户名 : hedun</li>-->
                  </ul>
                </div>
              </Card>
            </Col>
          </Row>

          <Button slot="extra" type="primary" @click="$router.go(-1)" size="small">&nbsp;返回&nbsp;</Button>
        </Card>
      </Col>
    </Row>
    <!-- <Spin size="large" fix v-if="spinShow"></Spin> -->
  </div>
</template>
<script>
export default {
  name: 'logsdetail',
  data () {
    return {
      msg: 'skdfjdk',
      data: {
        attack_time: '2019-05-05 02:34:54',
        attack_ip: '106.13.46.67',
        attack_method: 'GET',
        be_attack_host: 'www.hedun.top',
        attack_url_path: '/index.html',
        attack_url_query: 'id=1 and 1=1',
        attack_content_type: 'text/html; charset=utf-8;',
        attack_user_agent: 'Mozilla/5.0 (Windows NT 6.1;)',
        attack_cookies: '[xxx,xxx,xxx]',
        attack_raw_request: 'xxxxxxxx',
        action: 'Block',
        attack_flowsize: 128,
        attack_info: {
          vulntype: 'SQL Injection',
          description: 'SQL Injection with Search',
          attack_detail: 'xxx'
        },
        conf_info: {
          appname: 'Hedun',
          protocol: 'http',
          domain: 'www.hedun.top',
          check_point: 'url_path',
          description: 'hedun',
          username: 'xxx'
        },
        scan_info: {
          scan_tool: 'nmap',
          scan_positon: 'xxx',
          description: 'xxxxxxxxx',
          scan_detail: 'xxxxxx'
        }
      },
      basic_data: {},
      attack_info: {},
      attack_block: false,
      scan_info: {},
      scan_block: false,
      conf_info: {},
      conf_block: false,
      confInfoDto: {},
      dto_block: false,
      params: this.$route.params
    }
  },
  created () {
    this.request()
  },
  methods: {
    request () {
      this.axios
        .get(
          '/user_logs/?log_type=' +
            this.params.type +
            '&log_id=' +
            this.params.id
        )
        .then(res => {
          console.log(res.data)
          if (!res.data.code) {
            let data = res.data
            this.data = data
            this.dataMerge()
          }
        })
    },
    dataMerge () {
      var bible = {
        attack_time: '攻击时间',
        attack_ip: '攻击源IP地址',
        attack_method: '攻击方式',
        be_attack_host: '被攻击网站',
        attack_url_path: '攻击URL路径',
        attack_url_query: '攻击URL请求',
        attack_content_type: 'Content-type',
        attack_user_agent: 'User-agent',
        attack_cookies: 'Cookie',
        attack_raw_request: 'Raw_request',
        action: '防御动作',
        attack_flowsize: '攻击包大小',
        access_time: '访问时间',
        access_ip: '客户端源IP地址',
        access_method: '访问方式',
        access_host: '访问网站',
        access_url_path: '访问URL路径',
        access_url_query: '访问URL请求',
        access_content_type: 'Content-type',
        access_user_agent: 'User-agent',
        access_cookies: 'Cookie',
        access_raw_request: 'Raw_request',
        response_time: '响应时间',
        response_status: '响应状态',
        inflow_datasize: '请求包大小',
        outflow_datasize: '响应包大小',
        _class: '_class',
        attack_info: {
          vulntype: '攻击类型',
          description: '攻击类型的描述',
          attack_detail: '攻击详情'
        },
        scan_info: {
          scan_tool: '扫描工具',
          scan_position: '扫描位置',
          description: '扫描工具描述',
          scan_detail: '扫描详情'
        },
        conf_info: {
          inflow_datasize: 'inflow_datasize',
          outflow_datasize: 'outflow_datasize',
          response_status: 'response_status',
          response_time: 'response_time'
        },
        confInfoDto: {
          appname: '应用名称',
          protocol: '协议类型',
          domain: '防护域名',
          description: '描述',
          check_point: '检查点',
          username: '用户名'
        }
      }
      for (let key in this.data) {
        if (key === 'attack_info') {
          var attackInfo = {}
          for (let i in this.data[key]) {
            attackInfo[bible.attack_info[i]] = this.data.attack_info[i]
          }
          this.attack_block = true
          this.attack_info = attackInfo
        } else if (key === 'scan_info') {
          var scanInfo = {}
          for (let i in this.data[key]) {
            scanInfo[bible.scan_info[i]] = this.data.scan_info[i]
          }
          this.scan_block = true
          this.scan_info = scanInfo
        } else if (key === 'conf_info') {
          var confInfo = {}
          for (let i in this.data[key]) {
            confInfo[bible.conf_info[i]] = this.data.conf_info[i]
          }
          this.conf_block = true
          this.conf_info = confInfo
        } else if (key === 'confInfoDto') {
          var confInfoDto = {}
          for (let i in this.data[key]) {
            confInfoDto[bible.confInfoDto[i]] = this.data.confInfoDto[i]
          }
          this.dto_block = true
          this.confInfoDto = confInfoDto
        } else {
          this.basic_data[bible[key]] = this.data[key]
        }
      }
    }
  }
}
</script>
<style scoped>
ul,
li {
  list-style: none;
  margin: 10px;
  word-wrap: break-word;
  word-break: normal;
}
</style>
