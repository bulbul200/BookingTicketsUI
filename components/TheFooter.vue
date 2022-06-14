<template>
    <div id="footer">
        <div class="name">
            ONLINE TP
        </div>
        <div class="details">
            <p>
                Powered by
                <a href="https://github/Amos-Ditto">online tp me.</a>
                <span>Version: 20220521-1</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
#footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    margin-bottom: 2rem;
    color: #001845;
    font-size: 14px;
    font-weight: 550;
    width: 100%;
    background: inherit;
}
.details p a {
    text-decoration: none;
    font-weight: 700;
}
.details p a span {
    margin-left: 2rem;
}
</style>