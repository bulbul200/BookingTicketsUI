import { defineStore } from "pinia";

export const useAuth = defineStore('Auth', {
    state: () => ({
        visiblelogin: true,
        usertoken: '',
    }),
    getters: {
        showLogin: (state) => state.visiblelogin,
        tokenHeader: (state) => state.usertoken,
    },
    actions: {
        toggleLogin() {
            this.visiblelogin = true;
        },
        toggleRegister() {
            this.visiblelogin = false;
        },
        updateToken(payload) {
            this.usertoken = payload;
        },
    }
})