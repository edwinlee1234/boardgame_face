<template>
    <div id="TableSeat">
        <div class="row">
            <div class="col-12">
                <h2>本桌玩家</h2>
            </div>
        </div>
        <div 
        v-for="player in playersInfo" 
        v-bind:key="player.id" 
        v-bind:player="player"
        class="row">
            <div class="col-12">
                <div class="row" :id="player.id">
                    <div class="col">
                        <p>{{player.name}}</p>
                    </div>
                </div>
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

</style>
