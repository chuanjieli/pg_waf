<template>
  <div id="report" style="position: relative;">
    <div id="reportpage">
      <Row style="padding:10px" :gutter="16">
        <Col span="24">
          <div
            style="background-color: #1e9fff;padding:20px 0 0 20px;color: #fff;font-size:24px;font-weight:600"
          >防护网站：{{params.domain}}</div>
          <div class="layout-nav">
            <ul>
              <li>
                <span style="color:#34EDED;border-bottom: 2px solid #fff;padding: 10px 0px;">防护报表</span>
              </li>
              <li>
                <router-link
                  tag="span"
                  :to="'/normal/accessreport/'+ params.domain + '/' + params.date"
                >访问报表</router-link>
              </li>
              <!-- <li>防护网站：{{params.domain}}</li> -->
            </ul>
            <ul>
              <li>
                <DatePicker
                  class="color"
                  :type="dateType"
                  :value="params.date || new Date()"
                  :options="options"
                  :editable="editable"
                  style="width: 200px"
                  @on-change="handleChange"
                ></DatePicker>
                <Button type="default" @click="subDate">提交</Button>
              </li>
              <li>
                <Button type="primary" @click="getPdf1">导出报表</Button>
              </li>
            </ul>
          </div>
        </Col>
        <Col span="24">
          <div class="bgCard clear">
            <h2 style="margin-bottom:20px">综合评级</h2>
            <Row style="padding:10px" :gutter="16">
              <Col span="12">
                <Card style="background:rgba(0,0,0,0);color:#FFF">
                  <p style="color:#fff;" slot="title">拦截攻击次数</p>
                  <div style="display:flex;">
                    <Icon type="ios-albums-outline" size="56" style="margin:auto 30px" />
                    <div style="height:81px;min-width:140px">
                      <p>
                        <span class="font">{{head_data.all_attack_logs_num}}</span>
                        <span>次</span>
                      </p>
                      <p>
                        攻击源区域：
                        <span class="font1">{{head_data.all_attack_ip_loc_num}}</span>
                        <span>个</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span="12">
                <Card style="background:rgba(0,0,0,0);color:#FFF">
                  <p style="color:#fff;" slot="title">疑似攻击源</p>
                  <div style="display:flex;">
                    <Icon type="md-wifi" size="56" style="margin:auto 30px" />
                    <div style="height:81px;min-width:140px;line-height:81px">
                      <p>
                        <span class="font">{{head_data.all_attack_ip_num}}</span>
                        <span>个</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row style="padding:10px" :gutter="16">
        <Col span="24">
          <Card :bordered="false">
            <p slot="title">访问/攻击量时间分布</p>
            <p>
              <span>通过展现站点访问量、攻击量、进/出流量变化趋势，了解当{{dateTypeStr}}访客对站点的关注情况，发现当{{dateTypeStr}}黑客高频率攻击时段和判断是否遭受流量攻击</span>
            </p>
            <div id="line1" style="height:500px"></div>
          </Card>
        </Col>
      </Row>
      <Row id="marginTop1" style="padding:10px" :gutter="16">
        <Col span="24">
          <Card :bordered="false">
            <p slot="title">攻击源区域分布</p>
            <Row :gutter="16">
              <Col span="12">
                <div>展现当{{dateTypeStr}}网络攻击源的全球分布，了解全球范围内攻击来源区域，为下一步安全保障提供数据支撑</div>
                <div id="pie1" style="height:450px"></div>
              </Col>
              <Col span="12">
                <div>攻击源区域分布 top10</div>
                <br />
                <Table size="small" border stripe :columns="columns2" :data="data2"></Table>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row id="marginTop" style="padding:10px" :gutter="16">
        <Col span="24">
          <Card :bordered="false">
            <p slot="title">攻击源境内分布</p>
            <Row :gutter="16">
              <Col span="12">
                <div>展现当{{dateTypeStr}}网络攻击源的境内分布，了解境内攻击源区域，为下一步安全保障提供数据支撑</div>
                <div id="map1" style="height:450px"></div>
              </Col>
              <Col span="12">
                <div>境内攻击源区域分布 top10</div>
                <br />
                <Table size="small" border stripe :columns="columns2" :data="data3"></Table>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row style="padding:10px" :gutter="16">
        <Col span="24">
          <Card :bordered="false">
            <p slot="title">攻击源 IP TOP10</p>
            <Row :gutter="16">
              <Col span="12">
                <div id="bar1" style="height:450px"></div>
              </Col>
              <Col span="12">
                <br />
                <Table size="small" border stripe :columns="columns4" :data="data4"></Table>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row style="padding:10px" :gutter="16">
        <Col span="24">
          <Card :bordered="false">
            <p slot="title">攻击类型分布</p>
            <Row :gutter="16">
              <Col span="12">
                <div>展现当{{dateTypeStr}}遭受的网络攻击类型，有助于分析与评估攻击风险所在，为下一步的安全保障提供数据支撑</div>
                <br />
                <div id="pie2" style="height:450px"></div>
              </Col>
              <Col span="12">
                <br />
                <Table size="small" border stripe :columns="columns5" :data="data5"></Table>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row id="marginTop2" style="padding:10px" :gutter="16">
        <Col span="24">
          <Card :bordered="false">
            <p slot="title">扫描警告信息</p>
            <p>
              <span>累计遭受{{data1Len}}个IP的扫描攻击，这些扫描行为均被封禁</span>
            </p>
            <br />
            <Table size="small" stripe :columns="columns1" :data="data1"></Table>
          </Card>
        </Col>
      </Row>
    </div>

    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>
