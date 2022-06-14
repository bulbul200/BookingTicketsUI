<template>
  <div id="app-setup">
    <transition name="header">
      <the-header
        v-show="headerhide"
        @toggleLogin="openLogin"
        @toggleRegister="openRegister"
      ></the-header>
    </transition>
    <div id="page-contents">
      <nuxt-page></nuxt-page>
    </div>
    <teleport to="body">
      <transition name="modal">
        <main-auth v-show="auth" @close-auth="toggleOffAuth"></main-auth>
      </transition>
    </teleport>
    <teleport to="body">
      <div class="user-details">
        <span>your name</span>
      </div>
    </teleport>
    <the-footer></the-footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from './store/Auth';

const store = useAuth();
const headerhide = ref(true);
const auth = ref(false);

const openLogin = () => {
  auth.value = true;
  store.toggleLogin();
}
const openRegister = () => {
  auth.value = true;
  store.toggleRegister();
}
const toggleOffAuth = () => {
  auth.value = false;
}
function scrollEvent() {
  const y_pos = window.scrollY;
  if (y_pos <= 60) {
    headerhide.value = true;
    return;
  }
  if (y_pos > 80) {
    headerhide.value = false;
    return;
  }
}
onMounted(() => window.addEventListener('scroll', scrollEvent));
onUnmounted(() => window.addEventListener('scroll', scrollEvent));

</script>

<style>
* {
  margin: 0%;
  padding: 0%;
  background: #f4f4f6;
  box-sizing: border-box;
  font-family: "Karla" sans-serif;
}
#app-setup {
  margin: 0%;
  padding: 0%;
  width: 100%;
  height: 100%;
  
}

.header-enter-from, .header-leave-to {
  opacity: 0;
  transform: translateY(-30%);
}
.header-enter-active, .header-leave-active {
  transition: opacity 200ms ease,
    transform 400ms ease;
}

.user-details {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0rem;
  left: 1rem;
  height: 2.5rem;
  min-width: 10rem;
  border-radius: 4px 4px 0 0;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  background: #f4f4f6;
}
.user-details span {
  font-size: 14px;
  letter-spacing: 1.5px;
  font-weight: 800;
  font-style: oblique;
  /* background: #f4f4f6; */
}

#page-contents {
  margin-top: 5.8rem;
  width: 100%;
  min-height: 15rem;
  overflow-x: hidden;
  padding: 8px;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>