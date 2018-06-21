import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home'
import GameLobby from '@/page/GameLobby'
import Room from '@/page/Room'

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
      path: '/game/room/:gametype/:id',
      name: 'Room',
      component: Room,
      props: true,
    },    

  ]
})
