<template>
    <div style="padding:20px">
        <Row style="background:white;padding: 10px 30px">
            <span>订单状态：</span>
			 <Select v-model="status" clearable style="width:180px">
                <Option v-for="item in typedata" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="recevieName" placeholder="收货人姓名" style="width: 180px;margin:0 20px;"></Input>
            <Input v-model="orderNum" placeholder="订单号" style="width: 180px"></Input>
            <Input v-model="phone" placeholder="收货人手机号" style="width: 180px;margin:0 20px;"></Input>
            <Button type="primary" icon="ios-search" style="margin:0 20px" @click="search">查找</Button>
		</Row>
        <div style="margin-top:20PX;">
            <Table border :loading="SpinShow" :columns="columns1" :data="tableList" height="520"></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="total" :current="pageindex"  size="small" show-sizer show-elevator @on-change="changepage"  @on-page-size-change="pagesizechange" ></Page>
                </div>
            </div>
        </div>
		 <Modal
			v-model="modal2"
			title="订单详情"
			width="800"
			@on-ok="ok">
			<Table border :columns="columns2" :data="orderDetail" height="400"></Table>
		</Modal>
        <Modal
			v-model="modal3"
			title="收货人信息"
			width="500"
			@on-ok="ok">
            <Form :model="receviePersonDetail" :label-width="100">
                <FormItem label="收货人：">
                    <span>{{receviePersonDetail.receiverName}}</span>
                </FormItem>
                <FormItem label="收货地址：">
                    <span>{{receviePersonDetail.receiverProvince+receviePersonDetail.receiverCity+receviePersonDetail.receiverDistrict+receviePersonDetail.receiverAddress}}</span>
                </FormItem>
                <FormItem label="联系电话：">
                    <span>{{receviePersonDetail.receiverPhone}}</span>
                </FormItem>
                <FormItem label=" ">
                    <span>{{receviePersonDetail.receiverMobile}}</span>
                </FormItem>
                <FormItem label="邮编：">
                    <span>{{receviePersonDetail.receiverZip}}</span>
                </FormItem>
            </Form>
		</Modal>
        <Modal
			v-model="modal4"
			title="发货状态修改"
			width="500"
			@on-ok="modDelivery">
            <Form :model="deliveryDetail" :label-width="100">
                <FormItem label="订单号：">
                    <span>{{deliveryDetail.orderNo}}</span>
                </FormItem>
                <FormItem label="快递方式：">
                    <Select v-model="deliveryType" placeholder="选择快递方式">
                        <Option value="1">南京思贝丽</Option>
                        <Option value="2">百世快递</Option>
                        <Option value="3">壹米滴答</Option>
                    </Select>
                </FormItem>
                <FormItem :label="deliveryType==1?'联系电话：':'快递单号'">
                     <Input v-model="receivernum" :placeholder="deliveryType==1?'请输入联系电话：':'请输入快递单号'"></Input>
                </FormItem>
            </Form>
		</Modal>
    </div>
