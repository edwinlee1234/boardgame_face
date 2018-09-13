<template>
    <div id="Register">
      <form>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="inputEmail4">User Name</label>
            <input type="text" class="form-control" v-model="userName" placeholder="Email">
          </div>
          <div class="form-group col-md-6">
            <label for="inputPassword4">Password</label>
            <input type="password" class="form-control" v-model="password" placeholder="Password">
          </div>
        </div>
        <button type="button" class="btn btn-primary" @click.passive="register">Sign in</button>
      </form>        
    </div>
</template>

<script>
    export default {
        name: 'Register',

        data () {
            return {
              userName: '',
              password: ''
            }
        },

        mounted() {

        },

        methods: {
          register() {
            axios({
                method: "post",
                url: APIURL + '/api/user/register',
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
