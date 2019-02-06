<template>
  <div id="app">
    <Nav></Nav>
    <router-view/>
  </div>
</template>

<script>
import Nav from '@/components/Nav'

export default {
  name: 'App',

  components: {
    Nav,
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      // Init user Info
      axios({
          method: 'get',
          url: APIURL + '/api/init',
          responseType: 'json',
      })              
      .then((response) => {
        if (response.data.status === 'success') {
          this.$store.dispatch('setUserInfo', response.data)
        } else {
          console.log('init ERROR')
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
  }
}
</script>

<style>

</style>
