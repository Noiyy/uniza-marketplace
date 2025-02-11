import { createWebHistory, createRouter } from 'vue-router';

export default function (emitter) {
    
    const routes = [
        {
            path: '/:pathMatch(.*)*',
            name: 'PageNotFound',
            component: () => import('../../views/404-PageNotFound.vue')
        },
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
    ];

    const router = createRouter({
        history: createWebHistory(),
        routes
    });

    router.beforeEach((to, from, next) => {
        console.log('Navigating to:', to.path);

        const isAuthenticated = !!document.cookie.split('; ').find(row => row.startsWith('token='));
        if (to.meta.requiresAuth && !isAuthenticated)
            next({ path: '/' });
        else {
            if(to.matched.length === 0) {
                window.location.reload();
            }
            else {
                emitter.emit('show-loader');
                next();
                emitter.emit('hide-loader');
            }
        }
    })

    return router;
}