<template>
    <div id="JaipurRoom">
        <div class="gameBoard">
            <div class="row">
                <div class="col-3">
                    <h1>IMG</h1>
                </div>
                <div class="col">
                    <div class="row">
                        <div class="col">
                            <h1>{{gametype}} Room!</h1>
                        </div>
                    </div>
                    <br>
                    <!-- 場主才有的功能 -->
                    <div v-if="owner" class="row">
                        <div class="col">
                            <div v-if="roomState === 'playing'" @click="enterGame()" class="btn btn-primary">
                                進入遊戲
                            </div>
                            <div v-if="roomState === 'notOpen'" @click="openPlayer()" class="btn btn-primary">
                                開放玩家
                            </div>
                            <div v-if="roomState === 'opening'" @click="startGame()" class="btn btn-primary">
                                開始遊戲
                            </div>
                            <div v-if="roomState !== 'playing'" @click="leaveGame()" class="btn btn-danger">
                                放棄本桌
                            </div>              
                        </div>
                    </div>
                    <div v-else class="row">
                        <div class="col">
                            <div v-if="roomState === 'playing'" @click="enterGame()" class="btn btn-primary">
                                進入遊戲
                            </div>
                            <div v-if="roomState !== 'playing'" @click="leaveGame()" class="btn btn-danger">
                                離開本桌
                            </div>  
                        </div>    
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-3">
                <JaipurSetting v-if="gametype === 'jaipur'" v-bind:owner="owner" v-bind:roomState="roomState"></JaipurSetting>
            </div>
            <div class="col">
                <TableSeat v-bind:playersInfo="playersInfo"></TableSeat>
            </div>
        </div>
    </div>
</template>

<script>
    import TableSeat from '@/components/TableSeat'
    // TODO 
    // 動態的更換這一個頁面
    import JaipurSetting from '@/page/gamepage/setting/JaipurSetting';
    import * as errorCode from '@/config/errorcode'
    import { mapGetters } from 'vuex'

    export default {
        name: 'Room',

        props: [
            'gametype',
            'gameID',
        ],

        computed: {
            ...mapGetters({
                userName: 'getUserName',
            })
        },

        data () {
            return {
                conn: "",
                uuid: "",
                gameType: "",
                playersInfo: [
                    // {id: 1, name: "player"},
                    // {id: 2, name: "player2"},
                ],
                owner: false,
                roomState: "",
            }
        },

        mounted() {
            // 從開始遊戲進來這邊id會是0
            console.log(this.gameID)
            if (this.gameID == '0') {
                this.createGame()
                this.owner = true
            } else {
                this.wsInit()
                this.getRoomInfo()
            }
        },

        methods: {
            createGame() {
                axios({
                    method: "put",
                    url: APIURL + '/api/creategame?game=' + this.gametype,
                    responseType: 'json',
                })
                .then((response) => {
                    if (response.data.status === "success") {
                        this.gameID = response.data.data.gameID;

                        this.getRoomInfo()
                        this.wsInit()
                        return
                    } 
                })
                .catch(function (error) {
                    const response = error.response

                    if (response.data.error.error_code === errorCode.EXIST_GAME_NOT_ALLOW_TO_CREATE_NEW_ONE) {
                        alert("已存在舊遊戲，不可開新局")
                    }

                    if (response.data.error.error_code === errorCode.NOT_AUTHORIZATION) {
                        alert("請先登入")
                    }

                    if (response.data.error.error_code === errorCode.UNEXPECT_ERROR) {
                        alert("SYETEM ERROR")
                    }

                    window.location = BASE + "gamelobby";
                });  
            },

            wsInit() {
                // 連線ws
                this.conn = GAMEWS; 
                if (this.conn === null) {
                    this.open();
                }
            },

            getRoomInfo() {
                // init room的資料
                axios({
                    method: 'get',
                    url: APIURL + '/api/game/roomInfo?id=' + this.gameID + '&game=' + this.gameType,
                })
                .then((response) => {
                    if (response.data.status == "success") {
                        this.playersInfo = response.data.players;
                        this.owner = response.data.owner;
                        this.roomState = response.data.roomState;
                        this.gameType = response.data.gameType;

                        this.$store.dispatch('setUserInfo', {
                            gameID: response.data.gameID,
                            gameType: response.data.gameType
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });  
            },

            open() {
                let self = this
                this.conn = new WebSocket("ws://" + WSURL + "/ws?channel="+this.gametype+"&id="+this.gameID);
                console.log(this.conn);

                this.conn.onclose = function (evt) {
                    console.log(evt);
                    console.log("WebSocket Close");
                    this.conn = null;
                    GAMEWS = null;
                };

                this.conn.onmessage = function (evt) {
                    let res = JSON.parse(evt.data);
                    // 玩家變動
                    if (res.event == "ChangePlayer") {
                        self.playersInfo = res.data;
                    }

                    // 開始遊戲
                    if (res.event == "StartGame") {
                        let id = res.data.gameID
                        let gameType = res.data.gameType
                        window.location = BASE + "game/view/" + gameType + "/" + id;
                        window.location.reload(true);
                        return
                    }      
                    
                    // 被踢了
                    if (res.event == "Kick") {
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].name == self.userName) {
                                window.location = BASE + "gamelobby";
                                window.location.reload(true);
                                return;
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

                this.conn.send(this.msg2);
            },

            // 開放玩家進場
            openPlayer() {
                let self = this;

                axios({
                    method: 'put',
                    url: APIURL + '/api/game/openplayer?id='+this.gameID,
                })
                .then(function(response) {
                    if (response.data.status == "success") {
                        console.log(response.data);
                        self.roomState = "opening";
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            },

            startGame() {
                // owner的功能
                if(!this.owner) {
                    return;
                }

                axios({
                    method: 'put',
                    url: APIURL + '/api/game/startgame?id='+this.gameID,
                })
                .then(function(response) {
                    if (response.data.status == "success") {
                        let id = response.data.data.gameID
                        let gameType = response.data.data.gameType
                        window.location = BASE + "game/view/" + gameType + "/" + id;
                        window.location.reload(true);
                        
                        return;
                    }

                    console.log("Open Game ERROR");
                })
                .catch(function (error) {
                    console.log(error);
                });                
            },

            enterGame() {
                window.location = BASE + "game/view/" + this.gameType + "/" + this.gameID;
                window.location.reload(true);
            },

            close() {
                this.conn.close();
            },

            leaveGame() {
                axios({
                    method: "put",
                    url: APIURL + '/api/game/roomClose?id=' + this.gameID,
                    responseType: 'json',
                })
                .then((response) => {
                    if (response.data.status === "success") {
                        this.$store.dispatch('setUserInfo', {
                            gameID: 0,
                        })

                        window.location = BASE + "gamelobby";
                    } 
                })
                .catch(function (error) {
                    console.log(error);
                });  
            }
        },

        components: {
            TableSeat,
            JaipurSetting,
        }
    }
</script>

<style lang="scss" scoped>
#JaipurRoom {
    padding: 15px;
    .gameBoard {
        margin-top: 30px;
        margin-bottom: 30px;
        height: 250px;
        border: solid 1px;
        padding: 15px;
        border-radius: 5px;
    }
}   
</style>
