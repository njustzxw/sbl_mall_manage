import login from '@/views/login/login'
import Main from '@/views/Main';
const basePath = ""

// 其他页面
export const otherRouter = [{
    path: basePath + '/',
    name: 'login',
    title: '登陆',
    component: login,
}]

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [{
        path: basePath + '/',
        name: 'ckglall',
        meta: {
            icon: 'ios-folder',
            title: '词库管理'
        },
        component: Main,
        children: [{
            path: 'home',
            name: 'home',
            meta: {
                icon: 'ios-folder-outline',
                title: '产品管理'
            },
            component: resolve => {
                require(['@/views/prouductList/prouductList'], resolve);
            }
        }, {
            path: 'orderList',
            name: 'orderList',
            meta: {
                icon: 'ios-folder-outline',
                title: '订单管理'
            },
            component: resolve => {
                require(['@/views/orderList/orderList'], resolve);
            }
        }, ]
    }, ]
    // 所有上面定义的路由都要写在下面的routers里
export const routers = [
    ...otherRouter,
    ...appRouter,
];