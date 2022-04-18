<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" v-if="currentPage !== 1">
                <a class="page-link" @click="getTodo(currentPage - 1)" style="cursor:pointer">Previous</a>
            </li>
            <li class="page-item" v-for="count in allPage" :key="count" :class="currentPage === count ? 'active': ''">
                <a class="page-link" @click="getTodo(count)" style="cursor:pointer">{{count}}</a>
            </li>
            <li class="page-item" v-if="currentPage !== allPage">
                <a class="page-link" @click="getTodo(currentPage + 1)" style="cursor:pointer">Next</a>
            </li>
        </ul>
    </nav>
</template>

<script>
    import { getCurrentInstance } from 'vue'
    export default {
        props : ['currentPage', 'allPage'],
        setup(){
            const {emit} = getCurrentInstance();
            const getTodo = (page) => {
                emit('page-show', page);
            }

            return{
                getTodo,
            }
        }
    }
</script>

<style>

</style>