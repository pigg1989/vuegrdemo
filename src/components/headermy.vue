<template>
    <div class='headermy'>     
      <div class="left"></div>
      <div class="tit">
          <h2 class="tit_m">贵州燃气集中抄表平台</h2>
          <p class="tit_info">{{time}}</p>
      </div>
      <div class="right right_r"></div>
    </div>
</template>
<script>
export default {
     name: 'headermy', 
    data() {
      return{
          time: (new Date()).toLocaleString()
      }
    },
    methods:{}
}
</script>
<style scoped lang='scss'>
  .headermy{
    width: 100%;
    height: px2rem(60);
    .left,.right{
      width: px2rem(479);
      height: px2rem(47);    
      float: left;
      &.right_r{
        float: right;
      }
    }
    
    .tit{
      width: px2rem(380);
      height: px2rem(47);
      text-align: center;
      float:left;
      .tit_m{
        font-size: px2rem(23);
        font-weight: 600;
        color: #3895FF;
      }
      .tit_info{
        font-size: px2rem(14);
        color: #3895FF;
      }
    }
  }
</style>