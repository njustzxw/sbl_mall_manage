<template>
    <div>
        <Table stripe  border :columns="columnList" :data="resultData" height='560'></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="total" :current="current"  size="small" show-sizer show-elevator @on-change="changepage" @on-page-size-change="pagesizechange"></Page>
            </div>
        </div>
        <Modal
            v-model="modal"
            title="修改词条"
            @on-ok="ok"
            @on-cancel="cancel">
            <Form :model="modword" label-position="right" :label-width="80">
                <FormItem label="词条名：">
                    <Input v-model="modword.wordcontent" style="width:320px" disabled></Input>
                </FormItem>
                <FormItem label="属性：">
                    <CheckboxGroup v-model="modword.wordTypeList">
                        <Checkbox v-for="(item,index) in wordTypeList" :key='index' :label="item.wordtypeid">{{item.wordtypename}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
        </Modal>
        <Lookmodal/>
    </div>
</template>
<script>
import { doPost } from "@/api/ajax";
import { getLocalTime } from "@/libs/util";
import Lookmodal from "../../components/modal/lookmodal";
export default {
  name: "searchTable1",
  components: {
    Lookmodal
  },
  data() {
    return {
      modal: false,
      modData: {},
      modword: {
        wordcontent: "",
        wordTypeList: []
      },
      modwordTypeList: [],
      tbindex: -1,
      columnList: [
        {
          type: "index",
          title: "序号",
          width: 82,
          fixed: "left",
          align: "center"
        },
        {
          title: "关键词",
          key: "keywordcontent",
          width: 140
        },
        {
          title: "属性",
          key: "attributeids",
          width: 200
        },
        {
          title: "创建时间",
          key: "createtime",
          width: 190
        },
        {
          title: "更新时间",
          key: "updatetime",
          width: 190
        },
        {
          title: "更新人",
          key: "updateby",
          width: 142
        },
        {
          title: "操作",
          key: "action",
          width: 270,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Poptip",
                {
                  props: {
                    title: "确定删除？",
                    confirm: true
                  },
                  style: {
                    marginRight: "5px",
                    background: "red",
                    color: "#fff",
                    padding: "2px 7px",
                    "font-size": "12px",
                    "border-radius": "3px",
                    cursor: "pointer"
                  },
                  on: {
                    "on-ok": () => {
                      this.remove(params.index);
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.tbindex = params.index;
                      this.mod(params.index);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "ghost",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showbc(params.index);
                    }
                  }
                },
                "查看别词"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "ghost",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                "增加别词"
              )
            ]);
          }
        }
      ],
      resultData: [],
      //分页
      current: 1,
      total: 0,
      pageSize: 10,
      value1: "" //别词
    };
  },
  computed: {
    param() {
      return this.$store.state.ckgl.tableParam;
    },
    wordTypeList() {
      return this.$store.state.ckgl.wordTypeList;
    },
    currentCate() {
      return this.$store.state.ckgl.currentCate;
    },
    refresh() {
      return this.$store.state.ckgl.refresh;
    }
  },
  watch: {
    param: {
      handler(val, oldVal) {
        this.getTableData();
      },
      deep: true
    },
    refresh() {
      setTimeout(res => {
        this.getTableData();
      }, 1000);
    }
  },
  methods: {
    getTableData() {
      var that = this;
      var data = {
        request: {
          categoryids: that.param.categoryids,
          keyword: that.param.keyword,
          pageindex: that.current,
          pagesize: that.pageSize
        },
        userid: this.$store.state.user.userId,
        username: this.$store.state.user.userName
      };
      doPost(
        data,
        "KeyWord/GetKeyWord",
        res => {
          if (res.data.code == "100") {
            that.resultData = res.data.data.data;
            for (let obj of that.resultData) {
              var ll = [];
              var list = obj.attributeids && obj.attributeids.split(",");
              if (list) {
                for (let item of list) {
                  for (let item1 of this.wordTypeList) {
                    if (item == item1.wordtypeid) {
                      ll.push(item1.wordtypename);
                    }
                  }
                }
              }
              obj.createtime = obj.createtime
                ? getLocalTime(obj.createtime)
                : "";
              obj.updatetime = obj.updatetime
                ? getLocalTime(obj.updatetime)
                : "";
              obj.attributeids = ll.join(",");
              // console.log(obj)
            }
            that.total = res.data.data.pagesize * res.data.data.totalpage;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    mod(index) {
      this.modal = true;
      this.modData = this.resultData[index];
      this.modword.wordcontent = this.resultData[index].keywordcontent;
      var ll = [];
      var llselect = [];
      if (this.resultData[index].attributeids) {
        var list = this.resultData[index].attributeids.split(",");
        for (let obj of list) {
          for (let item of this.wordTypeList) {
            if (obj == item.wordtypename) {
              ll.push(item);
              llselect.push(item.wordtypeid);
            }
          }
        }
      }
      this.modwordTypeList = ll;
      this.modword.wordTypeList = llselect;
    },
    show(index) {
      this.$Modal.confirm({
        render: h => {
          return h("Input", {
            props: {
              value1: this.value1,
              autofocus: true,
              placeholder: "输入别词名称"
            },
            style: {
              width: "280px"
            },
            on: {
              input: val => {
                this.value1 = val;
              }
            }
          });
        },
        onOk: () => {
          var params = {
            request: {
              keywordid: this.resultData[index].keywordid,
              keyworditemcontent: this.value1
            },
            userid: this.$store.state.user.userId,
            username: this.$store.state.user.userName
          };
          doPost(
            params,
            "KeyWordItem/InsertKeyWordItem",
            res => {
              if (res.data.code == "100") {
                this.$Message.info("添加别词成功");
              }
            },
            err => {
              console.log(err);
            }
          );
        }
      });
    },
    remove(index) {
      var that = this;
      // console.log(this.resultData[index])

      var params = {
        request: {
          isuse: false,
          keywordcontent: this.resultData[index].keywordcontent,
          keywordid: this.resultData[index].keywordid
        },
        userid: this.$store.state.user.userId,
        username: this.$store.state.user.userName
      };

      // console.log(params)
      doPost(
        params,
        "KeyWord/DeleteKeyword",
        res => {
          if (res.data.code == "100") {
            setTimeout(res => {
              that.getTableData();
              this.$Message.info("删除成功");
            }, 1000);
            //   that.$store.commit('setRefresh',Math.random())//更新表格1
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    ok() {
      var that = this;
      var params = {
        request: {
          attributeids: that.modword.wordTypeList.join(","),
          categoryid: that.currentCate.currentcateLevel,
          keywordcontent: that.modword.wordcontent,
          keywordid: that.modData.keywordid
        },
        userid: this.$store.state.user.userId,
        username: this.$store.state.user.userName
      };
      doPost(
        params,
        "KeyWord/UpdateKeyWord",
        res => {
          if (res.data.code == "100") {
            setTimeout(res => {
              that.getTableData();
              this.$Message.info("修改成功");
            }, 500);
          } else {
            alert(res.data.msg);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    cancel() {},
    showbc(index) {
      this.$store.commit("lookbc", this.resultData[index]);
      this.$store.commit("lookmodal", true);
    },
    changepage(index) {
      this.current = index;
      this.getTableData();
    },
    pagesizechange(size) {
      this.pageSize = size;
      this.getTableData();
    }
  }
};
</script>
<style>
.pageparent {
  padding: 15px;
}
.page {
  right: 0;
  float: right;
}
.ivu-poptip-body-message {
  color: #657180;
}
</style>
