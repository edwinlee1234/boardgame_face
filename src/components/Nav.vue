<template>
    <div id="Nav">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Board Game</a>
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
                </ul>
            </div>

            <div class="rightNav">
                <span v-if="!userName">
                    <a href="#">
                        <router-link to="/login">登入</router-link>
                    </a>
                </span>
                <span v-if="!userName">
                    <a href="#">
                        <router-link to="/register">註冊</router-link>
                    </a>
                </span>
                <span v-if="userName">
                    <a href="#">
                        <router-link to="/">Hello! {{ userName }} 會員中心</router-link>
                    </a>
                    <a href="#" @click="logout()">
                        <router-link to="/">登出</router-link>
                    </a>                    
                </span>   
            </div>

            <div class="existGameBar" v-if="gameID && gameType">
                <p @click="redirect()">你已有加入遊戲 #{{ gameID }}:{{ gameType }}</p>
            </div>
        </nav>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    
    export default {
        name: 'Nav',

        data () {
            return {
            }
        },

        computed: {
            ...mapGetters({
                userName: 'getUserName',
                gameID: 'getGameID',
                gameType: 'getGameType',
            })
        },

        mounted() {

        },

        methods: {
            // 轉去Room
            redirect() {
                window.location = BASE + "game/room/" + this.gameType + "/" + this.gameID;
                window.location.reload(true);
                return;
            },

            logout() {
                axios({
                    method: 'put',
                    url: APIURL + '/api/user/logout',
                })
                .then((response) => {
                    if (response.data.status === "success") {
                        window.location = BASE;
                        window.location.reload(true);
                        return;
                    }             
                })
                .catch(function (error) {
                    console.log(error);
                }); 
            }
        }
    }
</script>

<style lang="scss" scoped>

.existGameBar {
    cursor: pointer;
    font-size: 20px;
    position: absolute;
    left: 40%;
    top: 13px;
}

.rightNav {
    span {
        margin-right: 8px;
        margin-left: 8px;
    }
}
</style>
