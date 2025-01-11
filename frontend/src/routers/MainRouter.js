import { createWebHistory, createRouter } from 'vue-router';

export default function (BASE_PATH, emitter) {
    
    const routes = [
        {
            path: '/:pathMatch(.*)*',
            name: 'PageNotFound',
            component: () => import('../../views/404-PageNotFound.vue')
        },
        {
            path: BASE_PATH + '',
            name: 'Home',
            alias: BASE_PATH + 'home',
            component: () => import ('../../views/home/HomeView.vue'),
            children: []
        },
    ];

    const router = createRouter({
        history: createWebHistory(),
        routes
    });

    router.beforeEach((to, from, next) => {
        console.log('Navigating to:', to.path);
        if(to.matched.length === 0) {
            window.location.reload();
        }
        else {
            emitter.emit('show-loader');
            next();
            emitter.emit('hide-loader');
        }
    })

    return router;
}