<template>
    <div id="setting">
        <h2>Setting</h2>
        <input type="text">
    </div>
</template>

<script>
    export default {
        name: 'Home',

        props: [
            // 同時是owner & not opening才可以調設定值
            'owner',
            'opening',
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
</style>
