import http from "./ajax";

// 用户登录
export const login = params => {
    return http.fetchPost("manage/user/login.do", params);
};
// 获取分类
export const getCategory = params => {
    return http.fetchGet("category/list.do", params);
};

// 获取产品
export const getproductById = params => {
    return http.fetchGet("manage/product/list_category.do", params);
};

// 更新产品
export const update = params => {
    return http.fetchGet("manage/product/update.do", params);
};




//获取订单列表
export const getOrderList = params => {
    return http.fetchGet("manage/order/list.do", params);
};
//搜索订单
export const getSearchOrderList = params => {
    return http.fetchGet("manage/order/search.do", params);
};