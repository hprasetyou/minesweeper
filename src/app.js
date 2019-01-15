import 'flowchart.js';
import './less/style.less';
import 'bootstrap-less-port/less/bootstrap.less';
import 'font-awesome/css/font-awesome.css';

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);

Vue.component('field', require('./components/Field.vue').default);
new Vue({
  el: '#main'
})
