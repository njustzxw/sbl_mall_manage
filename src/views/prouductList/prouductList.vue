<template>
    <div style="padding:20px">
        <Row style="background:white;padding: 10px 30px">
            <span>选择目录：</span>
			 <Select v-model="model1" clearable style="width:180px"  @on-change="select1">
                <Option v-for="item in classifyData" :value="item.categoryId" :key="item.categoryId">{{ item.categoryName }}</Option>
            </Select>
            <Select v-model="model2" clearable style="width:180px;margin:0 20px"  @on-change="select2">
                <Option v-for="item in classifyData2" :value="item.categoryId" :key="item.categoryId">{{ item.categoryName }}</Option>
            </Select>
            <Select v-model="model3" clearable style="width:180px"  @on-change="select3">
                <Option v-for="item in classifyData3" :value="item.categoryId" :key="item.categoryId">{{ item.categoryName }}</Option>
            </Select>
            <span style="padding-left:50px">选择类型：</span>
             <Select v-model="model4" clearable style="width:180px">
                <Option v-for="item in typedata" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" icon="ios-search" style="margin:0 20px" @click="_getproductById">查找</Button>
		</Row>
        <div style="margin-top:20PX;">
            <Table border :loading="SpinShow" :columns="columns1" :data="tableList" height="500"></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageindex"  size="small" show-sizer show-elevator @on-change="changepage" @on-page-size-change="pagesizechange"></Page>
                </div>
            </div>
        </div>
        <Modal
        v-model="modal1"
        title="更新产品"
        @on-ok="ok">
            <Form :model="curmodifyPro" :label-width="100">
                <FormItem label="产品Id">
                    <Input v-model="curmodifyPro.id" placeholder="Enter something..." disabled style="width:320px"></Input>
                </FormItem>
                <FormItem label="产品名称">
                    <Input v-model="curmodifyPro.name" placeholder="Enter something..." style="width:320px"></Input>
                </FormItem>
                <FormItem label="产品原价">
                    <Input v-model="curmodifyPro.sprice" placeholder="Enter something..." style="width:320px"></Input>
                </FormItem>
                <FormItem label="产品折扣价">
                    <Input v-model="curmodifyPro.price" placeholder="Enter something..." style="width:320px"></Input>
                </FormItem>
                <FormItem label="产品品牌">
                    <Input v-model="curmodifyPro.brand" placeholder="Enter something..." style="width:320px"></Input>
                </FormItem>
                <FormItem label="产品状态">
                    <Input v-model="curmodifyPro.status" placeholder="Enter something..." style="width:320px"></Input>
                </FormItem>
            </Form>
    </Modal>
    </div>
</template>
<script>
import { getCategory, getproductById, update } from "@/api/index";
export default {
  data() {
    return {
      modal1: false,
      curId: 10009,
      classifyData: [],
      classifyData2: [],
      classifyData3: [],
      model1: "",
      model2: "",
      model3: "",
      model4: 1,
      typedata: [
        { value: 1, label: "全部产品" },
        { value: 2, label: "招标产品" }
      ],
      origndata: [],
      tableList: [],
      columns1: [
        {
          title: "产品Id",
          key: "id",
          align: "center",
          width: 120
        },
        {
          title: "产品名称",
          key: "name",
          align: "center",
          width: 400
        },
        {
          title: "产品原价",
          key: "sprice",
          align: "center",
          width: 150
        },
        {
          title: "产品折扣价",
          key: "price",
          align: "center",
          width: 150
        },
        {
          title: "产品品牌",
          key: "brand",
          align: "center",
          width: 180
        },
        {
          title: "产品状态",
          key: "status",
          align: "center"
        },
        {
          title: "操作",
          key: "operate",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "success",
                    size: "small",
                    icon: "archive"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modify(params.index);
                    }
                  }
                },
                "修改"
              )
            ]);
          }
        }
      ],
      pageindex: 1,
	  pageSize: 10,
      total: 0,
      SpinShow: false,
      curmodifyPro: {}
    };
  },
  mounted() {
    this._getCategory();
    this._getproductById();
  },
  methods: {
    _getCategory() {
      getCategory().then(res => {
        this.origndata = res.data;
        this.classifyData = this.toTree(res.data);
        console.log(this.classifyData);
      });
    },
    toTree(data) {
      var map = {};
      data.forEach(function(item) {
        map[item.categoryId] = item;
      });
      var val = [];
      data.forEach(function(item) {
        var parent = map[item.parentId];
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          val.push(item);
        }
      });
      return val;
    },
    select1(data) {
      this.curId = data;
      this.classifyData2 = [];
      this.classifyData3 = [];
      this.model2 = "";
      this.model3 = "";
      //   this._getproductById();
      this.currentcategoryId = data;
      var data2 = [];
      for (let obj of this.origndata) {
        if (obj.parentId == data) {
          data2.push(obj);
        }
      }
      this.classifyData2 = data2;
    },
    select2(data) {
      this.curId = data;
      this.classifyData3 = [];
      this.model3 = "";
      //   this._getproductById();
      this.currentcategoryId = data;
      var data3 = [];
      for (let obj of this.origndata) {
        if (obj.parentId == data) {
          data3.push(obj);
        }
      }
      this.classifyData3 = data3;
    },
    select3(data) {
      this.curId = data;
    },
    // selectType(data) {
    //   this.model4 = data;
    // },
    _getproductById() {
      var params = {
        zb: this.model4,
        categoryId: this.curId,
        pageNum: this.pageindex,
        pageSize: this.pageSize
      };
      getproductById(params).then(res => {
        this.tableList = res.data.list;
        this.total = res.data.pages * 10;
        console.log(this.tableList);
      });
    },
    changepage(index) {
      this.pageindex = index;
      this._getproductById();
    },
	pagesizechange(size) {
      this.pageSize = size;
      this._getproductById();
    },
    modify(index) {
      this.modal1 = true;
      this.curmodifyPro = JSON.parse(JSON.stringify(this.tableList[index]));
      console.log(this.curmodifyPro);
    },
    ok() {
      var params = this.curmodifyPro;
      params.productId = this.curmodifyPro.id;
      update(params).then(res => {
        if (res.data == "更新成功！") {
          this.$Message.success(res.data);
          this._getproductById();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
  }
};
</script>
