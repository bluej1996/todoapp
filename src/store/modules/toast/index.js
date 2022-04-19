export default {
    namespaced:true,
    state: {
        // 메세지 및 타입 목록
        toasts: [],
        showToast : false,
    },
    mutations: {
        ADD_TOAST(state, payload){
            state.toasts.push(payload);
        },
        REMOVE_TOAST(state){
            state.toasts.shift();
        },
        UPDATE_TOAST_STATUS(state, payload) {
            state.showToast = payload;
        },
    },
    actions: {
        triggerToast({commit}, {message, type}){
            commit('UPDATE_TOAST_STATUS', true);
            commit('ADD_TOAST', {
                id: Date.now(),
                message, 
                type
            });

            setTimeout( () => {
                commit('UPDATE_TOAST_STATUS', false);
                commit('REMOVE_TOAST');
            }, 5000);
        }
    },
    getters: {
        toastSmileMessage(state){
            return state.toastMessage + "^-^";
        }
    }
}