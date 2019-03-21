<template>
    <div class='titlemy'>
        <h2 class="htitle">•  {{title}}  •</h2>
    </div>
</template>
<script>
export default {
     name: 'titlemy', 
    data() {
      return{}
    },
    props:{
        title:{
            type: String,
            default: ''
        }
    },
    created(){
        // console.log('11111111',this.title);
    },
    methods:{}
}
</script>
<style scoped lang='scss'>
    .titlemy{
        margin-top: px2rem(7);
        margin-bottom: px2rem(7);       
        .htitle{
            background: rgba(56, 149, 255, .3);
            color: #3895FF;
            font-size: px2rem(14);
            padding: px2rem(5) px2rem(23) px2rem(5);
        }
    }
</style>