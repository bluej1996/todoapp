<template>
    <router-view />
    <div class="container">
        <!-- 타이틀 -->
        <AppTitle :apptitle="apptext" />
        <!-- 할일 검색 입력창 -->
        <input class="form-control" v-model="searchText" type="text" placeholder="Search Todo list"
            @keyup.enter="searchTodo">
        <!-- 에러 안내창 -->
        <ErrorBox :errtext="error" />
        <hr>
        <!-- 할일 추가 입력창 -->
        <TodoSimpleForm @add-todo="addTodo" />

        <!-- 목록없음 안내창 -->
        <div v-show="!todos.length" class="red">생성된 Todo 목록이 없습니다.</div>

        <!-- todo 목록창 -->
        <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" />

        <hr>
        <!-- 페이지네이션 -->
        <AppPagination :currentPage="nowPage" :allPage="numberOfPages" @page-show="getTodo" />
    </div>
</template>

<script>
    import {
        ref,
        computed,
        watch
    } from 'vue';
    import axios from 'axios'

    // src 폴더인 경우에만 @을 통해서 접근이 가능하다.
    import TodoSimpleForm from '@/components/TodoSimpleForm.vue'
    import TodoList from '@/components/TodoList.vue'
    import AppTitle from '@/components/AppTitle.vue'
    import ErrorBox from '@/components/ErrorBox.vue'
    import AppPagination from '@/components/AppPagination.vue'

    export default {

        components: {
            TodoSimpleForm,
            TodoList,
            AppTitle,
            ErrorBox,
            AppPagination
        },
        setup() {
            // 타이틀
            const apptext = ref('오늘 할일');

            // 할일 목록(배열)을 저장
            const todos = ref([]);

            // 에러 메시지 
            const error = ref('');

            // 페이지네이션 관련
            // 전체 todos 개수 필요
            const totalTodos = ref(0);
            // 한 화면당 보여울 todos
            const limit = 5;
            // 현재 보여주는 페이지 번호
            const nowPage = ref(1);
            // 총 페이지 숫자
            const numberOfPages = computed(() => {
                // 총 페이지 / 페이지당 출력수 올림
                return Math.ceil(totalTodos.value / limit)
            });

            // 할일 검색 관련 
            const searchText = ref('');
            let timeout = null;
            // 키보드의 Enter키를 입력하면 검색실행
            const searchTodo = () => {
                // 타미어 실행을 지워줌
                clearTimeout(timeout);
                // 검색 즉시 실행
                getTodo(1);
            }
            watch(searchText, () => {
                // 연속으로 검색어를 서버에 전달하는 과정을 제한
                // clearTimeout은 실행을 할려고 했던 명령을 취소한다.
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    getTodo(1)
                }, 2000)
            });

            // DB자료 불러오기
            const getTodo = async (page = nowPage.value) => {
                error.value = '';
                nowPage.value = page;
                try {
                    // 서버에서 자료를 요청을 진행 후에 결과를 res에서 받는다 (response)
                    const res = await axios.get(
                        `http://localhost:3000/todos?subject_like=${searchText.value}&_page=${page}&_limit=${limit}&_sort=id&_order=desc`
                        );
                    // 총 todos 개수 파악
                    totalTodos.value = res.headers["x-total-count"];
                    if (numberOfPages.value < nowPage.value) {
                        getTodo(nowPage.value - 1);
                        return;
                    }
                    // response 가 될때 res라는 객체에 .data 를 화면에 보여줌
                    todos.value = res.data;

                } catch (err) {
                    console.log(error);
                    error.value = "자료를 불러오는데 실패했습니다."
                }
            }
            // 최초에 데이터를 호출한다.
            getTodo();

            // TodoSimpleForm 에서  
            // add-todo 이벤트로 전달된 객체를 
            // 처리해 주는 콜백함수 
            const addTodo = async (추가되는할일) => {

                error.value = '';
                try {
                    // 데이터 베이스에 저장이 되어야 하는 데이터
                    await axios.post('http://localhost:3000/todos', {
                        subject: 추가되는할일.subject,
                        complete: 추가되는할일.complete
                    });

                    getTodo(1);

                } catch (err) {
                    console.log(err);
                    error.value = "서버 확인해 주세요.";
                }

            };

            const toggleTodo = async (index, checked) => {
                // complete를 업데이트 하겠다.
                // id를 통해서 내용을 업데이트
                error.value = '';
                const id = todos.value[index].id;
                try {
                    // 서버의 DB 를 업데이트 한다.
                    await axios.patch('http://localhost:3000/todos/' + id, {
                        complete: checked
                    });
                    // 웹브라우저의 todo 의 화면을 표현한다.
                    todos.value[index].complete = checked;

                } catch (err) {
                    console.log(err);
                    error.value = "업데이트에 실패하였습니다.";
                }
            }

            const deleteTodo = async (index) => {
                // console.log('지우기' + index);
                // 배열내에서 순서번호로 부터 1개 제거
                // todos.value.splice(index, 1);
                const id = todos.value[index].id;
                error.value = '';

                try {
                    // 전체 삭제가 아니라 id와 같은 DB를 삭제
                    await axios.delete('http://localhost:3000/todos/' + id);
                    getTodo(nowPage.value);

                } catch (err) {
                    console.log(err);
                    error.value = "삭제에 실패했습니다."
                }
            }

            return {
                todos,
                addTodo,
                toggleTodo,
                deleteTodo,

                searchText,
                searchTodo,

                error,
                nowPage,
                totalTodos,
                numberOfPages,
                getTodo,

                apptext,
            }
        }
    }
</script>

<style>
    .red {
        color: red;
    }

    .todocss {
        color: gray;
        text-decoration: line-through;
    }
</style>