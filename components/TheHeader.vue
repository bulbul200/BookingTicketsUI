<template>
    <div id="header">
        <div class="left">
            <div class="logo">
                <span>ONLINE TP</span>
            </div>
            <div class="links">
                <div class="link">
                    <NuxtLink to="/">Home</NuxtLink>
                </div>
                <div class="link">
                    <NuxtLink to="/schedules">Create Schedules</NuxtLink>
                </div>
                <div class="link">
                    <NuxtLink to="">Status</NuxtLink>
                </div>
            </div>
        </div>
        <div class="right">
            <button class="login" @click="$emit('toggleLogin')">Login</button>
            <button class="login" @click="$emit('toggleRegister')">Register</button>
        </div>
    </div>
</template>

<script setup>
defineEmits(['toggleLogin', 'toggleRegister'])
</script>

<style lang="css" scoped>
#header {
    position: fixed;
    padding: 0 10px;
    z-index: 9997;
    top: 0%;
    width: 100%;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fdfffc;
    color: #01161e;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
.left {
    height: 100%;
    display: flex;
    flex-direction: row;
    background: inherit;

}
.logo {
    font-size: 20px;
    font-style: oblique;
    background: inherit;
    display: flex;
    align-items: center;
}
.logo span {
    background: inherit;
    cursor: pointer;
    font-family: merienda;
    font-weight: 600;
    color: #003049;
}
.links {
    margin-left: 4rem;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
    background: inherit;
}
.links .link {
    position: relative;
    height: 100%;
    min-width: 6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    background: inherit;
    letter-spacing: .5px;
    cursor: pointer;
    transition: background 300ms ease;

}
.links .link a {
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: inherit;
    color: #01161e;
    font-family: Arial, Helvetica, sans-serif;
    transition: color 300ms ease;
    
}
.links .link a:hover {
    color: #0582ca;
}
.links .link a:hover:after {
    position: absolute;
    content: '';
    bottom: 0%;
    left: 0%;
    width: 100%;
    height: 2px;
    background: #0582ca;
}
.links .link .router-link-active::after {
    position: absolute;
    content: '';
    bottom: 0%;
    left: 0%;
    width: 100%;
    height: 2px;
    background: #0582ca;
}
.links .link .router-link-active {
    font-weight: bold;
    color: #0582ca;
}
.right {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 1.5rem;
    height: 100%;
    gap: 2rem;
    background: inherit;
}
.right button {
    height: 2rem;
    padding: 0 10px;
    border-radius: 6px;
    outline: none;
    font-size: 12px;
    border: 1px solid #c0c0c0;
    cursor: pointer;
    transition: background 300ms ease;
}
.right button:hover {
    background: #c1c0c9;
    /* transition: background 300ms ease; */
}
</style>