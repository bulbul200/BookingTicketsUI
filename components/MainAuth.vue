<template>
    <div id="auth">
        <div class="container">
            <div class="toggle">
                <div class="title">
                    <p>Welcome to QRCODE</p>
                </div>
                <button @click="closeFunc">close</button>
            </div>
            <div class="main-container">
                <AuthFolderLoginAuth v-show="store.showLogin" @userLogin="submitLogin($event)"/>
                <AuthFolderRegisterAuth v-show="!store.showLogin" />
                <div class="toggle-login" v-show="store.showLogin">
                    <p @click="toggleRegister">No account? <span>Register now</span></p>
                    <p>Forgot Password</p>
                </div>
                <div class="toggle-register" v-show="!store.showLogin">
                    <button @click="toggleLogin">
                        Already have an Account? Login
                    </button>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script setup>
import { useAuth } from '~~/store/Auth';

const emits = defineEmits(['closeAuth']);
const store = useAuth();

function closeFunc() {
    emits('closeAuth');
}
const toggleLogin = () => {
  store.toggleLogin();
}
const toggleRegister = () => {
  store.toggleRegister();
}
function submitLogin(data) {
    console.log(data);
    const { pending, data: token } = useLazyFetch(`http://127.0.0.1:8000/token/login/`, {
        method: 'post',
        body: data
    });
    watch(token, (newToken) => {
        const tokenhead = token.value.auth_token;
        store.updateToken("Token " + tokenhead);
        emits('closeAuth');
    });
}

</script>

<style scoped>
#auth {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
}
#auth .container {
    position: fixed;
    top: 30%;
    left: 50%;
    width: 400px;
    min-height: 300px;
    margin: 0px auto;
    /* padding: 20px 30px; */
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transform: translate(-50%, -50%);
    transition: min-height 300ms ease;
}
#auth .container .toggle {
    position: relative;
    width: 100%;
    height: 3rem;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: inherit;
    font-size: 18px;
}
#auth .container .toggle::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1.5px;
    background: #c0c0c0;
}
#auth .container .toggle .title {
    background: inherit;
    height: 100%;
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
#auth .container .toggle .title p {
    background: inherit;
    color: #003554;
    font-weight: 800;
    /* font-style: oblique; */
}
#auth .container .toggle button {
    padding: 3px 8px;
    border: 1px solid #c0c0c0;
    border-radius: 3px;
    font-size: 13px;
    font-weight: 500;
    color: #003554;
    cursor: pointer;
    transition: border 300ms ease;
}
#auth .container .toggle button:hover {
    border: 1px solid #df2935;
}
.main-container {
    width: 100%;
    margin: 0.5rem 0;
    background: inherit;
}
.main-container .toggle-login {
    padding: 0 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 2.1rem;
    background: inherit;
    /* background: #abc; */
}
.main-container .toggle-login p {
    display: block;
    padding: 8px 0;
    height: 100%;
    font-size: 13px;
    color: #43bccd;
    background: inherit;
    
}
.main-container .toggle-login p span {
    background: inherit;
}
.main-container .toggle-login p:hover {
    cursor: pointer;
}
.main-container .toggle-register {
    width: 92%;
    height: 2.4rem;
    margin: 1rem;
    display: flex;
    align-items: center;
}
.main-container .toggle-register button {
    height: 100%;
    width: 100%;
    border: 1px solid #c0c0c0;
    border-radius: 4px;
    color: #003049;
    font-size: 13px;
    letter-spacing: 0.8px;
    font-style: oblique;
    font-weight: 500;
    cursor: pointer;
    transition: border 300ms ease;
}
.main-container .toggle-register button:hover {
    border: 1px solid #04a777;
}
</style>