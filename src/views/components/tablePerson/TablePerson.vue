<template>
	<Row>
        <Col span="24">
        	<div class="dateselect">
        		<span>时间选择：</span>
        	 	<DatePicker
             @on-change="timechange"
             type="daterange"
             format="yyyy-MM-dd"
             split-panels
             placeholder="请选择日期"
             style="width: 200px"></DatePicker>
        	</div>
        	<Table :loading="tableLoading"  height="300" border :columns="columns2" :data="data3"></Table>
          <div style="text-align:right;padding:10px;">
            <Page
            :total="total"
            :current="pageIndex"
            size="small"
            show-elevator
            show-sizer
            @on-change="changePageIndex"
            @on-page-size-change="changePageSize"
            style="display:inline-block"></Page>
          </div>
        </Col>
        <!-- <Col span="11">
        	<Bar/>
        </Col> -->
    </Row>
</template>

<script>
import { doPost } from "@/api/ajax";
import Bar from "../allchart/Bar";
export default {
  components: {
    Bar
  },
  data() {
    return {
      columns2: [
        {
          title: "人员",
          key: "username"
        },
        {
          title: "审核总词数",
          key: "total"
        },
        {
          title: "通过词数",
          key: "passcount"
        },
        {
          title: "抛弃词数",
          key: "deletecount"
        }
      ],
      times: [],
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      startTime: new Date(new Date(new Date().toLocaleDateString())).getTime(),
      endTime:
        new Date(new Date(new Date().toLocaleDateString())).getTime() +
        86400000,
      tableLoading: true,
      data3: []
    };
  },
  methods: {
    changePageIndex(val) {
      this.pageIndex = val;
      this.getData();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getData();
    },
    timechange(val) {
      console.log(val);
      this.startTime = new Date(val[0]).getTime() - 8 * 60 * 60 * 1000;
      this.endTime = new Date(val[1]).getTime() + 16 * 60 * 60 * 1000;
      this.getData();
    },
    getTableTime(time) {
      //	            this.tabletimearr = time;
      //	            this.getTableData()
    },

    getData() {
      this.tableLoading = true;
      var params = {
        request: {
          endtime: this.endTime,
          pageindex: this.pageIndex,
          pagesize: this.pageSize,
          starttime: this.startTime
        },
        userid: this.$store.state.user.userId,
        username: this.$store.state.user.userName
      };
      doPost(
        params,
        "Biz/GetBizCountPerStaff",
        res => {
          if (res.data.code == "100") {
            this.data3 = res.data.data.data;
            this.total = res.data.data.pagesize * res.data.data.totalpage;
          } else {
            alert(res.data.msg);
          }
          this.tableLoading = false;
        },
        err => {
          this.tableLoading = false;
        }
      );
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style>
.dateselect {
  margin-bottom: 10px;
}
</style>
