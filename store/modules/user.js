import {
    setStore,
    getStore,
} from '@/utils/storage'
export default {
    state: {
        userInfo: getStore('userInfo'), //是否登陆
        treedata: getStore("treedata"),

    },
    getters: {},
    mutations: {
        saveuserInfo(state, userInfo) {
            state.userInfo = userInfo
            setStore('userInfo', userInfo)
        },
        classifyTree(state, treedata) {
            state.treedata = JSON.stringify(treedata);
            setStore("treedata", JSON.stringify(treedata));
        },
    }
}