<template>
  <div class="middle">
    <div class="top">
      <h2 class="top_title">设备总数</h2>
      <h2 class="top_number">{{deviceNumber}}</h2>
      <div class="top_info">
        <span v-for="item of numArr" :key="item.tit" class="ti_span">
          <span class="ti_p">{{item.tit}}</span>
          <span class="ti_num">{{item.number}}</span>
        </span>
      </div>
    </div>
    <div class="box">
      <div class="left">
        <h3 class="title">有线表具</h3>
        <div class="lb_box">
          <div class="lbb" v-for="(item,index) of onlineArr" :key="item.title">
            <img :src="item.img" alt class="lbb_img">
            <div class="lbb_box">
              <p class="lbbb_tit">{{item.title}}</p>
              <p class="lbbb_num">{{item.number}}</p>
              <p class="lbbb_info" v-if="index === 0">
                <span>在线：{{item.online}}</span>
                <span>离线：{{item.offline}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="middle_line"></div>
      <div class="right">
        <h3 class="title">无线表具</h3>
        <div class="right_box">
          <v-chart :options="protocol" autoresize class="ring"></v-chart>
        </div>
          <div class="right_box">
          <v-chart :options="business" autoresize class="ring"></v-chart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api/apiAll';
export default {
     name: 'middle', 
    data() {
      return{    
    totalNumber: '0',
    numArr: [
        {
            tit:'有线数量',
            number: '0'
        },
        {
            tit:'无线数量',
            number: '0'
        }
    ],
    onlineArr:[
        {
            title:'小区管理机',
            number:'132123',
            online: '1321',
            offline: '12312',
            img: require('@/assets/xiaoquguanliji.svg')
        },
        {
            title: '集中器',
            number: '123123',
            img: require('@/assets/jizhongqi.svg')
        },
        {
            title: '表具',
            number: '13212312',
            img: require('@/assets/biaoju.svg')
        }
    ],
    protocolArr:[],
    businessArr: [],
    business: {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },   
        title:{
            text: '按厂家统计',
            show: true,
            position: 'center'
        },
        series: [
        
            {
                name:'访问来源',
                type:'pie',
                radius: ['40%', '55%'],
                roseType: 'radius',
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
                data:[
                    {value:68289, name:'思凯'},
                    {value:53709, name:'金卡'},
                    {value:23365, name:'千嘉'},
                    {value:6455, name:'新天'}
                
                ]
            }
        ]
      },
    protocol: {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },   
        title:{
            text: '按协议统计',
            show: true,
            position: 'center'
        },
        series: [
        
            {
                name:'访问来源',
                type:'pie',
                radius: ['40%', '55%'],
                roseType: 'radius',
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
                data:[
                    {value:30, name:'直达'},
                    {value:40, name:'邮件营销'},
                    {value:30, name:'联盟广告'},
                
                ]
            }
        ]
      },
      intervalNum: 1
      
    }
    
    },
    created(){
        this.handleApiLineNumber();
        this.handleApiXiaoqu();
        this.handleApiJizhong();
        this.handleApiBiaoju();
        this.handleApiProtocol();
        // this.handleApiBusiness();
        // this.interval();
    },
    methods:{
         interval(){
          setInterval(()=>{
              switch(this.intervalNum%5){
                  case 1:
                   this.handleApiLineNumber();
                  break;
                  case 2:
                  this.handleApiXiaoqu();
                  break;
                  case 3:
                   this.handleApiJizhong();
                   break;
                  case 4:
                  this.handleApiBiaoju();
                  break;
                  case 5:
                  this.handleApiProtocol();
                  break;

              }
            this.intervalNum++;
          },500);
      },
        handleApiLineNumber(){
            api.get('/inventory/managedObjects',{
                pageSize:1,
                query:`$filter=(SSA_TYPE eq 0)`,
                withTotalPages:true
            }).then(res=>{
                console.log('lineNumber',res);
                this.numArr[0].number = res.data.statistics.totalPages;
                this.numArr[1].number = this.deviceNumber - this.numArr[0].number;
            })
        },
         handleApiXiaoqu(){
            api.get('/inventory/managedObjects',{
                pageSize:1,
                query:`$filter=(type eq 'c8y_Manager')`,
                withTotalPages:true
            }).then(res=>{
                console.log('小区总数',res);
               this.onlineArr[0].number = res.data.statistics.totalPages;
                api.get('/inventory/managedObjects',{
                pageSize:1,
                query:`$filter=((type eq 'c8y_Manager') and (c8y_Availability.status eq 'AVAILABLE'))`,
                withTotalPages:true
                    }).then(res=>{
                        console.log('小区在线数',res);
                        this.onlineArr[0].online = res.data.statistics.totalPages;
                        api.get('/inventory/managedObjects',{
                            pageSize:1,
                            query:`$filter=((type eq 'c8y_Manager') and (c8y_Availability.status eq 'UNAVAILABLE'))`,
                            withTotalPages:true
                        }).then(res=>{
                            console.log('小区不在线数',res);
                            this.onlineArr[0].offline = res.data.statistics.totalPages;
                        })
                    })
            })
        },
        handleApiJizhong(){
            api.get('/inventory/managedObjects',{
                pageSize:1,
                query:`$filter=(type eq 'c8y_Collector')`,
                withTotalPages:true
            }).then(res=>{
                console.log('集中器',res);
                this.onlineArr[1].number = res.data.statistics.totalPages;
            })
        },
        handleApiBiaoju(){
         
        },
        handleApiProtocol(){
            api.get('/inventory/managedObjects',{
                pageSize:1,
                query:`$filter=(SSA_TYPE eq 1)`,
                withTotalPages:true
            }).then(res=>{
                console.log('协议1',res);
                this.protocolArr.push({name: 'LoRa',value: res.data.statistics.totalPages});
                api.get('/inventory/managedObjects',{
                    pageSize:1,
                    query:`$filter=(SSA_TYPE eq 2)`,
                    withTotalPages:true
                }).then(res=>{
                    console.log('协议2',res);
                    this.protocolArr.push({name: 'NB-IoT',value: res.data.statistics.totalPages});
                     api.get('/inventory/managedObjects',{
                            pageSize:1,
                            query:`$filter=(SSA_TYPE eq 3)`,
                            withTotalPages:true
                        }).then(res=>{
                            console.log('协议3',res);
                            this.protocolArr.push({name: '-NB-IoT（电信）',value: res.data.statistics.totalPages});
                            this.protocol = Object.assign(this.protocol,{series:[{data:[{value:this.protocolArr[0].value,name:this.protocolArr[0].name},{value: this.protocolArr[1].value,name: this.protocolArr[1].name},{value: this.protocolArr[2].value,name: this.protocolArr[2].name}]}]});
                        })
                })
            })
        },
        handleApiBusiness(){
            api.get('/inventory2/managedObjects/aggaragate/count',{
                groupBy:`CIS.MFG_CD`,
                query:`$filter=((type eq 'c8y_meter') and (not(SSA_TYPE eq 0)))`
            }).then(res=>{
                console.log('按商家统计',res);
            })
        }
    }
}
</script>
<style scoped lang='scss'>
.middle {
  .top {
    border: 1px solid #000;
    text-align: center;
    .top_title {
      font-size: px2rem(20);
      color: #fff;
      margin-top: px2rem(20);
      margin-bottom: px2rem(11);
    }
    .top_number {
      font-size: px2rem(56);
      color: #3895ff;
      line-height: px2rem(75);
      letter-spacing: px2rem(4);
    }
    .top_info {
      .ti_span {
        &:nth-child(1) {
          margin-right: px2rem(26);
        }
        .ti_p {
          color: #fff;
          font-size: px2rem(10);
        }
        .ti_num {
          padding-left: px2rem(6);
          color: #3895ff;
          font-size: px2rem(10);
        }
      }
    }
  }
  .box {
    .title {
      text-align: center;
      font-size: px2rem(12);
      font-weight: 600;
      color: #fff;
      margin-top: px2rem(43);
      margin-bottom: px2rem(38);
    }
    .left {
      width: px2rem(260);
      float: left;
      .lb_box {
        .lbb {
         
          margin-bottom: px2rem(70);
          &:nth-last-child(1) {
            margin-bottom: px2rem(35);
          }
          .lbb_img {
            display: block;
            float: left;
            padding-top: px2rem(10);
            padding-left: px2rem(17);
          }
          .lbb_box {
            float: left;
            text-align: left;
            padding-top: px2rem(10);
            padding-left: px2rem(17);
            .lbbb_tit {
              font-size: px2rem(12);
              color: #fff;
            }
            .lbbb_num {
              font-size: px2rem(20);
              color: #3895ff;
              line-height: px2rem(28);
            }
            .lbbb_info {
              color: #fff;
              font-size: px2rem(12);
              line-height: px2rem(17);
            }
          }
        }
      }
    }
    .middle_line {
      @include middle_line;
      float: left;
      margin-top: px2rem(70);
      margin-left: px2rem(30);
    }
    .right {
      width: px2rem(290);
     
      float: right;
      .right_box{
          width: px2rem(210);
          height: px2rem(160);       
          margin: 0 auto;
          margin-bottom: px2rem(50);        
          .ring{
          width: px2rem(210);
          height: px2rem(160);
                 
          }
      }
    }
  }
}
</style>