<template>
    <div class="layout">
        <Layout style="height:100%">
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" :style="{background: maincolor=='light'?'#fff':'#495060'}">
                <div style="height:65px;width:100%">
                    <p class="sname" style="display:relative" v-if="!ssfag">
                        <img src="../../static/img/dc.png" alt="" class="icon-img" >   
                        词库管理后台
                    </p>
                    <img src="../../static/img/dc.png" alt="" class="icon-img1"  v-else>
                </div>
                <div v-if="routerlink[0]">
                    <Menu :active-name="this.$route.name" :theme="maincolor" width="auto" :class="menuitemClasses" @on-select="openurl">
                        <div  v-for="(item,index) in routerlink" :key="index"  :name="item.name" >
                            <div style="z-index:2000;color:#bebebd;padding:10px 20px">
                                {{item.meta.title}}
                            </div>
                            <MenuItem v-for="(item1,index1) in item.children" :key="index1" :name="item1.name">
                                <Icon :type="item1.meta.icon"></Icon>
                                <span>{{item1.meta.title}}</span>
                            </MenuItem>
                        </div>
                    </Menu>
                </div>
            </Sider>
            <Layout>
                <Header :style="{padding: 0,position: 'fixed', width: '100%','z-index':1000,height:'64px'}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin:'20px 20px 0'}" type="navicon-round" size="24"></Icon>
                     <custom-bread-crumb show-icon style="position:absolute;top:0;left:70px" :list="breadCrumbList"></custom-bread-crumb>
                    <user  style="position: fixed;top: 0px;right: 50px;"></user>
                </Header>
                <Content :style="{margin: '65px 0 20px', background: '#fff', height: '100%',background:'#eee'}">
                    <div class="tag-nav-wrapper">
                        <tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>
                    </div>
                    <router-view/>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
import { mapMutations } from "vuex";
import { getNewTagList } from "@/libs/util";
import { appRouter } from "../router/routers";
import Cookies from "js-cookie";
import tagsNav from "./components/tags-nav";
import user from "./components/user";
import customBreadCrumb from "./components/bread";
export default {
  components: {
    tagsNav,
    customBreadCrumb,
    user
  },
  data() {
    return {
      routerlink: [],
      isCollapsed: false,
      ssfag: false
    };
  },
  mounted() {
    if (!Cookies.get("userlogfag")) {
      this.$router.push({ path: "/" });
    }
    this.routerlink = appRouter;
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    this.setTagNavList();
    this.setBreadCrumb(this.$route.matched);
    this.addTag(this.$store.state.app.homeRoute);
  },
  watch: {
    $route(newRoute) {
      // console.log(newRoute)
      this.setBreadCrumb(newRoute.matched);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
    }
  },
  computed: {
    maincolor() {
      return this.$store.state.app.menuTheme;
    },
    tagNavList() {
      // console.log(this.$store.state.app.tagNavList)
      return this.$store.state.app.tagNavList;
    },
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList;
    },
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }
  },
  methods: {
    ...mapMutations(["setBreadCrumb", "setTagNavList", "addTag"]),
    collapsedSider() {
      this.ssfag = !this.ssfag;
      this.$refs.side1.toggleCollapse();
    },
    openurl(pathname) {
      this.$router.push({ name: pathname });
    },
    handleCloseTag(res, type) {
      this.setTagNavList(res);
      if (type === "all") this.openurl("homw");
    },
    handleClick(item) {
      this.openurl(item.name);
    }
  }
};
</script>
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100%;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
.sname {
  color: rgb(247, 132, 38);
  font-size: 22px;
  line-height: 64px;
  text-align: center;
}
.icon-img {
  width: 30px;
  position: absolute;
  top: 17px;
  left: 4px;
}
.icon-img1 {
  width: 35px;
  position: absolute;
  top: 17px;
  left: 22px;
}
.channelbox {
  width: 110px;
  height: 110px;
  line-height: 110px;
  text-align: center;
  display: inline-block;
  color: white;
  font-size: 20px;
  cursor: pointer;
  margin: 12px;
}
.channelbox:hover {
  opacity: 0.9;
}
.tag-nav-wrapper {
  padding: 0;
  height: 40px;
  background: #f0f0f0;
  overflow: hidden;
}
</style>