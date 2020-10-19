import Vue from 'vue';
import Vuex from 'vuex';

import common from './module/common';
import user from './module/user';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        baseUrl: this.baseUrl
    },
    mutations: {},
    actions: {},
    modules: {
        common,
        user
    }
});

export default store;
