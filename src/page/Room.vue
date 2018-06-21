<template>
    <div id="JaipurRoom">
        <div class="jumbotron">
            <h1 class="display-4">{{gametype}} Room!</h1>
        </div>
        <div class="row">
            <div class="col-4">
                <JaipurSetting v-if="gametype === 'jaipur'" v-bind:owner="owner" v-bind:opening="opening"></JaipurSetting>
            </div>
            <div class="col">
                <TableSeat v-bind:playersInfo="playersInfo"></TableSeat>
            </div>
        </div>
        <!-- 場主才有的功能 -->
        <div v-if="owner" class="row">
            <div class="col offset-md-4">
                <div v-if="!opening" @click="openPlayer()" class="btn btn-primary">
                    開放玩家
                </div>
                <div v-if="opening" @click="startGame()" class="btn btn-primary">
                    開始遊戲
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TableSeat from '@/components/TableSeat'
    // TODO 
    // 動態的更換這一個頁面
    import JaipurSetting from '@/page/gamepage/setting/JaipurSetting';

    export default {
        name: 'Room',

        props: [
            'gametype',
            'id',
        ],

        data () {
            return {
                conn: "",
                uuid: "",
                playersInfo: [
                    // {id: 1, name: "player"},
                    // {id: 2, name: "player2"},
                ],
                owner: false,
                opening: false,
                gameID: null,
            }
        },

        mounted() {
            // 從開始遊戲進來這邊id會是0
            console.log(this.id);
            if (this.id == '0') {
                this.createGame();
                this.owner = true;
            } else {
                this.roomInit();
            }
        },

        methods: {
            createGame() {
                let self = this;

                // 開新桌
                axios({
                    method: "get",
                    url: APIURL + '/api/creategame?game=' + this.gametype,
                    responseType: 'json',
                })
                .then(function (response) {
                    if (response.data.status == "success") {
                        self.gameID = response.data.data.gameID[0];
                        console.log(response.data.data.gameID[0]);
                        console.log(self.gameID);

                        self.roomInit();
                        return;
                    } 

                    // 有舊遊戲的情況
                    if (response.data.data.oldGameID > 0) {
                        let id = response.data.data.oldGameID[0]
                        window.location = BASE + "game/room/jaipur/" + id;
                        window.location.reload(true);
                        return;
                    }

                    // 應該是不會出現這個
                    // 有舊遊戲的session沒有被清掉
                    window.location = BASE + "gamelobby";
                })
                .catch(function (error) {
                    console.log(error);
                });  
            },

            roomInit() {
                // 連線ws
                this.conn = GAMEWS; 
                if (this.conn === null) {
                    this.open();
                }

                // init room的資料
                let self = this;
                axios({
                    method: 'get',
                    url: APIURL + '/api/game/roomInfo?id=' + this.gameID + '&game=' + this.gametype,
                })
                .then(function(response) {
                    if (response.data.status == "success") {
                        console.log(response.data);
                        self.playersInfo = response.data.players;
                        self.owner = response.data.owner
                        self.opening = response.data.opening
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });  
            },

            open() {
                let self = this
                this.conn = new WebSocket("ws://localhost:8989/ws?channel="+this.gametype+"&id="+this.gameID);
                console.log(this.conn);

                this.conn.onclose = function (evt) {
                    console.log(evt);
                    console.log("WebSocket Close");
                    this.conn = null
                };

                this.conn.onmessage = function (evt) {
                    console.log(evt.data);
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
                        self.opening = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            },

            startGame() {
                    
            },

            close() {
                this.conn.close();
            },
        },

        components: {
            TableSeat,
            JaipurSetting,
        }
    }
</script>

<style lang="scss" scoped>

</style>