<script>
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
import echarts from 'echarts'
import 'echarts/map/js/china.js'
export default {
  name: 'protectivereport',
  inject: ['reload'],
  data () {
    return {
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      editable: false, // 日期禁止输入
      theme1: 'light',
      spinShow: true,
      head_data: {},
      myChart: '',
      myChart1: '',
      myChart2: '',
      myChart3: '',
      myChart4: '',
      columns1: [
        {
          title: '扫描IP及归属',
          key: 'scan_ip'
        },
        {
          title: '最早封禁时间',
          key: 'early_block_time',
          render: (h, params) => {
            let date = params.row.early_block_time
            date = date.replace('T', ' ')
            return h('div', [h('span', date)])
          }
        },
        {
          title: '封禁累计次数',
          key: 'all_block_num'
        },
        {
          title: '封禁累计时长(分钟)',
          key: 'all_block_time'
          // render: (h, params) => {
          //   let date = params.row.all_block_time

          //   date = date + '时'
          //   // date = date.replace('h', '时')
          //   return h('div', [h('span', date)])
          // }
        }
      ],
      data1: [],
      columns2: [
        {
          title: '区域',
          key: 'attack_ip_loc'
        },
        {
          title: '攻击量',
          key: 'attack_num'
        },
        {
          title: '攻击量占比',
          key: 'attack_percentage'
        }
      ],
      data2: [],
      data1Len: '',
      data3: [],
      columns4: [
        {
          title: 'IP',
          key: 'attack_ip'
        },
        {
          title: '区域',
          key: 'attack_ip_loc'
        },
        {
          title: '攻击量',
          key: 'attack_num'
        },
        {
          title: '攻击量占比',
          key: 'attack_percentage'
        }
      ],
      columns5: [
        {
          title: '攻击类型',
          key: 'attack_type'
        },
        {
          title: '风险等级',
          key: 'hazard_level1',
          render: (h, params) => {
            let hazardLevel = params.row.hazard_level
            switch (hazardLevel) {
              case 'H':
                hazardLevel = '高'
                break
              case 'C':
                hazardLevel = '中'
                break
              case 'L':
                hazardLevel = '低'
                break
              default:
                hazardLevel = '高'
                break
            }
            return h('div', [h('span', hazardLevel)])
          }
        },
        {
          title: '攻击量',
          key: 'attack_num'
        },
        {
          title: '攻击量占比',
          key: 'attack_percentage'
        }
      ],
      data4: [],
      data5: [],
      data6: [],
      pie_data: [],
      pie1_data: [],
      map_data: [],
      bar_datax: [],
      bar_datay: [],
      linex: [],
      line_access_data: [],
      attack_num_list: [],
      attack_datasize_list: [],
      line_outflow_data: [],
      map_num: 0,
      params: {},
      dateType: 'date',
      dateTypeStr: '日',
      date: '',
      title: '报表'
    }
  },
  created () {
    this.getData()
  },
  mounted () {},
  methods: {
    handleChange (date) {
      this.date = date
    },
    subDate () {
      if (this.date) {
        let url =
          '/normal/protectivereport/' + this.params.domain + '/' + this.date
        this.$router.replace({ path: url })
        this.reload()
      }
    },
    getPdf () {
      var title = this.title
      html2Canvas(document.querySelector('#report'), {
        allowTaint: true
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = (contentWidth / 592.28) * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = (592.28 / contentWidth) * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      })
    },
    getPdf1: function () {
      this.spinShow = true
      document.querySelector('#reportpage').style.width = '1280px'
      document.querySelector('#marginTop').style.marginTop = '140px'
      document.querySelector('#marginTop1').style.marginTop = '80px'
      document.querySelector('#marginTop2').style.marginTop = '80px'
      this.myChart.resize()
      this.myChart1.resize()
      this.myChart2.resize()
      this.myChart3.resize()
      this.myChart4.resize()
      setTimeout(() => {
        this.spinShow = false
        var title = this.params.domain + '-防护' + this.dateTypeStr + '报'
        // var dom = document.getElementById('#reportpage')
        var c = document.createElement('canvas')
        c.width = document.querySelector('#reportpage').offsetWidth * 2
        c.height = document.querySelector('#reportpage').offsetHeight * 2
        c.getContext('2d').scale(2, 2)
        var opts = {
          scale: 2,
          canvas: c,
          allowTaint: true,
          logging: true,
          width: document.querySelector('#reportpage').offsetWidth,
          height: document.querySelector('#reportpage').offsetHeight
        }
        html2Canvas(document.querySelector('#reportpage'), opts).then(function (
          canvas
        ) {
          let contentWidth = canvas.width
          let contentHeight = canvas.height
          let pageHeight = (contentWidth / 592.28) * 841.89
          let leftHeight = contentHeight
          let position = 10
          let imgWidth = 575.28
          let imgHeight = (592.28 / contentWidth) * contentHeight
          let pageData = canvas.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')
          if (leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 10, 10, imgWidth, imgHeight)
          } else {
            while (leftHeight > 0) {
              PDF.addImage(pageData, 'JPEG', 10, position, imgWidth, imgHeight)
              leftHeight -= pageHeight
              position -= 841.89
              if (leftHeight > 0) {
                PDF.addPage()
              }
            }
          }
          PDF.save(title + '.pdf')
        })
        document.querySelector('#reportpage').style.width = '100%'
        document.querySelector('#marginTop').style.marginTop = '0px'
        document.querySelector('#marginTop1').style.marginTop = '0px'
        document.querySelector('#marginTop2').style.marginTop = '0px'
        this.myChart.resize()
        this.myChart1.resize()
        this.myChart2.resize()
        this.myChart3.resize()
        this.myChart4.resize()
      }, 300)
    },
    wrapEcharts () {
      this.$nextTick(() => {
        this.myChart = echarts.init(document.getElementById('line1'))
        var option = null
        option = {
          color: ['#F4667C', '#4C9AFB', '#59CB74', '#A08BF0'],
          title: {
            // text: '攻击与访问趋势图',
            // x: 'left',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          legend: {
            data: ['攻击次数', '攻击流量'],
            textStyle: {
              fontSize: 12,
              color: '#ccc'
            },
            right: 'center'
          },
          axisPointer: {
            link: {
              xAxisIndex: 'all'
            }
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 100
            },
            {
              type: 'inside',
              show: true,
              realtime: true,
              start: 30,
              end: 70
            }
          ],
          grid: [
            {
              left: 60,
              right: 60
            }
          ],
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLine: {
                onZero: true
              },
              data: this.linex
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '攻击次数（次）'
            },
            {
              type: 'value',
              name: '攻击流量（kbps）'
            }
          ],
          series: [
            {
              name: '攻击次数',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 9,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              markArea: {
                silent: true,
                label: {
                  normal: {
                    position: ['10%', '50%']
                  }
                }
              },
              data: this.attack_num_list
            },
            {
              name: '攻击流量',
              type: 'line',
              smooth: true,
              symbol: 'rect',
              symbolSize: 9,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                  // color: 'cyan'
                }
              },
              markArea: {
                silent: true,
                label: {
                  normal: {
                    position: ['10%', '50%']
                  }
                }
              },
              yAxisIndex: 1,
              data: this.attack_datasize_list
            }
          ]
        }
        if (option && typeof option === 'object') {
          this.myChart.setOption(option, true)
        }
        this.myChart1 = echarts.init(document.getElementById('pie1'))
        var option1 = null

        option1 = {
          color: [
            '#FF7F50',
            '#FDE159',
            '#2CA9EC',
            '#E75651',
            '#59CB74',
            '#A08BF0',
            '#D0570E',
            '#00C0E9'
          ],
          title: {
            // text: '某站点用户访问来源',
            // subtext: '纯属虚构',
            // x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          // legend: {
          //     orient: 'vertical',
          //     left: 'left',
          //     data: ['中国', '美国', '俄罗斯', '日本', '英国']
          // },
          series: [
            {
              name: '攻击来源',
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              data: this.pie_data,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        if (option1 && typeof option1 === 'object') {
          this.myChart1.setOption(option1, true)
        }
        this.myChart2 = echarts.init(document.getElementById('map1'))
        var option2 = null

        option2 = {
          title: {
            // text: 'iphone销量',
            // subtext: '纯属虚构',
            // left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          visualMap: {
            show: false,
            min: 0,
            max: this.map_num,
            left: 'left',
            color: ['red', '#FF7F50', '#0096F3'],
            top: 'bottom',
            text: ['高', '低'], // 文本，默认为数值文本
            calculable: true
          },
          series: [
            {
              name: '攻击源',
              type: 'map',
              mapType: 'china',
              roam: false,
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#A4B1DE',
                  borderColor: '#F1F5FB',
                  borderWidth: 1
                },
                emphasis: {
                  areaColor: '#fff464',
                  borderWidth: 0
                }
              },
              data: this.map_data
            }
          ]
        }
        if (option2 && typeof option2 === 'object') {
          this.myChart2.setOption(option2, true)
        }
        this.myChart3 = echarts.init(document.getElementById('bar1'))
        var option3 = null
        option3 = {
          tooltip: {
            trigger: 'item'
          },
          grid: {
            left: '1.5%',
            top: 35,
            right: '8%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: {
            show: true,
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: true
            },
            axisTick: {
              show: true
            }
          },
          yAxis: {
            type: 'category',
            data: this.bar_datax.reverse(),
            splitLine: {
              show: false
            },
            axisLine: {
              show: true
            },
            axisTick: {
              show: true
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#000'
              }
            },
            nameTextStyle: {
              fontSize: 12
              // color:'#fff'
            }
          },
          series: [
            {
              type: 'bar',
              data: this.bar_datay.reverse(),
              barWidth: 14,
              barMinHeight: 20,
              itemStyle: {
                emphasis: {
                  barBorderRadius: 7
                },
                normal: {
                  barBorderRadius: 7,
                  color: '#4C9AFB'
                }
              }
            }
          ]
        }
        if (option3 && typeof option3 === 'object') {
          this.myChart3.setOption(option3, true)
        }
        // echarts4
        this.myChart4 = echarts.init(document.getElementById('pie2'))
        var option4 = null

        option4 = {
          color: [
            '#E75651',
            '#FF7F50',
            '#FDE159',
            '#2CA9EC',
            '#59CB74',
            '#A08BF0',
            '#D0570E',
            '#00C0E9'
          ],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          // legend: {
          //     orient: 'vertical',
          //     x: 'left',
          //     data: ['SQL注入攻击', '文件限制', '漏洞防护', '协议违规', '跨站脚本攻击', 'HTTP请求出错', '文件注入攻击',
          //         '目录信息泄露', '命令注入攻击', 'HTTP方法限制'
          //     ]
          // },
          series: [
            {
              name: '攻击类型',
              type: 'pie',
              radius: ['45%', '65%'],

              data: this.pie1_data
            }
          ]
        }
        if (option4 && typeof option4 === 'object') {
          this.myChart4.setOption(option4, true)
        }
        var that = this
        window.addEventListener('resize', function () {
          that.myChart.resize()
          that.myChart1.resize()
          that.myChart2.resize()
          that.myChart3.resize()
          that.myChart4.resize()
        })
      })
    },
    getData () {
      this.params = this.$route.params
      if (this.$route.params.date.length < 8) {
        this.dateType = 'month'
        this.dateTypeStr = '月'
      } else {
        this.dateTypeStr = '日'
      }
      var url =
        '/report_all_info/?access_domain=' +
        this.$route.params.domain +
        '&date_time=' +
        this.$route.params.date
      var that = this
      this.axios
        .get(url)
        .then(function (response) {
          if (!response.data.code) {
            let data = response.data.data
            that.head_data = data.report_head_data
            that.data1Len = data.report_scan_waring.length
            that.data1 = data.report_scan_waring
            let pieData = data.report_world_attack_source_rank
            let mapData = data.report_china_attack_source_rank
            let barData = data.report_attack_ip_rank
            let pie1Data = data.report_attack_type_rank
            let lineData = data.report_view_trend.attack_datasize_list
            that.data2 = pieData
            that.data3 = mapData
            that.data4 = barData
            that.data5 = pie1Data
            for (let i = 0; i < lineData.length; i++) {
              that.linex.push(
                data.report_view_trend.attack_num_list[i].trend_time
              )
              that.attack_num_list.push(
                data.report_view_trend.attack_num_list[i].trend_num
              )
              that.attack_datasize_list.push(
                data.report_view_trend.attack_datasize_list[i]
                  .trend_attackflow_datasize
              )
            }
            for (let i = 0; i < pieData.length; i++) {
              that.pie_data.push({
                name: pieData[i].attack_ip_loc,
                value: pieData[i].attack_num
              })
            }
            for (let i = 0; i < mapData.length; i++) {
              if (mapData[i].attack_num > that.map_num) {
                that.map_num = mapData[i].attack_num
              }
              that.map_data.push({
                name: mapData[i].attack_ip_loc,
                value: mapData[i].attack_num
              })
            }
            for (let i = 0; i < barData.length; i++) {
              that.bar_datax.push(barData[i].attack_ip)
              that.bar_datay.push(barData[i].attack_num)
            }
            for (let i = 0; i < pie1Data.length; i++) {
              that.pie1_data.push({
                name: pie1Data[i].attack_type,
                value: pie1Data[i].attack_num
              })
            }
            that.wrapEcharts()
            that.spinShow = false
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log(to)
    console.log(from)
    next()
  },
  filters: {
    data () {
      return 12
    }
  }
}
</script>

<style scoped>
.router-link-exact-active {
  color: rgb(38, 233, 247) !important;
}

.layout-nav {
  display: flex;
  justify-content: space-between;
  background-color: #1e9fff;
}

.layout-nav li {
  display: inline-block;
  height: 60px;
  line-height: 60px;
  color: #fff;
  margin: 0 20px;
  font-size: 16px;
  cursor: pointer;
}

.bgCard {
  background-color: #1e9fff;
  border-radius: 0;
  color: #fff;
  font-size: 14px;
  padding: 0px 16px 10px;
}

.bgCard p {
  margin: 5px 0;
}

.clear {
  clear: both;
  content: '';
  overflow: hidden;
}
.color {
  color: #515a6e;
}
.font {
  font-size: 30px;
}
</style>
