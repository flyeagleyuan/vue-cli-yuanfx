import Vue from 'vue';
import FastClick from 'fastclick';
import App from './App.vue';
import Loading from '@/components/uiLoading';
import { http } from '@/utils/http';
import 'normalize.css';

Vue.use(Loading);
Vue.use(http);

FastClick.attach(document.body);

new Vue({
  el: '#app',
  render: h => h(App),
});
