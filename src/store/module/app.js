import {
    setTagNavListInLocalstorage,
    getTagNavListFromLocalstorage,
    getHomeRoute,
    getBreadCrumbList
} from '@/libs/util'
import {
    appRouter
} from '@/router/routers'
export default {
    state: {
        breadCrumbList: [],
        tagNavList: [],
        homeRoute: getHomeRoute(appRouter),
        menuTheme: 'dark', // 主题
        themeColor: '', //颜色
        BizTotalCount: {}
    },
    getters: {
        // menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
    },
    mutations: {
        setBreadCrumb(state, routeMetched) {
            state.breadCrumbList = getBreadCrumbList(routeMetched)
        },
        setTagNavList(state, list) {
            if (list) {
                state.tagNavList = [...list]
                setTagNavListInLocalstorage([...list])
            } else {
                state.tagNavList = getTagNavListFromLocalstorage()
                    // console.log(state.tagNavList)
            }
        },
        addTag(state, item, type = 'unshift') {
            if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
                if (type === 'push') state.tagNavList.push(item)
                else state.tagNavList.unshift(item)
                setTagNavListInLocalstorage([...state.tagNavList])
            }
        },
        changeMenuTheme(state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme(state, mainTheme) {
            state.themeColor = mainTheme;
        },
        setBizTotalCount(state, payload) {
            state.BizTotalCount = payload
        }
    }
}