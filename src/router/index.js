import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/smooth',
    name: 'smooth',
    component: () =>
      import(/* webpackChunkName: "smooth" */ '../views/Smooth.vue'),
  },
  {
    path: '/canvas',
    name: 'canvas',
    component: () =>
      import(/* webpackChunkName: "canvas" */ '../views/Canvas.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
