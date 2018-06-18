<template>
    <div id="GameLobby">
        <h1>Game</h1>
        <div v-for="game in games" :key="game" class="card" style="width: 18rem;">
        <img class="card-img-top" src="" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title"></h5>
            <p class="card-text">{{ game }}</p>
            <router-link :to="{path: '/game/room/' + game}">
                <a href="#" class="btn btn-primary">開始遊戲</a>
            </router-link>
        </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'GameLobby',

        data () {
            return {
                games: [],

            }
        },

        mounted() {
            let self = this

            // 取得遊戲清單
            axios.get(APIURL + '/api/gamesupport')
            .then(function (response) {
                if (response.result = "success") {
                    self.games = response.data.data["games"]
                }
            })
            .catch(function (error) {
                console.log(error);
            });

            // lobby的推播
            this.conn = LOBBYWS;
            if (this.conn === null) {
                this.open()
            }
        },

        methods: {
            open() {
                this.conn = new WebSocket("ws://" + WSURL + "/ws?channel=lobby");
                LOBBYWS = this.conn;
                console.log(this.conn);

                this.conn.onclose = function (evt) {
                    console.log(evt);
                    console.log("WebSocket Close");
                    this.conn = null
                };

                this.conn.onmessage = function (evt) {
                    console.log(evt)
                };
            },

            sendMsg() {   
               if (this.conn.readyState !== 1) {
                    console.log("WS not ready");

                    return;
               }

                this.conn.send();
            },

            close() {
                this.conn.close();
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