</template>
<script>
import { getOrderList, getSearchOrderList, delivery } from "@/api/index";
export default {
  data() {
    return {
      modal2: false,
      modal3: false,
      modal4: false,
      deliveryType: 1,
      receivernum: "",
      orderDetail: [],
      receviePersonDetail: {},
      deliveryDetail: {},
      curType: "",
      status: "",
      typedata: [
        { value: -4, label: "订单未处理" },
        { value: -3, label: "订单删除" },
        { value: -2, label: "订单取消" },
        { value: -1, label: "未提交审核" },
        { value: 0, label: "正在审核" },
        { value: 1, label: "审核不通过" },
        { value: 2, label: "审核通过" },
        { value: 3, label: "待收货" },
        { value: 4, label: "已完成" },
        { value: 5, label: "未发货" },
        { value: 6, label: "未付款" },
        { value: 7, label: "已付款" },
        { value: 8, label: "售后中" },
        { value: 9, label: "已评价" },
        { value: 10, label: "已追评" }
      ],
      recevieName: "",
      orderNum: "",
      phone: "",
      tableList: [],
      columns1: [
        {
          title: "订单号",
          key: "orderNo"
        },
        {
          title: "订单创建时间",
          key: "createTime",
          width: 180
        },
        {
          title: "订单状态",
          key: "statusDesc",
          width: 100
        },
        {
          title: "快递方式",
          key: "expressType"
        },
        {
          title: "快递单号",
          key: "expressNub"
        },
        {
          title: "付款方式",
          key: "paymentTypeDesc",
          width: 100
        },
        {
          title: "付款总额",
          key: "payment"
        },
        {
          title: "收款人姓名",
          key: "receiverName"
        },
        {
          title: "操作",
          key: "operate",
          align: "center",
          width: 320,
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
                      this.showOrderdetail(params.index);
                    }
                  }
                },
                "订单详情"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small",
                    icon: "archive"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showReceviePerson(params.index);
                    }
                  }
                },
                "收货人信息"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "info",
                    size: "small",
                    icon: "archive"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.delivery(params.index);
                    }
                  }
                },
                "发货"
              )
            ]);
          }
        }
      ],
      columns2: [
        {
          title: "产品图",
          key: "image",
          render: (h, params) => {
            return h("img", {
              attrs: {
                src: params.row.productImage,
                width: "50px"
              }
            });
          }
        },
        {
          title: "产品名称",
          key: "productName",
          width: 300,
          render: (h, params) => {
            return h("div", [
              h(
                "span",
                {
                  attrs: {
                    title: params.row.productName
                  },
                  style: {
                    margin: "0 5px",
                    display: "inline-block",
                    width: "270px",
                    overflow: "hidden",
                    lineHeight: "40px;"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                params.row.productName
              )
            ]);
          }
        },
        {
          title: "产品Id",
          key: "productId"
        },
        {
          title: "数量",
          key: "quantity"
        },
        {
          title: "单价",
          key: "currentUnitPrice"
        },
        {
          title: "总价",
          key: "totalPrice"
        }
      ],
      pageindex: 1,
      pageSize: 10,
      total: 0,
      SpinShow: false
    };
  },
  mounted() {
    this._getOrderList();
  },
  methods: {
    _getOrderList() {
      var params = {
        pageSize: 10,
        pageNum: this.pageindex
      };
      getOrderList(params).then(res => {
        this.tableList = res.data.list;
        this.total = res.data.total;
      });
    },
    search() {
      this.pageNum = 1;
      this._getSearchOrderList();
    },
    _getSearchOrderList() {
      var params = {
        status: this.status,
        name: this.recevieName,
        orderNo: this.orderNum,
        phone: this.phone,
        pageSize: 10,
        pageNum: this.pageindex
      };
      getSearchOrderList(params).then(res => {
        this.tableList = res.data.list;
        this.total = res.data.total;
      });
    },

    changepage(index) {
      this.pageindex = index;
      this._getOrderList();
    },
    pagesizechange(size) {
      this.pageSize = size;
      this._getOrderList();
    },
    showOrderdetail(index) {
      this.modal2 = true;
      this.orderDetail = this.tableList[index].orderItemVoList;
    },
    showReceviePerson(index) {
      this.modal3 = true;
      this.receviePersonDetail = this.tableList[index].shippingVo;
    },
    delivery(index) {
      this.modal4 = true;
      this.deliveryType = 1;
      this.receivernum = "";
      this.deliveryDetail = this.tableList[index];
    },
    modDelivery() {
      var params = {
        orderNo: this.deliveryDetail.orderNo,
        type: this.deliveryType,
        num: this.receivernum
      };
      delivery(params).then(res => {
        if (res.data == "发货成功") {
          this.$Message.success(res.data);
          this._getOrderList();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    ok() {}
  }
};
</script>
