import Home from "../views/Home.vue";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/difference/:mode/:id",
    name: "difference",
    props: true,
    component: () => import(/* webpackChunkName: "unfollowers" */ "../views/DifferenceList.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;