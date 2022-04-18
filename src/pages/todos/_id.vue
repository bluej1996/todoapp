<template>    
    <h1>할일 내용 수정</h1>
    <TodoForm :editing="true" @update-todo="updateTodo"/>
</template>

<script>
import { getCurrentInstance } from 'vue'
import TodoForm from '@/components/TodoForm.vue'
export default{
    components: {
        TodoForm
    },
    emits: ['update-todo-toast'],
    setup() {
        const {emit} = getCurrentInstance();
        const updateTodo = () => {
            emit('update-todo-toast', {})
        }
        return {
            updateTodo
        }
    }
}
</script>

<style>
</style>