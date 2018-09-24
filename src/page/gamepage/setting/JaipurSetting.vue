<template>
    <div id="setting">
        <h3>本桌設定</h3>
        <hr>
        <p>ELO 評比:</p>
        <select class="custom-select" id="ELO" :disabled="owner === false || roomState !== 'notOpen'">
            <option value="1">開</option>
            <option value="2">關</option>
        </select>
    </div>
</template>

<script>
    export default {
        name: 'Setting',

        props: [
            // 同時是owner & not opening才可以調設定值
            'owner',
            'roomState',
        ],

        data () {
            return {

            }
        },

        mounted() {
            // 去撈這款遊戲的設定
        },

        methods: {

        }
    }
</script>

<style lang="scss" scoped>
#setting {
    border: solid 1px;
    border-radius: 5px;
    padding: 15px;
}
</style>
