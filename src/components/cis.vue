<template>
  <div class="cis">
    <titlemy :title="title"/>
    <div class="border">
      <div class="cis_box" v-for="(item,index) of cisArr" :key="item.img">
        <img :src="item.img" alt>
        <div class="info" v-if="index === 0">
          <span>已同步：{{item.hasComing}}</span>
          <span>未同步：{{item.unComing}}</span>
        </div>
        <div class="info" v-else>
          <span>上月同步：{{item.lastMouthSuccess}}</span>
          <span>上月同步失败：{{item.lastMouthFail}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import titlemy from "@/components/common/titlemy";
import api from "@/api/apiAll";
export default {
  name: "cis",
  components: {
    titlemy
  },
  data() {
    return {
      title: "CIS数据同步",
      cisArr: [
        {
          img: require("@/assets/cis1.svg"),
          hasComing: "0",
          unComing: "0"
        },
        {
          img: require("@/assets/cis2.svg"),
          lastMouthSuccess: "0",
          lastMouthFail: "0"
        }
      ],
      intervalNum: 1
    };
  },
  computed: {},
  created() {
    this.today = this.$moment(
      `${this.$moment().format("YYYY-MM-DD")} ${this.timeline}`
    ).format("YYYY-MM-DD HH:mm:ss");
    // console.log(
      //this.$moment()
      //  .endOf("month")
      //  .format("YYYY-MM-DD") + " 23:59:59",
      //this.$moment()
      //  .startOf("month")
      //  .format("YYYY-MM-DD HH:mm:ss")
    //);
    this.handleApiCis();
    this.handleApiLastCis();
  },
  methods: {
    interval() {
      setInterval(() => {
        switch (this.intervalNum % 2) {
          case 1:
            this.handleApiCis();
            break;
          case 2:
            this.handleApiLastCis();
            break;
        }
        this.intervalNum++;
      }, 500);
    },
    lastMonth(month, year) {
      // let month = this.$moment().format('MM'),
      // year = this.$moment().format('YYYY');
      return parseInt(month) === 12
        ? `${year++}-01-20`
        : `${year}-${parseInt(month) - 1}-20`;
    },
    handleApiCis() {
      api
        .get("/inventory/managedObjects", {
          pageSize: 1,
          query: `$filter=((type eq 'c8y_meter') and (has(CIS.SP_ID)))`,
          withTotalPages: true
        })
        .then(res => {
          // console.log("已同步", res);
          this.cisArr[0].hasComing = res.data.statistics.totalPages;
          api
            .get("/inventory/managedObjects", {
              pageSize: 1,
              query: `$filter=((type eq 'c8y_meter') and (not(has(CIS.SP_ID))))`,
              withTotalPages: true
            })
            .then(res => {
              // console.log("未同步", res);
              this.cisArr[0].unComing = res.data.statistics.totalPages;
            });
        });
    },
    handleApiLastCis() {
      // console.log(
        //"sadfdasfa",
        //this.$moment(this.today).format("DD"),
        //this.lastMonth(
        //  this.$moment().format("MM"),
        //  this.$moment().format("YYYY")
        //)
      //);
      let day = this.$moment(this.today).format("DD"),
        now,
        last;

      if (day > 20) {
        // this.$moment().endOf('month').format("YYYY-MM-DD")+" 23:59:59"
        now =
          this.$moment()
            .endOf("month")
            .format("YYYY-MM-DD") + " 23:59:59";
        now = this.$moment(now).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        last = this.$moment()
          .startOf("month")
          .format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      } else {
        let temp_month = this.$moment(
            `${this.lastMonth(
              this.$moment().format("MM"),
              this.$moment().format("YYYY")
            )} ${this.timeline}`
          ).format("MM"),
          temp_year = this.$moment(
            `${this.lastMonth(
              this.$moment().format("MM"),
              this.$moment().format("YYYY")
            )} ${this.timeline}`
          ).format("YYYY");
        last = this.$moment(
          `${this.lastMonth(temp_month, temp_year)} ${this.timeline}`
        ).format();
        now =
          this.lastMonth(
            this.$moment().format("MM"),
            this.$moment().format("YYYY")
          ) + " 00:00:00";
        now = this.$moment(now).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
      }
      // console.log("now is", now);

      api
        .get("/measurement/measurements", {
          dateFrom: last,
          dateTo: now,
          fragmentType: `success`,
          pageSize: 1,
          revert: true,
          type: `c8y_Acc_finish`,
          withTotalPages: true
        })
        .then(res => {
          // console.log("上月同步成功", res);
          this.cisArr[1].lastMouthSuccess = res.data.statistics.totalPages;
          api
            .get("/measurement/measurements", {
              dateFrom: last,
              dateTo: now,
              fragmentType: `failed`,
              pageSize: 1,
              revert: true,
              type: `c8y_Acc_finish`,
              withTotalPages: true
            })
            .then(res => {
              // console.log("上月同步失败", res);
              this.cisArr[2].lastMouthFail = res.data.statistics.totalPages;
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
.cis {
  .cis_box {
    width: px2rem(246);
    height: px2rem(100);
    margin: 0 auto;
    text-align: center;
    margin-bottom: px2rem(30);
    img {
      width: px2rem(200);
      height: px2rem(56);
      // display: block;
      margin-bottom: px2rem(12);
    }
    .info {
      color: #fff;
      font-size: px2rem(12);
      line-height: px2rem(17);
    }
    span {
      &:nth-child(1) {
        float: left;
      }
      &:nth-child(2) {
        float: right;
      }
    }
  }
}
</style>