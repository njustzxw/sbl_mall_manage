<template>
    <Row type="flex" :gutter="16">
    	<Col span="9" v-show="!tab">
    		<h4 style="line-height:34px">当前目录： {{currentCate.currentCate}}</h4>
    	</Col>
    	<Col span="8" v-show="!tab">
    		 <Form :label-width="100" >
    		 	<FormItem label="搜索当前表格：">
	    			<Input v-model="keyword" @keyup.13.native="search()">
			            <Button slot="append" icon="ios-search" @click="search"></Button>
			        </Input>
	    		</FormItem>
    		 </Form>
        </Col>
        <Col span="15" v-show="tab">
        	<Form  :label-width="100" inline>
    		 	<FormItem label="分类：">
                     <Select v-model="gradeSelect" style="width: 100px">
                        <Option v-for="(item,index) in gradeList" :key="index" :value="item.value">{{item.name}}</Option>
                    </Select>
	    		</FormItem>
                <FormItem prop="keyword_all"  label="关键字：">
                    <Input v-model="keyword_all" @keyup.13.native="searchall()"></Input>
                </FormItem>
                <FormItem prop="date"  label="日期：">
                    <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px" @on-change="selectdate"></DatePicker>
                </FormItem>
                <FormItem prop="keyword_all">
                    <Button  type="primary" icon="ios-search" @click="searchall" style="float:left">搜索</Button>
                </FormItem>
	    	</Form>
        </Col>
        <Col span="7" v-show="!tab" >
            <Button type="primary" icon="plus-circled" @click="addWord">新建词条</Button>
            <Button type="warning" icon="plus-circled" @click="addChild">新增子分类</Button>
        </Col>
    </Row>
</template>
<script>
import { doPost } from "@/api/ajax";
export default {
  name: "search",
  data() {
    return {
      gradeSelect: "0",
      gradeList: [
        { name: "全部", value: "0" },
        { name: "一级分类", value: "1" },
        { name: "二级分类", value: "2" },
        { name: "三级分类", value: "3" },
        { name: "四级分类", value: "4" }
      ],
      keyword: "",
      keyword_all: "",
      value: "", //别名
      starttime: 0,
      endtime: 0
    };
  },
  computed: {
    tab() {
      return this.$store.state.ckgl.tab;
    },
    currentCate() {
      return this.$store.state.ckgl.currentCate;
    }
  },
  watch: {},
  methods: {
    addWord() {
      this.$store.commit("popModal", true);
    },
    addChild() {
      this.$Modal.confirm({
        render: h => {
          return h("Input", {
            props: {
              value: this.value,
              autofocus: true,
              placeholder: "输入分类名称"
            },
            style: {
              width: "280px"
            },
            on: {
              input: val => {
                this.value = val;
              }
            }
          });
        },
        onOk: () => {
          var params = {
            request: {
              categoryid: "",
              categoryname: this.value,
              categorylevel:
                this.$store.state.ckgl.currentCate.currentcateLevel + 1,
              createby: this.$store.state.user.userName,
              fatherid: this.$store.state.ckgl.currentCate.currentcateId,
              isuse: 1,
              orderby: 0
            },
            userid: this.$store.state.user.userId,
            username: this.$store.state.user.userName
          };
          doPost(
            params,
            "Category/AddCategory",
            res => {
              if (res.data.code == "100") {
                this.$Message.info("添加成功");
              }
            },
            err => {
              console.log(err);
            }
          );
        }
      });
    },
    search() {
      this.$store.commit("getTable", { keyword: this.keyword });
    },
    searchall() {
      this.$store.commit("changexx", {
        keywordAll: this.keyword_all,
        selectLevel: this.gradeSelect,
        starttime: this.starttime,
        endtime: this.endtime
      });
    },
    selectdate(date, datetype) {
      this.starttime = new Date(date[0]).getTime() - 8 * 60 * 60 * 1000;
      this.endtime = new Date(date[1]).getTime() + 16 * 60 * 60 * 1000;
    }
  }
};
</script>

