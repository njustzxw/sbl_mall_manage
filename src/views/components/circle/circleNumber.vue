<template>
	<Row>
        <Col span="12">
        	<Row type="flex" justify="center" align="middle">
        		<i-circle
				:percent="100"
				:size="150"
	        	stroke-color="#43a3fb">
			        <div class="demo-Circle-custom">
			            <h1><CountUp :endVal="total" style="font-size:25px;color:#3f414d"/></h1>
			            <p>今日新词</p>
			            <span></span>
			        </div>
			    </i-circle>
        	</Row>
        </Col>
        <Col span="12">
        	<Row type="flex" justify="center" align="middle">
	        	 <i-circle
		        :size="150"
		        :trail-width="4"
		        :stroke-width="5"
		        :percent="100"
		        stroke-color="#5cb85c"
		        stroke-linecap="square">
			        <div class="demo-Circle-custom">
			            <h1><CountUp :endVal="todaysh" style="font-size:25px;color:#3f414d"/></h1>
			            <p>今日审核</p>
			            <b>
			                环比昨日
			                <i style="color:red">{{yesterdayRate}}</i>
			            </b>
			        </div>
			    </i-circle>
			</Row>
        </Col>
    </Row>
</template>
<script>
	import CountUp from "../countUp/CountUp";
    export default {
    	components:{
	    	CountUp,
	    },
        mounted(){
        },
        props:['total','todaysh','yesterdayRate'],
        data () {
        	return {
//      		total:2013948,
        	}
        }
    }
</script>
<style lang="less">
    .demo-Circle-custom{
        & h1{
            color: #3f414d;
            font-size: 28px;
            font-weight: normal;
        }
        & p{
            color: #657180;
            font-size: 18px;
            margin: 5px 0 5px;
        }
        & b{
            display: block;
            padding-top: 5px;
            color: #657180;
            font-size: 14px;
            &:before{
                content: '';
                display: block;
                width: 50px;
                height: 1px;
                margin: 0 auto;
                background: #e0e3e6;
                position: relative;
                top: -5px;
            };
        }
        & span i{
            font-style: normal;
            color: #3f414d;
        }
    }
</style>
