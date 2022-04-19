<template>
    <div class="toast-box">
        <!-- slide transition 걸기 -->
        <transition-group name="slide">
            <div 
                v-for:="item in toasts"
                :key="item.id"
                class="alert" 
                :class="`alert-${item.type}`" 
                role="alert"
            >
            {{ item.message }}
            </div>
        </transition-group>
    </div>
</template>
<script>
    import { useToast } from '@/composables/toast.js'
    export default {
        setup() {
            const {toasts} = useToast();
            return {
                toasts
            }
        }
    }
</script>
<style scoped>
    .toast-box {
        position: fixed;
        top: 30px;
        right: 10px;
    }
    .slide-enter-active,
    .slide-leave-acvice{
        transition: all 0.5s ease;
    }
    .slide-enter-from,
    .slide-leave-to{
        opacity: 0;
        transition: translateY(-30px);
    }
    .slide-enter-to,
    .slide-leave-from{
        opacity: 1;
        transition: translateY(0px);
    }
</style>