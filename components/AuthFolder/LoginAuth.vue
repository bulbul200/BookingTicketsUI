<template>
    <div id="login">
        <div class="inputfield">
            <div class="icon"></div>
            <input type="email" id="email" placeholder="Your email" v-model="email">
        </div>
        <div class="inputfield">
            <div class="icon"></div>
            <input type="password" id="password" placeholder="Password" v-model="password">
        </div>
        <div class="submit">
            <button @click="submitLogin">Login<div class="i-ph-anchor-simple-thin" /></button>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['userLogin']);
const email = ref('');
const password = ref('');
function submitLogin() {
    // console.log('mail');
    if (email.value === '') {
        document.getElementById('email').focus();
        return;
    }
    if (password.value === '') {
        document.getElementById('password').focus();
        return;
    }
    const data = {
        'email': email.value,
        'password': password.value
    }
    emit('userLogin', JSON.stringify(data));
}
</script>

<style lang="scss" scoped>
#login {
    width: 100%;
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: inherit;
}
.inputfield {
    width: 100%;
    height: 3rem;
    padding: 0 4px;
    display: flex;
    align-items: center;
    background: inherit;
}
.inputfield .icon {
    height: 80%;
    width: 8%;
    border-radius: 4px 0 0 4px;
    border: 1px solid #c0c0c0;
    background: #abc;
}
.inputfield input {
    padding: 0 8px;
    width: 92%;
    height: 80%;
    outline: none;
    border: 1px solid #c0c0c0;
    border-radius: 0 4px 4px 0;
    font-size: 14px;
    font-style: oblique;
    color: #003049;
    letter-spacing: 1px;
    transition: border 300ms ease;
}
.inputfield input:hover, .inputfield input:focus {
    border: 1px solid #04a777;
}
.inputfield input[type='password'] {
    letter-spacing: 3px;
}
.submit {
    width: 100%;
    height: 2.6rem;
    background: inherit;
}
.submit button {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 4px;
    background: #04a777;
    color: #003049;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 1px;
    cursor: pointer;
}
</style>