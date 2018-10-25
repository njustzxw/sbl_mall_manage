import Cookies from 'js-cookie'
/**
 * @description 本地存储标签导航列表 
 * @param {array} 获取参数为路由列表 
 */
export const setTagNavListInLocalstorage = list => {
    localStorage.tagNaveList = JSON.stringify(list)
}


/**
 * @description 本地获取标签导航列表 
 * @returns {array}
 */
export const getTagNavListFromLocalstorage = () => {
    const list = localStorage.tagNaveList
    return list ? JSON.parse(list) : []
}

/**
 * @description 用于找到路由列表中name为home的对象
 * @param {Array} routers 路由列表数组
 */
export const getHomeRoute = routers => {
    // console.log(routers)
    let i = -1
    let len = routers.length
    let homeRoute = {}
    while (++i < len) {
        let item = routers[i]
        if (item.children && item.children.length) {
            let res = getHomeRoute(item.children)
            if (res.name) return res
        } else {
            if (item.name === 'home') homeRoute = item
        }
    }
    return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
    const { name, path, meta } = newRoute
    let newList = [...list]
    if (newList.findIndex(item => item.name === name) >= 0) return newList
    else newList.push({ name, path, meta })
    return newList
}


/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched) => {
    let res = routeMetched.map(item => {
        let obj = {
            icon: (item.meta && item.meta.icon) || '',
            name: item.name,
            meta: item.meta
        }
        return obj
    })
    res = res.filter(item => {
        return !item.meta.hideInMenu
    })
    return [...res]
}

/**
 * 
 * @param {*} item 路由信息
 */
export const showTitle = (item) => ((item.meta && item.meta.title) || item.name)

/**
 * 
 * @param {*} list 接收要展开的目录
 */
export const setCatalogInLocalstorage = (list) => {
    // console.log(JSON.stringify(list))
    localStorage.CatalogList = JSON.stringify([...list])
}

export const getCatalogInLocalstorage = () => {
    const list = localStorage.CatalogList
    return list ? JSON.parse(list) : []
}
export const getLocalTime = (nS) => {
    return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}