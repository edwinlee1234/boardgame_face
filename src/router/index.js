import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home'
import GameLobby from '@/page/GameLobby'
import Room from '@/page/Room'
import Jaipur from '@/page/gamepage/game/Jaipur'
import Login from '@/page/user/Login'
import Register from '@/page/user/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/gamelobby',
      name: 'GameLobby',
      component: GameLobby,
    },
    {
      path: '/game/room/:gametype/:gameID',
      name: 'Room',
      component: Room,
      props: true,
    },    
    {
      path: '/game/view/jaipur/:gameID',
      name: 'Jaipur',
      component: Jaipur,
      props: true,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,      
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
  ]
})
