import Vue from 'vue';
import App from './App.vue';
import Loading from '@/components/uiLoading';
import { http } from '@/utils/http';
import 'normalize.css';

Vue.use(Loading);
Vue.use(http);

new Vue({
  el: '#app',
  render: h => h(App),
});
