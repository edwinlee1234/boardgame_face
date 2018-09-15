<template>
    <div id="Login">
      <div class="container">
        <div class="loignBox">
          <div class="loignForm">
            <h2>Login</h2>
            <br>
            <form>
              <div class="form-group">
                <label>User Name</label>
                <input type="text" class="form-control" v-model="userName" placeholder="User Name">
              </div>
              <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" v-model="password" placeholder="Password">
              </div>
              <button type="button" class="btn btn-primary" @click.passive="login">Submit</button>
            </form>
          </div>
          <div class="socialForm">
            <h3>或者與社群做聯結登入</h3>
            <div class="fbBox">
            </div>
            <div class="googleBox">
            </div>
          </div>
        </div>

      </div>

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
              if (response.data.status === "success") {
                alert("登入成功")
                window.location = BASE + "gamelobby"
                window.location.reload(true);
              }
            })
            .catch((error) => {
              console.log(error)
            });
          }
        }
    }
</script>

<style lang="scss" scoped>
.loignBox{
  padding: 40px;
  border: solid 1px;
  border-radius: 10px;
  margin-top: 30px;
  width: 100%;

  button {
    margin-top: 10px;
    width: 180px;
  }

  h3 {
    margin-bottom: 20px
  }

  .socialForm {
    border-top: solid 1px;
    margin-top: 30px;
    padding-top: 30px;

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
