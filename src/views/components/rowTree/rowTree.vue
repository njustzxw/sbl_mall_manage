<template>
	<div style="width:300px">
		<div  class="left" style="width:150px">
			<span @click="getchild">{{list.label}}</span>
		</div>
		<div class="right" style="width:150px">
			<rowTree  v-for="(item,index) in list.children" :key='index' :list='item' v-show="item.parentId==currentid" />
		</div>
	</div>
</template>

<script>
import rowTree from './rowTree'
export default {
	name:'rowTree',
	data () {
	    return {
	    	currentid:'',
	    }
	},
	components:{
		rowTree,
	},
	props:['list'],
	methods: {
		getchild () {
			console.log(this.list.id)
			this.currentid = this.list.id
		}
	},
	mounted () {
		
	}
}
</script>

<style>
	.left{
		float: left;
	}
	.right{
		float: right;
	}
	.wd50{
		width:50%
	}
</style>