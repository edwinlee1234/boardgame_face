<template>
    <div id="GameLobby">
        <h1>Game</h1>
        <div v-for="game in games" :key="game" class="card" style="width: 18rem;">
            <img class="card-img-top" src="" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title"></h5>
                <p class="card-text">{{ game }}</p>
                <button type="button" class="btn btn-info" @click="createRoom(game)" href="#">開始遊戲</button>
            </div>
        </div>
        <hr>
        <div class="row">
            <div v-for="(openingGame, index) in openingGames" 
            :key="index" 
            class="opening-game" 
            :id="openingGame.gameID">
                <div class="col-12">
                    <h2>{{ openingGame.gameType }}</h2>
                    <!-- 玩家 -->
                    <p v-for="(player, index) in openingGame.players" :key="index">
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
    import { mapGetters } from 'vuex'
    import * as errorCode from '@/config/errorcode'

    export default {
        name: 'GameLobby',

        data () {
            return {
                games: [],
                openingGames: [],
            }
        },

        computed: {
            ...mapGetters({
                userName: 'getUserName',
                gameID: 'getGameID',
            })
        },

        mounted() {
            // 取得遊戲清單
            axios.get(APIURL + '/api/gamesupport')
            .then((response) => {
                if (response.data.status == "success") {
                    this.games = response.data.data["games"]
                }
            })
            .catch(function (error) {
                console.log(error);
            });

            // Room list
            axios.get(APIURL + '/api/roomlist')
            .then((response) => {
                if (response.data.status == "success") {
                    if (response.data.roomlist) {
                        this.openingGames = response.data.roomlist
                        console.log(this.openingGames)
                    }
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

                    if (res.event == "RoomChange") {
                        // 把Roomdata換掉
                        for (let i = 0; i < self.openingGames.length; i++) {
                            if (self.openingGames[i].gameID == res.data.gameID) {
                                self.openingGames[i].players = res.data.players
                                self.openingGames[i].emptySeat = res.data.emptySeat
                                self.openingGames[i].gameType = res.data.gameType
                            }
                        }
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

            createRoom(gameType) {
                if (!this.userName) {
                    alert("請先登入")
                    return
                }

                if (this.gameID) {
                    alert("已有加入遊戲，不可再開新局")
                    return
                }

                window.location = BASE + "game/room/" + gameType + "/0";
            },

            joinGame(joinGameID) {
                if (this.gameID) {
                    alert("已有加入遊戲，不可再加入新局")
                    return
                }

                axios({
                    method: 'put',
                    url: APIURL + '/api/game/joingame?id=' + joinGameID,
                })
                .then((response) => {
                    if (response.data.status === "success") {
                        let gameID = response.data.data.gameID[0]
                        let gameType = response.data.data.gameType[0]
                        this.$store.dispatch('setUserInfo', {
                            gameID: gameID,
                            gameType: gameType,
                        })

                        window.location = BASE + "game/room/" + gameType + "/" + gameID;
                        return
                    }

                    if (response.data.error.error_code === errorCode.EXIST_GAME_NOT_ALLOW_TO_CREATE_NEW_ONE) {
                        alert("已有加入遊戲，不可再加入新局")
                        return
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
