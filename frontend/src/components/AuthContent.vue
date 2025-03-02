<template>
    <div class="auth-content content-wrapper">
        <Header></Header>

        <section id="auth-section" class="d-flex justify-content-center align-items-center">
            <div class="container">
                <div class="content d-flex flex-column align-items-center">
                    <h1> {{ mode == 'signup' ? 'Sign Up' : 'Login' }} </h1>

                    <form class="form-wrapper d-flex flex-column gap-32" @submit.prevent="null">
                        <div class="form-row d-flex flex-column gap-8" v-if="mode == 'signup'">
                            <div class="input-tag"> Username </div>
                            <input v-model="userName" type="text" class="styled" :placeholder="'Username'" required>
                        </div>

                        <div class="form-row d-flex flex-column gap-8">
                            <div class="input-tag"> Email </div>
                            <input v-model="email" type="email" class="styled" :placeholder="'Email'" required>
                        </div>
        
                        <div class="form-row  d-flex flex-column gap-8">
                            <div class="input-tag"> Password </div> 
                            <input v-model="password" type="password" class="styled" :placeholder="'Password'" required>
                        </div>

                        <div class="form-row  d-flex flex-column gap-8" v-if="mode == 'signup'">
                            <div class="input-tag"> Repeat password </div>
                            <input v-model="passwordRepeat" type="password" class="styled" :placeholder="'PasswordRepeat'" required>
                        </div>
        
                        <div class="text-center alt-text" v-if="mode == 'login'">
                            Don't have an account yet? <router-link to="/signUp"> Sign up <Icon icon="prime:arrow-up-right" class="arrow-icon" /> </router-link>
                        </div>
                        <div class="text-center alt-text" v-if="mode == 'signup'">
                            Already have an account? <router-link to="/login"> Login <Icon icon="prime:arrow-up-right" class="arrow-icon" /> </router-link>
                        </div>

                        <div class="btns-wrapper d-flex gap-8 justify-content-center">
                            <button class="btn primary" type="submit" @click.prevent="doSign">
                                {{ mode == 'signup' ? 'Sign Up' : 'Login' }}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </section>

        <Footer></Footer>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Icon } from '@iconify/vue';
import Header from './Header.vue';
import Footer from './Footer.vue';

export default {
    name: 'AuthContent',

    inject: ['axios', 'emitter', 'userApi'],
    emits: [],

    props: {
        mode: {
            type: String,
            required: true
        }
    },

    components: {
        Icon,
        Header,
        Footer
    },

    data() {
        return {
            userName: "",
            email: "",
            password: "",
            passwordRepeat: ""
        }
    },

    methods: {
        ...mapActions(
            {
                setUser: 'user/setUser',
                setCheckedForUser: "user/setChecked"
            }
        ),
        async doSign() {
            if (!this.email || !this.password) {
                if (!this.email) this.$toast.error("InvalidEmail");
                if (!this.password) this.$toast.error("InvalidPassword");
                return;
            }
            this.emitter.emit("show-loader");

            const post = {
                email: this.email,
                password: this.password,
            }

            if (this.mode == "signup") {
                if (!this.userName || this.password != this.passwordRepeat) {
                    if (!this.userName) this.$toast.error("InvalidUsername");
                    if (this.password != this.passwordRepeat) this.$toast.error("PasswordsDontMatch");
                    this.emitter.emit("hide-loader");
                    return;
                }
                post.username = this.userName;

                try {
                    const registerResp = await this.userApi.registerUser(post);
                    if (registerResp.data.success) {
                        this.$toast.success("RegisterSuccess");
                        this.$router.push({name: "Login"});
                    } else {
                        this.$toast.error("RegisterFailed");
                    }
                    this.emitter.emit("hide-loader");

                } catch (error) {
                    console.error(error);
                    this.$toast.error("RegisterFailed");
                }

            } else if (this.mode == "login") {
                try {
                    const loginResp = await this.userApi.loginUser(post);
                    console.log(loginResp);
                    if (loginResp.data.success) {
                        this.setUser(loginResp.data.user);
                        this.setCheckedForUser(true);
    
                        this.$toast.success("LoginSuccess");
                        this.$router.push({name: "Home"});
                    } else {
                        this.$toast.error("LoginFailed");
                    }
                } catch (error) {
                    console.error(error);
                    this.$toast.error("InvalidCredentials");
                }

                this.emitter.emit("hide-loader");
            }
        }
    },
    
    computed: {
        // ...mapGetters(
        //     {

        //     }
        // ),
    },

    created() {

    },

    mounted() {

    }
}
</script>

<style scoped>
#auth-section {
    padding: 32px 0;
    min-height: 80vh;
    min-height: 80svh;
}

.form-wrapper {
    padding: 32px 24px;
    border-radius: 16px;
    background: rgba();
    max-width: 50%;
    width: 100%;
}

h1 {
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
}

.alt-text {
    font-weight: 200;
    opacity: 0.75;
}

.alt-text a {
    padding: 0 24px;
}

footer {
    margin-top: 64px;
}
</style>