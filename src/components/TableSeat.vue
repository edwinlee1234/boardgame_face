<template>
    <div id="TableSeat">
        <div class="row">
            <div class="col-12">
                <h2>本桌玩家</h2>
            </div>
        </div>
        <hr>
        <div 
        v-for="player in playersInfo" 
        v-bind:key="player.id" 
        v-bind:player="player"
        :id="player.id"
        class="row">
            <div class="col userRow">
                <p>玩家: {{player.name}}</p>
            </div>
            <hr>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'TableSeat',

        props: [
            'playersInfo',
        ],

        data () {
            return {
                
            }
        },

        mounted() {
            console.log(this.playersInfo);
        },

        methods: {
        }
    }
</script>

<style lang="scss" scoped>
#TableSeat {
    border: solid 1px;
    border-radius: 5px;
    padding: 15px;
    .userRow {
        border: solid 1px;
        border-radius: 5px;
        padding: 5px;
        margin: 6px;
    }
}
</style>
