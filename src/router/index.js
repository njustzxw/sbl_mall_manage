import Vue from 'vue'
import iView from 'iview';
import Router from 'vue-router'
import { routers } from './routers'
// import 'iview/dist/styles/iview.css';

Vue.use(Router)
Vue.use(iView)
const router = new Router({
    // mode: 'history',
    routes: routers
})

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach((to) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;