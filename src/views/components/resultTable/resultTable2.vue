<template>
    <div>
        <Table stripe  border :columns="columnList" :data="resultData" height='580'></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="total" :current="current"  size="small" show-sizer show-elevator @on-change="changepage" @on-page-size-change="pagesizechange"></Page>
            </div>
        </div>
        <Modal
            v-model="modal"
            title="修改"
            @on-ok="ok">
            <Form :model="modData" label-position="right" :label-width="80">
                <FormItem label="词条名：">
                    <Input v-model="modData.keywordcontent" style="width:320px"></Input>
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
  name: "searchTable2",
  components: {
    Lookmodal
  },
  data() {
    return {
      tbindex: "",
      modData: {},
      modal: false,
      columnList: [
        {
          type: "index",
          title: "序号",
          width: 60,
          align: "center"
        },
        {
          title: "关键词",
          key: "keywordcontent",
          width: 250
        },
        {
          title: "创建时间",
          key: "createtime",
          width: 180
        },
        {
          title: "更新时间",
          key: "createtime",
          width: 180
        },
        {
          title: "更新人",
          key: "createby",
          width: 120
        },
        {
          title: "分类",
          key: "grades",
          width: 350
        },
        {
          title: "备注",
          key: "attr"
        },
        {
          title: "操作",
          key: "action",
          width: 300,
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
                      this.show1(params.index);
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
      allList: []
    };
  },
  computed: {
    changeOption() {
      return this.$store.state.ckgl.changeOption;
    },
    treeList() {
      return this.$store.state.ckgl.treeList;
    },
    refresh() {
      setTimeout(res => {
        this.getData();
      }, 1000);
    }
  },
  watch: {
    changeOption: {
      handler(val, oldVal) {
        this.getData();
      },
      deep: true
    }
  },
  mounted() {
    // console.log(this.treeList)
  },
  methods: {
    getData() {
      var that = this;
      let list = [];
      if (this.changeOption.selectLevel != 0) {
        for (let obj of that.treeList) {
          if (obj.categorylevel == this.changeOption.selectLevel) {
            list.push(obj.categoryid);
          }
        }
      }
      that.allList = list;
      var data = {
        request: {
          categoryids: that.allList,
          keyword: that.changeOption.keywordAll,
          pageindex: that.current,
          pagesize: that.pageSize,
          starttime: that.changeOption.starttime,
          endtime: that.changeOption.endtime
        },
        userid: this.$store.state.user.userId,
        username: this.$store.state.user.userName
      };
      doPost(
        data,
        "KeyWord/GetKeyWord",
        res => {
          // console.log(res.data.data)
          if (res.data.code == "100") {
            that.resultData = res.data.data.data;
            for (let obj of that.resultData) {
              obj.att1 = obj.att1 + "," + obj.att2 + "," + obj.att3;
              obj.createtime = obj.createtime
                ? getLocalTime(obj.createtime)
                : "";
              obj.updatetime = obj.updatetime
                ? getLocalTime(obj.updatetime)
                : "";
              obj.grades = that
                .getgrades([], obj.categoryid)
                .splice(1)
                .join(">");
            }
            that.total = res.data.data.pagesize * res.data.data.totalpage;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    getgrades(list, id) {
      for (let item of this.treeList) {
        if (item.categoryid == id) {
          list.unshift(item.categoryname);
          if (item.categorylevel >= 1) {
            return this.getgrades(list, item.fatherid);
          } else {
            return list;
          }
        }
      }
      return list.join(">");
      // console.log(list)
    },
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.resultData[index].name}<br>Age：${
          this.resultData[index].age
        }<br>Address：${this.resultData[index].address}`
      });
    },
    mod(index) {
      this.modal = true;
      this.modData = this.resultData[index];
      // console.log(this.modData)
    },
    remove(index) {
      var that = this;
      var params = {
        request: {
          isuse: false,
          keywordcontent: this.resultData[index].keywordcontent,
          keywordid: this.resultData[index].keywordid
        },
        userid: this.$store.state.user.userId,
        username: this.$store.state.user.userName
      };
      doPost(
        params,
        "KeyWord/DeleteKeyword",
        res => {
          if (res.data.code == "100") {
            setTimeout(res => {
              that.getData();
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
          attributeids: that.modData.attributeids,
          categoryid: that.modData.categoryid,
          isuse: true,
          keywordcontent: that.modData.keywordcontent,
          keywordid: that.modData.keywordid,
          orderby: 0,
          updateby: this.$store.state.user.userName
        },
        userid: this.$store.state.user.userId,
        username: this.$store.state.user.userName
      };
      doPost(
        params,
        "KeyWord/UpdateKeyWord",
        res => {
          console.log(res);
          if (res.data.code == "100") {
            this.$Message.info("修改成功");
          } else {
            alert(res.data.msg);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    show1(index) {
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
                this.$Message.success("添加别词成功");
              }
            },
            err => {
              console.log(err);
            }
          );
        }
      });
    },
    showbc(index) {
      this.$store.commit("lookbc", this.resultData[index]);
      this.$store.commit("lookmodal", true);
    },
    changepage(index) {
      this.current = index;
      this.getData();
    },
    pagesizechange(size) {
      this.pageSize = size;
      this.getData();
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
</style>
