import { createApp } from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify';
import 'leaflet/dist/leaflet.css';
import store from './store/index.js'

import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap"
import route from './router.js'


  const app = createApp(App)
  app.use(vuetify)
  app.use(route)
  app.use(store)
  app.mount('#app')