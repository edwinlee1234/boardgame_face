<template>
    <div id="jaipur-game-page">
        <div class="action-bar" v-if="this.userID == actionPlayer">
            <div class="action-btn" v-for="(action, index) in actionChoose" :key="index">
                <button type="button" class="btn btn-primary" @click="playerAction(action)">{{action}}</button>
            </div>
        </div>
        <div id="game-canvas">
            <div class="card-point">
                <div class="diamond" v-if="cardsPoint">
                    <div class="point">
                        <span>diamond: </span>
                        <span v-for="(point ,index) in cardsPoint.diamond" :key="index">
                            {{ point }}
                        </span>
                    </div>
                </div>    
                <div class="gold" v-if="cardsPoint">
                    <div class="point">
                        <span>Gold: </span>
                        <span v-for="(point ,index) in cardsPoint.gold" :key="index">
                            {{ point }}
                        </span>
                    </div>
                </div> 
                <div class="sliver" v-if="cardsPoint">
                    <div class="point">
                        <span>sliver: </span>
                        <span v-for="(point ,index) in cardsPoint.sliver" :key="index">
                            {{ point }}
                        </span>
                    </div>                  
                </div>
                <!-- <div class="bonus" v-if="cardsPoint">
                    <span v-for="point in cardsPoint.leather" v-bind:key="point">
                        {{ point }}
                    </span>                     
                </div> -->
                <div class="cloth" v-if="cardsPoint">
                    <div class="point">
                        <span>cloth: </span>
                        <span v-for="(point ,index) in cardsPoint.cloth" :key="index">
                            {{ point }}
                        </span>
                    </div>                      
                </div>
                <div class="spice" v-if="cardsPoint">
                    <div class="point">
                        <span>spice: </span>
                        <span v-for="(point ,index) in cardsPoint.spice" :key="index">
                            {{ point }}
                        </span>
                    </div>                     
                </div>
                <div class="leather" v-if="cardsPoint">
                    <div class="point">
                        <span>leather: </span>
                        <span v-for="(point ,index) in cardsPoint.leather" :key="index">
                            {{ point }}
                        </span>
                    </div>                     
                </div>
            </div>
            <div class="fold-card">
                <h3>{{ foldCardNum }}</h3>
            </div>
            <div class="cards">
                <div class="opponent">
                    <span class="card-img" v-for="index in opponentCardNum" :key="index">

                    </span>

                    <div class="camel-img" v-if="opponentHaveCamel">
                        <p>Camel</p>
                    </div>
                </div>
                <div class="desk-card">
                    <span class="card-img" v-for="(card, index) in deskCard" :key="index" @click="toggleCard('desk', index)" :class="{selected: selectedDeskCard.indexOf(index) !== -1}">
                        {{ card }}
                    </span>
                </div>
                <div class="self-card">
                    <span class="card-img" v-for="(card, index) in card" :key="index" @click="toggleCard('selfCard', index)" :class="{selected: selectedSelfCard.indexOf(index) !== -1}">
                        {{ card }}
                    </span>
                    <div>
                        <span class="camel-img" v-for="index in camel" @click="toggleCard('camel', index)" :class="{selected: selectedCamelCard.indexOf(index) !== -1}">
                            Camel
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div id="user-info">
            <div class="user">
                <div class="player" v-for="(player, index) in players" :key="index">
                    <p>{{ player.name }}</p>
                    <span v-if="player.id == actionPlayer">*</span>
                    <div v-if="player.id == userID">
                        <div>Point: {{ point }}</div>
                        <span v-for="(point, index) in bonus" :key="index">
                            {{ point }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="info">

            </div>
        </div>

        <div class="win" v-if="gameOver">
            
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: 'Jaipur',

        props: [
            'gameID',
        ],

        computed: {
            ...mapGetters({
                userID: 'getUserID',
            })
        },

        data () {
            return {
                conn: null,
                actionPlayer: null,
                cardsPoint: null,
                deskCard: null,
                foldCardNum: null,
                opponentCardNum: null,
                opponentHaveCamel: null,
                bonus: [],
                camel: 0,
                card: [],
                point: 0,
                players: [],
                selectedDeskCard: [],
                selectedSelfCard: [],
                selectedCamelCard: [],
                actionChoose: [],
                gameOver: false,
                gameOverInfo: [],
            }
        },

        mounted() {
            this.open()

            // Test
            this.actionChoose = ["take", "sell", "switch"]
        },

        methods: {
            playerAction(type) {
                if (this.userID != this.actionPlayer) {
                    alert("不是你的行動回合")
                    return
                }

                switch(type) 
                {
                    case "take":
                        this.takeCard();
                        break;
                    case "sell":
                        this.sellCard();
                        break;
                    case "switch":
                        this.switchCard();
                        break;
                }
            },

            takeCard() {
                if (this.selectedDeskCard.length !== 1) {
                    alert("請選擇桌上的一張卡")
                    return
                }

                if ((this.card.length + 1 > 7) && this.deskCard[this.selectedDeskCard[0]] !== "camel") {
                    alert("最多只能有7張手牌")
                    return
                }

                let payload = {
                    "type": "take",
                    "take": this.selectedDeskCard[0],
                    "sell": [],
                    "switchSelfCard": [],
                    "switchTargetCard": [],
                }

                this.actionAjax(payload)
                this.clearSelected()             
            },

            sellCard() {
                if (this.selectedSelfCard.length <= 0) {
                    alert("請選擇手牌")
                    return
                }

                // 有三種牌一定要填兩張以上
                let type = this.card[this.selectedSelfCard[0]]
                if ((type === 'gold' || type === "sliver" || type === "diamond") && this.selectedSelfCard.length < 2) {
                    alert(type + "最少要兩張以上才可以賣")
                    return
                }

                // 判斷相同牌
                for(let i = 0; i < this.selectedSelfCard.length; i++) {
                    if (type !== this.card[this.selectedSelfCard[i]]) {
                        alert("同時只可以賣一樣的牌")
                        return
                    }
                }

                let payload = {
                    "type": "sell",
                    "take": null,
                    "sell": this.selectedSelfCard,
                    "switchSelfCard": [],
                    "switchTargetCard": [],
                }

                this.actionAjax(payload)
                this.clearSelected()
            },

            switchCard() {
                if ((this.selectedSelfCard.length + this.selectedCamelCard.length)< 2 || this.selectedDeskCard.length < 2) {
                    alert("手牌跟場上的牌最少要交換兩張")
                    return
                }

                if ((this.selectedSelfCard.length + this.selectedCamelCard.length) !== this.selectedDeskCard.length) {
                    alert("交換牌數要一樣")
                    return                   
                }

                // 用camel來交換，手牌不可大於7張
                let haveCamel = (this.selectedCamelCard.length > 0)
                if (haveCamel && this.selectedCamelCard.length + this.card.length > 7) {
                    alert("手牌不可大於7張")
                    return                     
                }

                // 交換到的不可以是一樣的
                for (let i = 0; i < this.selectedSelfCard.length; i++) {
                    for (let j = 0; j < this.selectedDeskCard.length; j++) {
                        if (this.card[this.selectedSelfCard[i]] === this.deskCard[this.selectedDeskCard[j]]) {
                            alert("交換牌不可以有一樣的")
                            return                        
                        }
                    }                   
                }

                // camel交換camel
                if (haveCamel) {
                    for (let i = 0; i < this.selectedDeskCard.length; i++) {
                        if ("camel" === this.deskCard[this.selectedDeskCard[i]]) {
                            alert("交換牌不可以有一樣的")
                            return 
                        }  
                    }
                }

                // ***特殊邏輯！交換camel都把值都變成-1傳後端***
                for (let i = 0; i < this.selectedCamelCard.length; i++) {
                    this.selectedCamelCard[i] = -1
                }

                let payload = {
                    "type": "switch",
                    "take": 0,
                    "sell": [],
                    "switchSelfCard": this.selectedSelfCard.concat(this.selectedCamelCard),
                    "switchTargetCard": this.selectedDeskCard,
                }

                this.actionAjax(payload)
                this.clearSelected()
            },

            clearSelected() {
                this.selectedSelfCard = []
                this.selectedDeskCard = []
                this.selectedCamelCard = []
            },

            actionAjax(payload) {
                axios({
                    method: 'POST',
                    url: APIURL + '/api/game/jaipur/action',
                    data: payload,
                })
                .then((res) => {
                    console.log(res)
                })
                .catch(function (error) {
                    console.log(error);
                }); 
            },

            toggleCard(type, index) {
                let card = []

                if (type === 'desk') {
                    card = this.selectedDeskCard
                }

                if (type === 'selfCard') {
                    card = this.selectedSelfCard
                }

                if (type === "camel") {
                    card = this.selectedCamelCard
                }

                let position = card.indexOf(index)
                if (position === -1) {
                    card.push(index)
                } else {
                    card.splice(position, 1)
                }
            },

            getGameInfo() {
                // init game的資料
                axios({
                    method: 'get',
                    url: APIURL + '/api/game/info?id=' + this.gameID,
                })
                .then((res) => {
                    if (res.data.status === "success") {
                        this.players = res.data.data.players
                    }
                })
                .catch(function (error) {
                    console.log(error)
                });  
            },

            async open() {
                this.conn = GAMEWS

                if (this.conn === null) {
                    this.conn = await new WebSocket("ws://" + WSURL + "/ws?channel=jaipur&id="+this.gameID)
                }
                console.log(this.conn)

                // 要連線了再打這API
                this.getGameInfo()

                this.conn.onclose = (evt) => {
                    console.log(evt)
                    console.log("WebSocket Close")
                    this.conn = null
                    GAMEWS = null
                };

                this.conn.onmessage = (evt) => {
                    let res = JSON.parse(evt.data);

                    if (res.event == "Info") {
                        this.actionPlayer = res.info.actionPlayer
                        this.cardsPoint = res.info.cardsPoint 
                        this.deskCard = res.info.deskCard 
                        this.foldCardNum = res.info.foldCardNum

                        this.reverseCardPoint()

                        return
                    }

                    if (res.event == "UserInfo") {
                        this.bonus = res.player_info.bonus
                        this.camel = res.player_info.camel
                        this.point = res.player_info.point
                        this.opponentCardNum = res.opponentPlayer.cardNum
                        this.opponentHaveCamel = res.opponentPlayer.haveCamel

                        if (res.player_info.card == null) {
                            this.card = []
                        } else {
                            this.card = res.player_info.card
                        }

                        return
                    }

                    if (res.event == "TakeCardPublic") {
                        // 更新桌上的卡
                        this.deskCard = res.info.deskCard
                        this.actionPlayer = res.info.actionPlayer
                        this.foldCardNum = res.info.foldCardNum

                        return
                    }

                    if (res.event == "TakeCardPrivate") {
                        // 更新自已的卡
                        this.card = res.info.card
                        this.camel = res.info.camel

                        return
                    }

                    if (res.event == "SwitchEventPublic") { 
                        this.deskCard = res.info.deskCard
                        this.actionPlayer = res.info.actionPlayer

                        return
                    }

                    if (res.event == "SwitchEventPrivate") {
                        this.card = res.info.card
                        this.camel = res.info.camel

                        return
                    }

                    if (res.event == "SellEventPublic") {
                        this.actionPlayer = res.info.actionPlayer
                        this.cardsPoint = res.info.cardsPoint
                        this.reverseCardPoint()

                        return
                    }

                    if (res.event == "SellEventPrivate") {
                        if (res.info.bonus > 0) {
                            this.bonus.push(res.info.bonus)
                        }
                        
                        if (res.info.card == null) {
                            this.card = []
                        } else {
                            this.card = res.info.card
                        }

                        this.point = res.info.point

                        return
                    }

                    if (res.event == "OpponentChangeEvent") {
                        this.opponentCardNum = res.opponentPlayer.cardNum
                        this.opponentHaveCamel = res.opponentPlayer.haveCamel
                    }

                    // 遊戲結束的Event
                    if (res.event == "GameOverEvent") {
                        let winnerID = res.info.winnerID
                        let camelBonusWinnerID = res.info.camelBonusWinnerID
                        let players = res.info.players

                        this.gameOver = true

                        // player資料
                        for (let i = 0; i < players.length; i++) {
                            for (let j = 0; j < this.players.length; j++) {
                                if (players[i].id == this.players[j].id) {
                                    this.gameOverInfo.push({
                                        userName: this.players[j].name,
                                        point: players[i].point,
                                        winner: this.players[j].id == winnerID,
                                    })
                                }
                            }
                        }
                        console.log(this.gameOverInfo)
                    }
                };
            },

            getPos(el) {
                for (let lx=0, ly=0;
                    el != null;
                    lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
                    return {x: lx,y: ly}
            },

            moveBox() {
                let newBox = document.createElement("div")
                newBox.className = 'obj'
                document.querySelector(".stack").appendChild(newBox)

                let position = getPos(document.querySelector('.box'))

                anime({
                    targets: '.obj',
                    translateX: (position.x - 6.2),
                    translateY: (position.y - 6.2),
                    duration: 1500,
                    easing: 'linear',
                });

                setTimeout(() => {
                    document.querySelector('.obj').remove()
                }, 1800)
            },

            reverseCardPoint() {
                // 把array倒序顯示用
                this.cardsPoint.diamond.reverse()
                this.cardsPoint.leather.reverse()
                this.cardsPoint.spice.reverse()
                this.cardsPoint.gold.reverse()
                this.cardsPoint.sliver.reverse()
                this.cardsPoint.cloth.reverse()
            },
        }
    }
</script>

<style lang="scss" scoped>
*{
    border: solid 1px;
}

.selected {
    border: solid 1px red;
}

.action-bar {
    position: absolute;
    display: inline-block;
    top: 0px;
    left: 50%;
    width: 500px;
    height: 50px;
    z-index: 1;
    background-color: grey;
    margin-left: -250px;
    font-size: 20px;

    .action-btn{
        display: inline-block;
        cursor: pointer;
    }
}

#jaipur-game-page{
    vertical-align: top;
    
    border: solid 1px;
    #game-canvas{
        position: relative;
        display: inline-block;
        height: 800px;
        width: 1400px;
        vertical-align: top;

        .card-point{
            vertical-align: top;
            display: inline-block;
            height: 100%;
            width: 300px;

            .point {
                height: 100px;
            }
        }
        .fold-card{
            display: inline-block;
            height: 100%;
            width: 200px;
        }
        .cards{
            display: inline-block;
            height: 100%;
            width: 800px;
            vertical-align: top;
            .card-img{
                display: inline-block;
                position: relative;
                height: 100px;
                width: 80px;
            }

        }
    }

    #user-info{
        vertical-align: top;
        display: inline-block;
        width: 200px;
        height: 600px;
    }

    .card-point{
        height: 40px;
        width: 40px;
    }

    .camel-img {
        display: inline-block;
        width: 50px;
        height: 70px;
    }
}
</style>
