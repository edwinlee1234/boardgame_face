<template>
    <div id="Login">
      <form>
        <div class="form-group">
          <label for="exampleInputEmail1">User Name</label>
          <input type="text" class="form-control" v-model="userName" placeholder="User Name">
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" v-model="password" placeholder="Password">
        </div>
        <button type="button" class="btn btn-primary" @click.passive="login">Submit</button>
      </form>
    </div>
</template>

<script>
    export default {
        name: 'Login',

        data () {
            return {
              userName: '',
              password: ''
            }
        },

        methods: {
          login() {
            axios({
                method: "post",
                url: APIURL + '/api/user/login',
                responseType: 'json',
                data: {
                  userName: this.userName,
                  password: this.password                    
                }
            })              
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
            });
          }
        }
    }
</script>

<style lang="scss" scoped>
</style>
