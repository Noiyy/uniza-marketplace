import { createWebHistory, createRouter } from 'vue-router';
import store from '../store/store';

export default function (emitter, isDev, axiosInstance) {
    const routes = [
        // Errors
        {
            path: '/:pathMatch(.*)*',
            name: 'PageNotFound',
            component: () => import('../../views/ErrorView.vue'),
            props: { errorCode: "404", errorTitle: "Page not found", errorIcon: "game-icons:capybara" }
        },
        {
            path: '/401',
            name: "401",
            component: () => import('../../views/ErrorView.vue'),
            props: { errorCode: "401", errorTitle: "Unauthorized", errorIcon: "material-symbols:lock" }
        },

        // Normal
        {
            path: '',
            name: 'Home',
            alias: '/home',
            component: () => import ('../../views/home/HomeView.vue'),
            children: []
        },
        {
            path: '/login',
            name: "Login",
            component: () => import ('../../views/AuthView.vue'),
            props: { mode: "login" }
        },
        {
            path: '/signUp',
            name: "SignUp",
            component: () => import ('../../views/AuthView.vue'),
            props: { mode: "signup" }
        },
        {
            path: '/admin',
            name: "Admin",
            component: () => import ('../../views/admin/AdminView.vue'),
            meta: { requiresAdmin: true }
        },
        {
            path: '/chat',
            name: 'Chat',
            component: () => import ('../../views/chat/ChatView.vue'),
            meta: { requiresAuth: true },
            props: { mode: "chat" }
        },
        {
            path: '/support',
            name: 'Support',
            component: () => import ('../../views/chat/ChatView.vue'),
            meta: { requiresAuth: true },
            props: { mode: "support" }
        },
        {
            path: '/faq',
            name: 'FAQ',
            component: () => import ('../../views/faq/FAQView.vue'),
        },
        {
            path: '/product/:id/edit',
            name: 'ProductEdit',
            component: () => import ('../../views/product/ProductEditView.vue'),
            meta: { requiresAuth: true, requiresOwner: true, checkExisting: true },
        },
        {
            path: '/product/:id',
            name: 'ProductDetail',
            component: () => import ('../../views/product/ProductDetailView.vue'),
            meta: { checkExisting: true }
        },
        {
            path: '/browse',
            name: 'Browse',
            alias: '/search',
            component: () => import ('../../views/browse/BrowseView.vue'),
        },
        {
            path: '/user/:id',
            name: 'UserProfile',
            component: () => import ('../../views/user/UserProfileView.vue'),
            meta: { checkExisting: true }
        },
    ];

    const router = createRouter({
        history: createWebHistory(),
        routes,
        scrollBehavior(to, from, savedPosition) {
            if (savedPosition) {
              return savedPosition;
            } else {
              return { top: 0 };
            }
          },
    });

    const defaultRouteHandler = (to, from, next) => {
        // No route found
        if(to.matched.length === 0) {
            window.location.reload();
        }
        else {
            emitter.emit('show-loader');
            emitter.emit("close-sidebarMenu");
            next();
            emitter.emit('hide-loader');
        }
    };

    router.beforeEach(async (to, from, next) => {
        console.log('Navigating to:', to.path);

        let user = store.getters["user/getUser"];
        let isAdmin = user && user.isAdmin;

        // Auth check
        if ((to.meta.requiresAuth && (!user || !user._id)) || (to.meta.requiresAdmin && ((!user || !user._id) || !isAdmin))) {
            try {
                const resp = await axiosInstance.get("api/user/getLoggedUser", { withCredentials: true });
                const userData = resp.data.user;

                await store.dispatch("user/setUser", userData);
                user = store.getters["user/getUser"];
                isAdmin = user && user.isAdmin;

                if (
                    (!user || !user._id) || // If user isn't logged or
                    (to.meta.requiresAdmin && !user || !user._id || !isAdmin) // user isn't admin and it's required
                ) {
                    emitter.emit("close-sidebarMenu");
                    next({ path: '/401' });
                } else 
                    // Successfully authenticated
                    defaultRouteHandler(to, from, next);

            } catch (error) {
                console.error("err", error);
                next({ path: '/401' });
            }

        // Existing item check
        } else if (to.meta.checkExisting) {
            const pathName = to.name;
            const id = to.params.id;

            let found = false;
            try {
                if (pathName.toLowerCase().includes("user")) {
                    const resp = await axiosInstance.get(`api/user/${id}`);
                    if (resp.data && resp.data._id) found = true;

                } else if (pathName.toLowerCase().includes("product")) {
                    const resp = await axiosInstance.get(`api/product/${id}`);
                    if (resp.data && resp.data._id) found = true;
                }
            } catch (err) {
                console.error("err", err);
                next({ path: '/404' });
            }

            if (found) defaultRouteHandler(to, from, next);
            else next({ path: '/404' });

        } else
            defaultRouteHandler(to, from, next);
    
    })

    return router;
}