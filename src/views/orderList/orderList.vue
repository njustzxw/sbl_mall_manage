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
			title="Common Modal dialog box title"
			width="800"
			@on-ok="ok"
			@on-cancel="cancel">
			<Table border :columns="columns2" :data="orderDetail" height="400"></Table>
		</Modal>
    </div>
</template>
<script>
import { getOrderList, getSearchOrderList } from "@/api/index";
export default {
  data() {
    return {
		modal2:false,
		orderDetail:[],
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
                      this.modify(params.index);
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
                      this.modify(params.index);
                    }
                  }
                },
                "发货"
              )
            ]);
          }
        }
	  ],
	  columns2:[
		  {
				title: '产品图',
				key: 'image',
				render: (h, params) => {
					return h('img',{
						props:{
							'src':params.row.productImage 
						}
					})
			}
			},
		   {
				title: '产品名称',
				key: 'productName',
				width:300,
				render: (h, params) => {
					return h('div', [
						h('span', {
							props: {
								title:this.orderDetail[params.index].productName
							},
							style: {
								margin: '0 5px',
								display:"inline-block",
								width:"270px",
								overflow:"hidden",
								lineHeight:"40px;"
							},
							on: {
								click: () => {
									this.show(params.index)
								}
							}
						}, params.row.productName),
					]);
				}
			},
			{
				title: '产品Id',
				key: 'productId'
			},
			{
				title: '数量',
				key: 'quantity'
			},
			{
				title: '单价',
				key: 'currentUnitPrice'
			},
			{
				title: '总价',
				key: 'totalPrice'
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
        console.log(this.tableList.list);
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
        console.log(this.tableList.list);
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
	showOrderdetail(index){
		this.modal2 = true;
		this.orderDetail = this.tableList[index].orderItemVoList
	},
    ok() {}
  }
};
</script>
