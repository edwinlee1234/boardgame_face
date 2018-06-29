<template>
    <div id="GameLobby">
        <h1>Game</h1>
        <div v-for="game in games" :key="game" class="card" style="width: 18rem;">
            <img class="card-img-top" src="" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title"></h5>
                <p class="card-text">{{ game }}</p>
                <router-link :to="{path: '/game/room/' + game + '/0'}">
                    <a href="#" class="btn btn-primary">開始遊戲</a>
                </router-link>
            </div>
        </div>
        <hr>
        <div class="row">
            <div v-for="openingGame in openingGames" 
            v-bind:key="openingGame" 
            class="opening-game" 
            :id="openingGame.gameID">
                <div class="col-12">
                    <h2>{{ openingGame.gameType }}</h2>
                    <!-- 玩家 -->
                    <p v-for="player in openingGame.players" :key="player">
                        Player: {{ player.name }}
                    </p>
                    <!-- 空位 -->
                    <p v-for="empty in openingGame.emptySeat" :key="empty">
                        缺
                    </p>
                    <p>創立時間： {{ openingGame.time }}</p>
                    <div class="btn btn-primary" @click="joinGame(openingGame.gameID)">
                        加入遊戲
                    </div>
                </div>
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
                openingGames: [],
            }
        },

        mounted() {
            let self = this

            // 取得遊戲清單
            axios.get(APIURL + '/api/gamesupport')
            .then(function (response) {
                if (response.data.status == "success") {
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
                let self = this;
                this.conn = new WebSocket("ws://" + WSURL + "/ws?channel=lobby");
                LOBBYWS = this.conn;
                console.log(this.conn);

                this.conn.onclose = function (evt) {
                    console.log(evt);
                    console.log("WebSocket Close");
                    self.conn = null
                };

                this.conn.onmessage = function (evt) {
                    let res = JSON.parse(evt.data);
                    if (res.event == "openGame") {
                        self.openingGames.push(res.data);
                    }
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

            joinGame(gameID) {
                axios({
                    method: 'put',
                    url: APIURL + '/api/game/joingame?id=' + gameID,
                })
                .then(function(response) {
                    console.log(response);
                    if (response.data.status == "success") {
                        window.location = BASE + "game/room/" + response.data.data.gameType[0] + "/" + response.data.data.gameID[0];
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });                
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
