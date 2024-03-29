import Vue from "vue";
import Vuetify from 'vuetify'
Vue.use(Vuetify)

import App from "./App.vue";
import 'vuetify/dist/vuetify.min.css'
Vue.config.productionTip = false;

new Vue({
	render: h => h(App)
}).$mount("#app");