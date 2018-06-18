import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home'
import GameLobby from '@/page/GameLobby'
import JaipurRoom from '@/page/gamepage/room/JaipurRoom'

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
      path: '/game/room/jaipur',
      name: 'JaipurRoom',
      component: JaipurRoom,
    },    

  ]
})
