<template>
	<Row type="flex" class="card-info" align='middle' justify="center">
        <Col span="8" class="h100">
        	<div class="icon-info h100" :style="{background:numberList.color}">
        		<Row type="flex" class="h100" align='middle' justify="center">
        			<Icon :type="numberList.icon" style=" font-size: 40px;color:white"/>
        		</Row>
        	</div>
        </Col>
        <Col span="16" class="h100">
        	<div class="num-info h100" :style="{color:numberList.color}">
        		<Row  class="h100" >
        			<p class="infor-intro-number">
        				<CountUp :endVal='numberList.number'/>
        				<span>{{numberList.unit}}</span>
        			</p>
        			<p class="infor-intro-text">{{numberList.title}}</p>
        		</Row>
        	</div>
        </Col>
    </Row>
</template>

<script>
import CountUp from "../countUp/CountUp";
export default {
    name:'number',
    props:['numberList'],
    components:{
    	CountUp,
    }
}
</script>

<style>
	.card-info{
		height: 100px;
	}
	.num-info{
		font-size: 30px;
    	font-weight: 700;
	}
	.h100{
		height:100%
	}
	.infor-intro-text {
		text-align: center;
	    font-size: 12px;
	    font-weight: 500;
	    color: #C8C8C8;
	}
	.infor-intro-number{
		text-align: center;
		margin: 18px 0 3px 0;
	}
</style>
