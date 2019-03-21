<template>
  <div class="ammeter">
    <titlemy :title="title"/>
    <div class="border">
      <div class="top_info">
        <div class="tibox" v-for="item of chaobiao" :key="item.name">
          <p class="tiu">{{item.name}}</p>
          <p class="tinum">{{item.number}}</p>
        </div>
      </div>
      <v-chart :options="option" autoresize class="echart"></v-chart>
      <div class="bottom">
        <div class="title">成功率</div>
        <div class="bottom_box">
          <div class="bb_box">
            <v-chart :options="todayRate" autoresize class="ring"></v-chart>
          </div>
          <div class="bb_box">
            <v-chart :options="mouthRate" autoresize class="ring"></v-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import titlemy from "@/components/common/titlemy";
import api from '@/api/apiAll';
import { create } from 'domain';
import { setInterval } from 'timers';
export default {
  name: "ammeter",
  components: {
    titlemy
  },
  computed: {},
  data() {
    return {
      title: "抄表情况",
      test1: 50,
      test2: 50,
      values: [],
      valuesData: [],
      chaobiao: [
        {
          name: "当天抄表数",
          number: "0"
        },
        {
          name: "本月抄表数",
          number: "0"
        }
      ],
      todayRate: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ["#00DEFF", "#2B3E50"],
        series: [
          {
            name: "当天抄表数",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "10",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [{ value: 50, name: "成功" }, { value: 50, name: "失败" }]
          }
        ]
      },
      mouthRate: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ["#00DEFF", "#2B3E50"],
        series: [
          {
            name: "本月抄表数",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "10",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 50, name: "直接访问" },
              { value: 50, name: "邮件营销" }
            ]
          }
        ]
      },
      option: {
        legend: {
          data: ["111"],
          color: "#fff"
        },
        textStyle: {
          color: "rgba(255, 255, 255, 0.5)"
        },

        xAxis: {
          type: "category",
          boundaryGap: true,
          data: ["Mon", "Tue", "sadfa"],
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "rgba(255, 255, 255, 0.5)",
              width: "1"
            }
          }
        },
        yAxis: {
          type: "value",
          name: "百分比",
          boundaryGap: [0, "100%"],

          axisLabel: {
            formatter: function(val) {
              return `${val}%`;
            }
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "rgba(255, 255, 255, 0.5)",
              width: "1"
            }
          }
        },
        series: [
          {
            name: "111",
            data: [10, 20, 30],
            type: "line",
            areaStyle: {
              color: {
                type: "linear",
                x: 1,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(0, 222, 255, 0)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(0, 222, 255, .39)" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
              // shadowColor: 'rgba(0, 222, 255, 0)'
            },
            color: "rgba(0, 222, 255, 1)"
          }
        ]
      },
      intervalNum: 1
    };
  },
  created() {
    this.today = this.$moment(
      `${this.$moment().format("YYYY-MM-DD")} ${this.timeline}`
    ).format("YYYY-MM-DD HH:mm:ss");
    // console.log(123123123, this.today, this.deviceNumber);
    this.handleApiTodayNumber();
    this.handleApiMouthNumber();
    this.handleApiPercent();
    // this.interval();
  },
  methods: {
    interval() {
      setInterval(() => {
        switch (this.intervalNum % 3) {
          case 1:
            this.handleApiTodayNumber();
            break;
          case 2:
            this.handleApiMouthNumber();
            break;
          case 3:
            this.handleApiPercent();
            break;
        }
        this.intervalNum++;
      }, 500);
    },
    handleApiTodayNumber() {
      api
        .get("/inventory/managedObjects", {
          query: `$filter=(LastDataPoint.ms ge ${this.$moment(
            this.today
          ).format("x")})`,
          withTotalPages: true,
          pageSize: 1
        })
        .then(res => {
          this.chaobiao[0].number = res.data.statistics.totalPages;
          this.todayRate = Object.assign(this.todayRate, {
            series: [
              {
                data: [
                  { value: this.chaobiao[0].number, name: "成功" },
                  {
                    value: this.deviceNumber - this.chaobiao[0].number,
                    name: "失败"
                  }
                ]
              }
            ]
          });
          // console.log("this.todayRate", this.todayRate.series.data);
        });
    },
    handleApiMouthNumber() {
      let lastMouthUnix = this.$moment(
        `${this.$moment()
          .subtract("days", 32)
          .format("YYYY-MM")}-20 ${this.timeline}`
      ).format("x");
      let todayUnix = this.$moment(this.today).format("x");
      // console.log(lastMouthUnix);
      api
        .get("/inventory/managedObjects", {
          query: `$filter=((LastDataPoint.ms ge ${lastMouthUnix}) and (LastDataPoint.ms lt ${todayUnix}))`,
          withTotalPages: true,
          pageSize: 1
        })
        .then(res => {
          this.chaobiao[1].number = res.data.statistics.totalPages;
          this.mouthRate = Object.assign(this.mouthRate, {
            series: [
              {
                data: [
                  { value: this.chaobiao[1].number, name: "成功" },
                  {
                    value: this.deviceNumber - this.chaobiao[1].number,
                    name: "失败"
                  }
                ]
              }
            ]
          });
        });
    },
    handleApiPercent() {
      api
        .get("/inventory/managedObjects", {
          type: "c8y_meterRate"
        })
        .then(res => {
          // console.log("c8ysdafa", res);
          let source = res.data.managedObjects[0].id;
          api
            .get("/measurement/measurements/series", {
              dateFrom: `${this.$moment(this.today)
                .subtract("days", 7)
                .format()}`,
              dateTo: `${this.$moment(this.today).format()}`,
              pageSize: 1440,
              revert: true,
              series: "c8y_meterRate.meterRate",
              source: source
            })
            .then(res => {
              // console.log("chaobiaolv", Object.values(res.data.values));

              Object.keys(res.data.values).map(item => {
                // console.log("sdfas", item);
                this.values.push(this.$moment(item).format("MM-DD"));
              });

              Object.values(res.data.values).map(item => {
                this.valuesData.push(item[0]["max"]);
              });
              // console.log(this.valuesData);
              this.option = Object.assign(this.option, {
                xAxis: {
                  data: this.values
                },
                series: [
                  {
                    data: this.valuesData
                  }
                ]
              });
            });
        });
    }
  }
};
</script>
<style scoped lang='scss'>
.border {
  height: 100%;
  border-radius: 4px;
  border: 2px solid rgba(128, 162, 199, 0.4022);
  position: relative;
  &:before {
    content: "";
    position: absolute;
    width: calc(100% - 28px);
    bottom: -2px;
    top: -2px;
    left: calc(0% + 14px);
    border-bottom: 2px solid rgba(13, 56, 114, 1);
    border-top: 2px solid rgba(13, 56, 114, 1);
    opacity: 0.8020999999999999;
    z-index: -1;
  }
  &:after {
    content: "";
    position: absolute;
    height: calc(100% - 28px);
    left: -2px;
    right: -2px;
    top: calc(0% + 14px);
    border-left: 2px solid rgba(13, 56, 114, 1);
    border-right: 2px solid rgba(13, 56, 114, 1);
    opacity: 0.8020999999999999;
    z-index: -1;
  }
}

.ammeter {
  .top_info {
    width: 100%;
    height: px2rem(60);
    .tibox {
      // border: 1px solid #fff;
      float: left;
      text-align: center;
      padding-top: px2rem(24);
      padding-left: px2rem(80);
      padding-right: px2rem(40);
      &:nth-child(2) {
        padding-left: px2rem(40);
      }
      .tiu {
        font-size: px2rem(10);
        color: #fff;
      }
      .tinum {
        font-size: px2rem(20);
        color: #3895ff;
      }
    }
  }
  .echart {
    width: 100%;
    height: px2rem(170);
  }
  .bottom {
    .title {
      font-size: px2rem(12);
      color: #fff;
      text-align: center;
    }
    .bottom_box {
      .bb_box {
        width: 50%;
        height: px2rem(100);
        float: left;
      }
      .ring {
        width: 100%;
        height: px2rem(100);
      }
    }
  }
}
</style>