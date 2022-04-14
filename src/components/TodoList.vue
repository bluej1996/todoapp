<template>
    <div class="card mt-2" v-for="(todo, index) in todos" v-bind:key="todo.id">
        <div 
            class="card-body p-2 d-flex"
            @click="moveToPage(todo.id)"
            style="cursor:pointer"
        >
            <div class="flex-grow-1">
                <input 
                    class="ml-2 mr-2"
                    type="checkbox"                      
                    :checked="todo.complete" 
                    :id="todo.id" 
                    @change="toggleTodo(index, $event)"
                    @click.stop                    
                >
                <span 
                    class="form-check-label" 
                    :class="{ todocss : todo.complete }"                   
                >
                    {{ todo.subject }}
                </span>
            </div>
            <!-- 삭제버튼 -->
            <div>
                <button 
                    class="btn btn-danger btn-sm" 
                    @click.stop="openModal(todo.id)"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
    <!-- 경고창 -->
    <teleport to="#modal">
        <ModalWin 
            v-if="showModal" 
            @close="closeModal"
            @delete="deleteTodo"
        />
    </teleport>
</template>

<script>
    import { useRouter} from 'vue-router' 
    import ModalWin from '@/components/ModalWin.vue'
    import {ref} from 'vue'

    export default {
        components: {
            ModalWin
        },

        // props: ['todos']
        props: {
            todos: {
                type: Array,
                required: true
            }
        }, 

        emits: ['toggle-todo', 'delete-todo'],


        setup(props, {emit}){
            const todoDeleteId = ref(null);

            // 모달창 보여지는 상태
            const showModal = ref(false);
            const openModal = (index) => {
                showModal.value = true;
                todoDeleteId.value = index;
            }
            const closeModal = () => {
                showModal.value = false;
                todoDeleteId.value = null;
            }
            const router = useRouter();
            const toggleTodo = (index, event) => {
                emit('toggle-todo', index, event.target.checked);
            };
            const deleteTodo = () => {
                // 삭제 버튼 클릭시 보관해 두었던 값을 활용
                emit('delete-todo', todoDeleteId.value);
                showModal.value = false;
                todoDeleteId.value = null;
            };

            // 클릭된 id 를 전달한다.
            const moveToPage = (todoId) => {
                // console.log(todoId);
                // 아이디를 전달한다.
                // router.push('/todos/' + todoId);
                router.push({
                    name: 'Todo',
                    params: {
                        id: todoId
                    }
                });
            }

            return {
                toggleTodo,
                deleteTodo,
                moveToPage,

                showModal,
                openModal,
                closeModal
            }
        }
    }
</script>
<style>

</style>