<template>
    <div id="Home">
      <div class="container">
        <div class="row">
            <div class="col-8 box-xl">
              <h4>image1</h4>
            </div>
            <div class="col-4 box">
                <div class="row">
                    <div class="col-12 box-sm">
                      <h4>image2</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 box-sm">
                      <h4>image3</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
          <div class="col-8 announcement">
            <h4>公告</h4>
          </div>
          <div class="col-4 box-lg hero-board">
            <h3>積分最高的玩家</h3>
            <hr>
            <ul>
              <li>1: balbalbal</li>
              <li>2: balbalbal</li>
              <li>3: balbalbal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: 'Home',

        data () {
            return {
            }
        },

        mounted() {
          this.$store.dispatch('setUserInfo', {page: "home"})
        },

        methods: {

        }
    }
</script>

<style lang="scss" scoped>
%box {
  padding: 20px;
  border: solid 1px;
  border-radius: 5px;
}

#Home {
  margin-top: 30px;

  .box-sm {
    @extend %box;
    height: 250px;
  }

  .box-xl {
    @extend %box;
    height: 500px;
  }

  .box-lg {
    @extend %box;
    height: 400px;
  }

  .announcement {
    @extend %box;
    height: 650px;
  }
}
</style>
