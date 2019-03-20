<template>
    <div class='lora'>
      <titlemy :title="title"/>
      <div class="left_box">
          <div class="lb_info" v-for="item of loraArr" :key="item.info">
              <p class="lbi_info">{{item.title}}</p>
              <p class="lbi_num">{{item.number}}</p>
          </div>
      </div>
      <div class="right_box">
           <v-chart :options="loraRing" autoresize class="ring"></v-chart>
      </div>
    </div>
</template>
<script>
import titlemy from '@/components/common/titlemy';
import api from '@/api/apiAll';
export default {
    name: 'lora', 
    components:{
        titlemy
    },
    data() {
      return{
          title: 'Lora表具状态',
          todayDown: '',
          total:'',
          onState:'',
          offState:'',
          loraArr: [
              {
                  title: '手动开关阀次数',
                  number:'12312'
              },
              {
                  title:'当日表具自动关阀数',
                  number: '12312'
              },
              {
                 title: '当日表具自动开阀数',
                 number: '123123'
              }
          ],
     loraRing: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ['#D92288','#00DEFF','#3895FF'],
        series: [
          {
            name: "当天抄表数",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    formatter: '{per|{d}%}\n {b|{b}}',
                    rich: {                      
                        b: {
                            fontSize: 10,
                            color: '#3895FF',
                            lineHeight: 15
                        },
                        per: {
                            color: '#3895FF',   
                            fontSize: 14,
                            lineHeight: 26
                        }
                    }
                }
            },
             labelLine: {
              show: false
            },
            data: [
              { value: 50, name: "开阀" },
              { value: 20, name: "关阀" },
              { value: 30, name: '其他' }
            ]
          }
        ]
      },
      intervalNum:1
      }
    },
    created(){
        this.today = this.$moment(`${this.$moment().format('YYYY-MM-DD')} ${this.timeline}`).format('YYYY-MM-DD HH:mm:ss');
        this.todayDown = this.$moment(`${this.$moment().format('YYYY-MM-DD')} 23:59:59`).format('YYYY-MM-DD HH:mm:ss');
        this.handleApihandNumber();
        this.handleAutoOffNumber();
        this.handleAutoOnNumber();
        // this.handleState();        
    },
    methods:{
         interval(){
          setInterval(()=>{
              switch(this.intervalNum%4){
                  case 1:
                  this.handleApihandNumber();
                  break;
                  case 2:
                  this.handleAutoOffNumber();
                  break;
                  case 3:
                   this.handleAutoOnNumber();
                   break;
                  case 4:
                  this.handleState();    
                  break;

              }
            this.intervalNum++;
          },500);
      },
        handleApihandNumber(){
            api.get('/devicecontrol/operations',{
                currentPage:1,
                dateFrom:`${this.$moment(this.today).format()}`,
                dateTo:`${this.$moment(this.todayDown).format()}`,
                fragmentType:'ValveOpen',
                pageSize:1,
                revert:true,
                withTotalPages:true
            }).then(res=>{
                console.log('handerNumber',res);
                this.loraArr[0].number = res.data.statistics.totalPages;
            })
        },
        handleAutoOffNumber(){
              api.get('/event/events',{
               currentPage:1,
               dateFrom:`${this.$moment(this.today).format()}`,
               dateTo:`${this.$moment(this.todayDown).format()}`,
               fragmentType:`ValveClose`,
               pageSize:1,
               type:'c8y_ValveStatusUpdate',
               withTotalPages:true 
            }).then(res=>{
                console.log('autoOffNumber',res);
                this.loraArr[1].number = res.data.statistics.totalPages;
            })
        },
        handleAutoOnNumber(){
              api.get('/event/events',{
               currentPage:1,
               dateFrom:`${this.$moment(this.today).format()}`,
               dateTo:`${this.$moment(this.todayDown).format()}`,
               fragmentType:`ValveOpen`,
               pageSize:1,
               type:'c8y_ValveStatusUpdate',
               withTotalPages:true 
            }).then(res=>{
                console.log('autoOffNumber',res);
                this.loraArr[2].number = res.data.statistics.totalPages;
            })
        },
         handleState(){
            api.get('/inventory/managedObjects',{
                pageSize:1,
                query:`$filter=(SSA_TYPE eq 1)`,
                withTotalPages:true
                }).then(res=>{
                    console.log('autoOnState',res);
                    this.total = res.data.statistics.totalPages;
                      api.get('/inventory/managedObjects',{
                        pageSize:1,
                        query:`$filter=((SSA_TYPE eq 1) and (MSP.Bit5 eq '1'))`,
                        withTotalPages:true
                        }).then(res=>{
                            console.log('autoOnState',res);
                            this.onState = res.data.statistics.totalPages;
                            api.get('/inventory/managedObjects',{
                                pageSize:1,
                                query:`$filter=((SSA_TYPE eq 1) and (MSP.Bit6 eq '1'))`,
                                withTotalPages:true
                                }).then(res=>{
                                    console.log('autoOnState',res);
                                    this.offState = res.data.statistics.totalPages;
                                    this.loraRing = Object.assign(this.loraRing,{series:[{data:[{value:this.onState,name:'开阀'},{value:this.offState,name:'关阀'},{value:this.total-this.onState-this.offState,name:'其它'}]}]});
                                })
                        
                        })
                })
              
        },
        
    }
}
</script>
<style scoped lang='scss'>
.lora{
   
    overflow: hidden;
    .left_box{
        width: px2rem(130);
        height: px2rem(260);
        
        float: left;
        .lb_info{
            line-height: px2rem(20);
            margin-bottom: px2rem(30);
            text-indent: px2rem(20);
            &:nth-child(1){
                margin-top:px2rem(50);
            }
            .lbi_info{
                font-size: px2rem(10);
                color: #fff;
            }
            .lbi_num{
                font-size: px2rem(20);
                color: #3895FF;
            }
        }
    }
    .right_box{
        width: px2rem(224);
        height: px2rem(260);
        float:left;       
     
        .ring{
            width: 100%;
        }
    }
}
</style>