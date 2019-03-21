<!--
<template>
  <div class="headermy">
    <div class="left"></div>
    <div class="tit">
      <h2 class="tit_m">贵州燃气集中抄表平台</h2>
      <p class="tit_info">{{time}}</p>
    </div>
    <div class="right right_r"></div>
  </div>
</template>
-->
<template>
  <div class="titleText">
    <div class="bgLeft">
      <div class="bgLeft_1"></div>
      <div class="bgLeft_2"></div>
      <div class="bgLeft_3"></div>
    </div>
    <div class="textContnt">
      <div class="wenzi">贵州燃气集中抄表平台</div>
      <div class="time">{{time}}</div>
    </div>
    <div class="bgRight">
      <div class="bgRight_2"></div>
      <div class="bgRight_3"></div>
      <div class="bgRight_4"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "headermy",
  data() {
    return {
      time: new Date().toLocaleString()
    };
  },
  methods: {},
  mounted() {
  setInterval(() => {
    this.time = (new Date()).toLocaleString();
  }, 1000);
},
};
</script>
<style scoped lang='scss'>
// .headermy {
//   width: 100%;
//   height: px2rem(60);
//   .left,
//   .right {
//     width: px2rem(479);
//     height: px2rem(47);
//     float: left;
//     &.right_r {
//       float: right;
//     }
//   }

//   .tit {
//     width: px2rem(380);
//     height: px2rem(47);
//     text-align: center;
//     float: left;
//     .tit_m {
//       font-size: px2rem(23);
//       font-weight: 600;
//       color: #3895ff;
//     }
//     .tit_info {
//       font-size: px2rem(14);
//       color: #3895ff;
//     }
//   }
// }
.titleText {
  display: flex;
  height: px2rem(46);
  align-items: center;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.bgLeft,
.bgRight {
  flex-grow: 1;
  display: flex;
  height: 100%;
}
.bgRight {
  justify-content: flex-end;
  overflow: hidden;
}
.bgLeft_1,
.bgRight_4 {
  width: 80%;
  height: 100%;
}
.bgLeft_3,
.bgRight_2 {
  width: 2%;
  height: 100%;
  border-right: 1px solid #3895ff;
  border-left: 1px solid #3895ff;
}
.bgLeft_2,
.bgRight_3 {
  width: 2%;
  height: 100%;
}
.bgLeft_4,
.bgRight_1 {
  width: 13%;
  height: 100%;
}
.bgLeft_1 {
  background: linear-gradient(
    270deg,
    rgba(62, 147, 231, 1) 0%,
    rgba(62, 147, 231, 0) 100%
  );
  opacity: 0.3958;
  transform: skewX(-27deg);
}
.bgRight_4 {
  background: linear-gradient(
    270deg,
    rgba(62, 147, 231, 0) 0%,
    rgba(62, 147, 231, 1) 100%
  );
  opacity: 0.3958;
  transform: skewX(27deg);
}
.bgLeft_3 {
  transform: skewX(-27deg);
}
.bgRight_2 {
  transform: skewX(27deg);
}
.textContnt {
  .wenzi {
    text-align: center;
    background: linear-gradient(
      180deg,
      rgba(105, 199, 255, 1) 0%,
      rgba(56, 149, 255, 1) 100%
    );
    font-weight: 600;
    -webkit-background-clip: text;
    color: transparent;
    font-size: px2rem(24);
  }
  .time {
    font-size: px2rem(14);
    color: #3895ff;
    text-align: center;
  }
}
</style>