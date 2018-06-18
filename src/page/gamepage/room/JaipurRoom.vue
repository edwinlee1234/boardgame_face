<template>
    <div id="JaipurRoom">
        <h1>JaipurRoom</h1>
    </div>
</template>

<script>
    export default {
        name: 'JaipurRoom',

        data () {
            return {
                conn: "",
                uuid: "",
            }
        },

        mounted() {

        },

        methods: {
            open(channel) {
                let self = this
                this.conn = new WebSocket("ws://localhost:8989/ws?channel="+channel);
                console.log(this.conn);

                this.conn.onclose = function (evt) {
                    console.log(evt);
                    console.log("WebSocket Close");
                    this.conn = null
                };

                this.conn.onmessage = function (evt) {
                    console.log(evt.data)

                };
            },

            sendMsg(channel) {   
               if (this.conn.readyState !== 1) {
                    console.log("WS not ready");

                    return;
               }

                this.conn.send(this.msg2);
            },

            close() {
                this.conn.close();
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
