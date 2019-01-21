<template>
    <div id="GameLobby">
        <div class="container">
          <div class="game-list-box">
            <h2>遊戲列表</h2>
            <div v-for="game in games" :key="game" class="card" @click="createRoom(game)">
              <div class="card-title-my">
                {{ game }}
              </div>
              <img class="card-image" :src="findImages(game)">
            </div>
          </div>
          <div class="room-list-box">
            <div class="row"  v-for="(openingGame, index) in openingGames" :key="index" @click="joinGame(openingGame.gameID)">
                <div class="room-box" :id="openingGame.gameID">
                    <div class="col-12">
                      <div class="row">
                        <div class="col-2">
                          <img class="room-box-image" :src="findImages(openingGame.gameType)" alt="">
                        </div>
                        <div class="col-2">
                          <h2>{{ openingGame.gameType }}</h2>
                        </div>
                        <div class="col">
                          <p>創立時間： {{ openingGame.time }}</p>
                        </div>
                      </div>
                      <hr>
                      <div class="row">
                        <div class="col-12">
                          <!-- 玩家 -->
                          <span class="user" v-for="(player, index) in openingGame.players" :key="index">
                              <i class="far fa-user"></i> {{ player.name }}
                          </span>
                          <!-- 空位 -->
                          <span class="user" v-for="empty in openingGame.emptySeat" :key="empty">
                              <i class="far fa-user"></i> 缺
                          </span>
                        </div>
                      </div>
                        <!-- <div class="btn btn-primary" ">
                            加入遊戲
                        </div> -->
                    </div>
                </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import * as errorCode from '@/config/errorcode'
    import imagesPath from '@/config/images'

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
                  this.games = response.data.data.games
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
                if (!this.userName) {
                    alert("請先登入")
                    return
                }

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
                        let gameID = response.data.data.gameID
                        let gameType = response.data.data.gameType
                        this.$store.dispatch('setUserInfo', {
                            gameID: gameID,
                            gameType: gameType,
                        })

                        window.location = BASE + "game/room/" + gameType + "/" + gameID;
                        return
                    }                 
                })
                .catch(function (error) {
                    const response = error.response
                    
                    if (response.data.error.error_code === errorCode.EXIST_GAME_NOT_ALLOW_TO_CREATE_NEW_ONE) {
                        alert("已有加入遊戲，不可再加入新局")
                        return
                    }

                    if (response.data.error.error_code === errorCode.NOT_AUTHORIZATION) {
                        alert("請先登入")
                        return
                    }   
                });                
            },

            findImages(gameType) {
              let fullPath = ''
              let fileName = imagesPath[gameType]

              if (fileName) {
                fullPath =  imagesPath.base + fileName
              }

              return fullPath
            }
        }
    }
</script>

<style lang="scss" scoped>
#GameLobby {
  .room-list-box {
    margin-top: 10px;
    padding: 30px;
    border: solid 1px;
    border-radius: 5px;

    .room-box {
      vertical-align: center;
      padding: 20px;
      cursor: pointer;
      width: 100%;
      border: solid 1px;
      border-radius: 5px;

      p {
        padding-top: 5px;
      }

      .room-box-image {
        width: 80px;
        height: 80px;
      }

      .user {
        display: inline-block;
        width: 100px;
        height: 35px;
      }

      .fa-user { 
        font-size: 30px;
      }

      &:hover {
        box-shadow: 5px 5px 10px 10px
      }
    }
  }

  .game-list-box {
    h2 {
      margin-bottom: 25px;
    }

    padding: 30px;
    margin-top: 30px;
    border: solid 1px;
    border-radius: 5px;
  }

  .card {
    display: inline-block;
    cursor: pointer;
    text-align: center;
    padding: 15px;
    position: relative;
    height: 220px;
    width: 180px;

    .card-title-my {
      font-size: 20px;
      padding-bottom: 5px;
      border-bottom: solid 1px;
      margin-bottom: 15px;
    }

    .card-image {
      width: 125px;
      height: 125px;
    }

    &:hover {
      box-shadow: 5px 5px 10px 10px
    }
  }
}
</style>
