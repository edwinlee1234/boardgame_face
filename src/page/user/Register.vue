<template>
    <div id="Register">
      <div class="container">
        <div class="row">
          <div class="col-6">
            <div class="registerBox">
              <h2>註冊</h2>
              <form>
                <div class="form-group">
                  <label>User Name</label>
                  <input type="text" class="form-control" v-model="userName" placeholder="Email">
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <input type="password" class="form-control" v-model="password" placeholder="Password">
                </div>
                <button type="button" class="btn btn-primary" @click.passive="register">Sign in</button>
              </form> 
            </div>
          </div>
          <div class="col-6">
            <div class="socialForm">
              <h3>或者與社群做聯結註冊</h3>
              <div class="fbBox">
              </div>
              <div class="googleBox">
              </div>
            </div>
          </div>
        </div>
      </div>
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
              if (response.data.status === "success") {
                alert("註冊成功")
                this.$router.push('/login')
              }
            })
            .catch((error) => {
              console.log(error);
            });
          }
        }
    }
</script>

<style lang="scss" scoped>
#Register {
  margin-top: 30px;
  .registerBox {
    h2 {
      margin-bottom: 30px;
    }
    button {
      margin-top: 10px;
    }
  }

  .registerBox, .socialForm {
    padding: 30px;
    border: solid 1px;
    border-radius: 5px;
  }

  .socialForm {
    h3 {
      margin-bottom: 20px
    }
    .fbBox, .googleBox {
      display: inline-block;
      margin-right: 5px;
      margin-left: 5px;
      width: 80px;
      height: 80px;  
      background-size:cover; 
    }
    .fbBox{
      background-image: url('/static/images/fb_icon.png');
    }
    .googleBox{
      background-image: url('/static/images/google_icon.jpg');
    }
  }
}
</style>
