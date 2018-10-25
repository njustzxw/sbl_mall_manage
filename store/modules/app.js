// import Vue from 'vue';
import { appRouter, otherRouter } from '@/router/routers';

const state = {
    menuList: [],
    activedList: [],
    activeMenu: '',
    routers: [
        otherRouter,
        ...appRouter
    ]
}

const getters = {
    menuList: state => state.menuList,
    activeMenu: state => state.activeMenu,
    activedListWithTitle: state => state.activedList.map(getTitleByName)
}

const actions = {

}

const mutations = {
    updateMenulist(state) {
        state.menuList = appRouter;
    },

    activeMenuName(state, name) {
        state.activeMenu = name;
        if (state.activedList.indexOf(name) == -1) {
            state.activedList.push(name);
        }
    },

    removeMenuName(state, name) {
        var index = state.activedList.indexOf(name);
        var len = state.activedList.length - 1;
        Vue.delete(state.activedList, index)
        if (index >= len) {
            index = len - 1;
        }
        state.activeMenu = state.activedList[index];
    }
}

var getTitleByName = function() {
    var obj = {}
    appRouter.forEach(view => {
        obj[view.name] = view.title;
        view.children.forEach(page => {
            obj[page.name] = page.title
            if (page.tagClose === false) {
                state.activedList.push(page.name)
            }
        })
    })
    return (name) => {
        return {
            name: name,
            title: obj[name]
        };
    }
}()

export default {
    state,
    getters,
    actions,
    mutations
}