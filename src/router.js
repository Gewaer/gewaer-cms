import Vue from "vue";
import Router from "vue-router";
import isEqual from "lodash/isEqual";
import Dashboard from "./views/dashboard";
import Login from "@/views/auth/login.vue";
import SignUp from "@/views/auth/sign-up.vue";
import ForgotPassword from "@/views/auth/forgot-password.vue";
import UsersInvites from "@/views/auth/users-invites.vue";
import UsersInvitesConfirmation from "@/views/auth/users-invites-confirmation.vue";
import ResetPassword from "@/views/auth/reset-password.vue";
import BrowseList from "./views/browse/";
import createResource from "./views/resource/create.vue";
import routerValidator from "@/config/routerValidator";

const { GwSettingsRoutes } = require(`./import.${process.env.VUE_APP_IMPORTS}`);

Vue.use(Router);

const router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "dashboard",
            component: Dashboard
        },
        {
            path: "/users/login",
            name: "login",
            component: Login,
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "/users/signup",
            name: "signup",
            component: SignUp,
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "/users/forgot-password",
            name: "forgotPassword",
            component: ForgotPassword,
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "/users/reset-password/:resetKey",
            name: "resetPassword",
            component: ResetPassword,
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "/users/invites/:hash",
            name: "usersInvites",
            component: UsersInvites,
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "/users/link/:hash",
            name: "usersInvitesConfirmation",
            component: UsersInvitesConfirmation,
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "*",
            name: "404",
            component: () => import(/* webpackChunkName: "error-404" */ "./views/errors/error-404"),
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "/forbidden",
            name: "403",
            component: () => import(/* webpackChunkName: "error-403" */ "./views/errors/error-403"),
            meta: {
                requiresAuth: false
            }
        },
        {
            path: "/browse/:resource",
            name: "browse",
            component: BrowseList
        },
        {
            path: "/browse/:resource/create",
            name: "create-resource",
            component: createResource
        },
        {
            path: "/browse/:resource/:id/edit",
            name: "edit-resource",
            component: createResource
        }
    ]
});

router.addRoutes(GwSettingsRoutes);

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth !== false)) {
        routerValidator(to, from).then((routeToGo) => {
            if (isEqual(routeToGo, to)) {
                next();
            } else {
                next(routeToGo);
            }
        }).catch((routeToGo) => next(routeToGo));
    } else {
        next();
    }
});

export default router;
