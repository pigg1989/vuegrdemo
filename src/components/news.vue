<template>
    <div class='news'>
      <titlemy :title="title"/>
    <div class="wrap border">
    	<div class="item">
	        <scroller :data="listData" class="scroller-wrap">
	            <template slot-scope="props">
                    <div class="wrap_box">
                         <span>{{props.item.time}}</span>
	                    <span v-text="props.item.text"></span>
                    </div>
	            </template>
	        </scroller>
    	</div>
    </div>
    </div>
</template>
<script>
import titlemy from '@/components/common/titlemy';
import scroller from 'vue-infinite-auto-scroll';
import api from '@/api/apiAll';
export default {
     name: 'news', 
    components:{
        titlemy,scroller
    },
    data() {
      return{
          title: '最新动态',
           listData: [],
        
      }
    },
    created(){
        this.today = this.$moment(`${this.$moment().format('YYYY-MM-DD')} ${this.timeline}`).format('YYYY-MM-DD HH:mm:ss');
          this.creatData1();
          this.getNews();
    },
    mounted() {          
     
    },

    methods:{
       creatData1() {
            let self = this;
            for (let i = 0; i < 6; i++) {
                self.listData.push({
                    time: new Date().toLocaleDateString(),
                    text: '这是第' + (i+1) + '行数据...'
                });
            }
        },
        getNews(){
            api.get('/audit/auditRecords',{
                dateFrom:'1970-01-01',
                dateTo:`${this.$moment(this.today).format('YYYY-MM-DD')}`,
                pageSize:100,
                revert:true,
                withTotalPages:true
            }).then(res=>{
                // console.log('获取动态信息',res);
                res.data.auditRecords.map(item=>{
                    // console.log(item);
                    this.listData.push({
                        time: this.$moment(item.creationTime).format('YYYY-MM-DD HH:mm:ss'),
                        text: item.text
                        })
            })
        })}
        
    }
}
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
.news{
  .wrap {
	width: 100%;
    float: left;
   color: #fff;
    .item{
	width: 100%;
    height: px2rem(340);   
    
    border-radius: 8px;
    float: left;
    box-sizing: border-box;
    .scroller-wrap {
    height: px2rem(340);   
    // border: 1px solid red;
    }
    .scroller {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: px2rem(150);
        min-height: 100%;
        margin: 0 auto;
        .wrap_box{
            height: px2rem(50);
            // border-bottom: 1px solid #0A3060;
            text-indent: px2rem(20);
             span{
            font-size: px2rem(14);
            line-height: px2rem(50);
            }
        }
       
    }
    }
 
}


}

</style>