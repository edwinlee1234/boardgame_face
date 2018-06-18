<template>
    <div id="Nav">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Navbar</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                <li class="nav-item active">
                    <a class="nav-link" href="#">
                        <router-link to="/">主頁</router-link>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">
                        <router-link to="/gamelobby">開始遊戲</router-link>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Pricing</a>
                </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
    export default {
        name: 'Nav',

        data () {
            return {
            }
        },

        mounted() {

        },

        methods: {
        }
    }
</script>

<style lang="scss" scoped>

</style>
