<template>
  <div id="app">
    <headermy/>
    <div class="main">
      <div class="left mr">
        <div class="left_up">
          <ammeter/>
        </div>
        <div class="left_down">
          <lora/>
        </div>
      </div>
      <div class="middle">
        <middle/>
      </div>
      <div class="right ml">
        <div class="right_up">
          <cis/>
        </div>
        <div class="right_down">
          <news/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headermy from "@/components/headermy";
import ammeter from "@/components/ammeter";
import lora from "@/components/lora";
import middle from '@/components/middle';
import cis from '@/components/cis';
import news from '@/components/news';
export default {
  name: "App",
  components: {
    headermy,
    ammeter,
    lora,
    middle,
    cis,
    news
  },
  data() {
    return {     
     
    };
  }
};
</script>

<style lang="scss" scoped>
.mr{
  margin-right: px2rem(11);
  margin-left: px2rem(18);
}
.ml{
  margin-left: px2rem(11);
  // margin-right: px2rem(18);
}
#app {
  // border: 1px solid red;
  // width: px2rem(1366);
  box-sizing: border-box;
  height: auto;
  background: url("assets/dashboard_bg.png");
 
  // overflow: hidden;

  .main {
    // border: 1px solid #0f0;
    overflow: hidden;
    .left {
      height: auto;
      float: left;
      .left_up {
        width: px2rem(360);
        height: auto;
        // @include border;
        overflow: hidden;
      }
      .left_down{
        width: px2rem(360);
        height: auto;      
      }
    }
    .right {
      float: left;
      width: px2rem(360);     
    }
    .middle{
      float: left;
      width: px2rem(593);
      height: px2rem(694);
    }
  }
}
</style>
