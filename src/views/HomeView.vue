<script setup>
import api from '@/services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import cookie from '@/utils/cookie'
import { jwtDecode } from 'jwt-decode'
import { onMounted, ref } from 'vue'
import Loading from '@/components/LoadingBox.vue'

const router = useRouter()

const content = ref({
  content: '',
})
const todos = ref([])
const datas = ref([])
const todoEditor = ref({})
const isEditor = ref(false)
const isActive = ref('all')
const total = ref()
const isLoading = ref(true)

const token = cookie.get('token')
const decoded = jwtDecode(token)
const day = (decoded.exp - decoded.iat) / 60 / 60 / 24
cookie.set('token', token, day)

// 驗證
onMounted(async () => {
  const data = await api('get', '/users/checkout', { headers: { Authorization: token } })
  getTodos()
  if (data == false) {
    cookie.remove('token')
    router.push('/login')
  }
})

// 登出
const logout = async () => {
  isLoading.value = true
  try {
    const data = await api('post', '/users/sign_out', token, { headers: { Authorization: token } })
    cookie.remove('token')
    if (data !== undefined && data.status) {
      Swal.fire({
        title: '登出成功',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login')
        }
      })
    }
  } finally {
    isLoading.value = false
  }
}

// 取todo
const getTodos = async () => {
  try {
    const { data } = await api('get', '/todos/', { headers: { Authorization: token } })
    todos.value = data
    datas.value = data
    total.value = todos.value.filter((todo) => todo.status == false).length
    isOpen(isActive.value)
  } finally {
    isLoading.value = false
  }
}

// 新增todo
const addTodo = async () => {
  isLoading.value = true
  try {
    await api('post', '/todos/', content.value, { headers: { Authorization: token } })
    content.value.content = ''
    getTodos()
  } finally {
    isLoading.value = false
  }
}

// 狀態改變
const isChecked = async (id) => {
  isLoading.value = true
  try {
    await api('patch', `/todos/${id}/toggle`, id, { headers: { Authorization: token } })
    getTodos()
  } finally {
    isLoading.value = false
  }
}

// 修改todo
const editorTodo = (item) => {
  isEditor.value = true
  todoEditor.value = { ...item }
}
const editorSet = async () => {
  isLoading.value = true
  try {
    const res = {
      id: todoEditor.value.id,
      content: todoEditor.value.content,
    }
    await api('put', `/todos/${todoEditor.value.id}`, res, { headers: { Authorization: token } })
    isEditor.value = false
    getTodos()
  } finally {
    isLoading.value = false
  }
}

// 刪除todo
const deleteTodo = (id) => {
  Swal.fire({
    title: '確認要刪除?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
  }).then(async (result) => {
    if (result.isConfirmed) {
      isLoading.value = true
      try {
        await api('delete', `/todos/${id}`, { headers: { Authorization: token } })
        getTodos()
      } finally {
        isLoading.value = false
      }
    }
  })
}

// 頁籤
const isOpen = (item) => {
  isActive.value = item
  if (item == 'all') return (todos.value = datas.value)
  if (item == 'unDone') {
    todos.value = datas.value.filter((data) => data.status == false)
  } else {
    todos.value = datas.value.filter((data) => data.status == true)
  }
}
</script>

<template>
  <div class="home">
    <header>
      <div class="img">
        <img src="@/assets/images/logo.png" alt="logo" />
      </div>
      <div class="box">
        <p>{{ decoded.nickname }}的代辦</p>
        <button type="button" @click="logout()">登出</button>
      </div>
    </header>
    <div class="todoBox">
      <div class="search">
        <input type="text" placeholder="新增待辦事項" v-model="content.content" />
        <button type="button" @click="addTodo()"><span></span></button>
      </div>
      <div class="todos" v-if="datas.length > 0">
        <div class="btn">
          <button type="button" :class="{ active: isActive == 'all' }" @click="isOpen('all')">
            全部
          </button>
          <button type="button" :class="{ active: isActive == 'unDone' }" @click="isOpen('unDone')">
            待完成
          </button>
          <button type="button" :class="{ active: isActive == 'done' }" @click="isOpen('done')">
            已完成
          </button>
        </div>
        <div class="item">
          <template v-if="todos.length > 0">
            <div class="list" v-for="todo in todos" :key="todo.id">
              <div class="input">
                <input
                  type="checkbox"
                  name=""
                  :id="todo.id"
                  :checked="todo.status"
                  @click="isChecked(todo.id)"
                />
                <label :for="todo.id">{{ todo.content }}</label>
              </div>
              <div class="listBtn">
                <button type="button" class="editor" @click="editorTodo(todo)">
                  <img src="@/assets/images/editor.png" alt="editor" />
                </button>
                <button type="button" class="delete" @click="deleteTodo(todo.id)">
                  <img src="@/assets/images/close.png" alt="delete" />
                </button>
              </div>
            </div>
          </template>
          <div class="noList" v-else>目前尚無事項</div>
        </div>
        <div class="total">{{ total }} 個待完成項目</div>
      </div>
      <div class="noTodo" v-else>
        <p>目前尚無待辦事項</p>
        <img src="@/assets/images/empty.png" alt="" />
      </div>
    </div>
    <div class="editorBox" v-if="isEditor">
      <div class="editorContent">
        <p>修改的 Todo 內容</p>
        <input type="text" v-model="todoEditor.content" />
        <div class="btn">
          <button type="button" @click="editorSet()">確認</button>
          <button type="button" class="white" @click="isEditor = false">取消</button>
        </div>
      </div>
    </div>
    <template v-if="isLoading">
      <Loading />
    </template>
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  background: url('../assets/images/bg.png') center bottom / cover no-repeat;
  @media (max-width: 767px) {
    background: #ffd370;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 16px 34px;
    @media (max-width: 767px) {
      padding: 16px 32px;
    }
    .box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    p {
      font-size: 16px;
      font-weight: 700;
      margin-right: 12px;
      @media (max-width: 767px) {
        display: none;
      }
    }
    button {
      cursor: pointer;
      font-size: 16px;
      border: none;
      background-color: transparent;
      padding: 5px 12px;
      @media (max-width: 767px) {
        font-size: 14px;
        padding: 5px 0 5px 5px;
      }
    }
  }
}
.todoBox {
  max-width: 500px;
  margin: 0 auto;
  @media (max-width: 767px) {
    padding: 0 32px;
  }
  .search {
    position: relative;
    width: 100%;
    margin: 24px 0 16px;
    input {
      width: 100%;
      height: 47px;
      line-height: 47px;
      font-size: 16px;
      font-weight: 500;
      border: none;
      border-radius: 10px;
      background-color: #fff;
      padding: 0 16px;
      &::placeholder {
        color: #9f9a91;
      }
    }
    button {
      cursor: pointer;
      position: absolute;
      top: 4px;
      right: 4px;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 10px;
      background-color: #333;
      &::before {
        content: '';
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 20px;
        background-color: #fff;
        border-radius: 5px;
      }
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        width: 20px;
        height: 4px;
        background-color: #fff;
        border-radius: 5px;
      }
    }
  }
  .todos {
    width: 100%;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 15px rgba(#000, 0.15);
  }
  .btn {
    display: flex;
    align-items: center;
    button {
      cursor: pointer;
      flex: 0 0 calc(100% / 3);
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      border: none;
      background: transparent;
      border-bottom: 2px solid #efefef;
      &.active {
        border-bottom: 2px solid #333;
      }
    }
  }
  .item {
    max-height: 300px;
    overflow-y: auto;
    padding: 7px 18px 0 24px;
    .list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e5e5e5;
    }
    .input {
      position: relative;
      width: 100%;
      input {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        pointer-events: none;
        &:checked + label {
          color: #9f9a91;
          text-decoration: line-through;
          &::before {
            opacity: 0;
          }
          &::after {
            opacity: 1;
          }
        }
      }
      label {
        position: relative;
        cursor: pointer;
        display: inline-block;
        width: 100%;
        padding: 16px 0 16px 36px;
        font-size: 14px;
        transition: opacity 0.5s;
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border-radius: 5px;
          border: 1px solid #9f9a91;
          transition: opacity 0.5s;
        }
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 2px;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          background: url('../assets/images/check.png') center / contain no-repeat;
          transition: opacity 0.5s;
          opacity: 0;
        }
      }
    }
    .noList {
      font-size: 14px;
      text-align: center;
      padding: 16px 0;
    }
    .listBtn {
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        cursor: pointer;
        display: inline-block;
        padding: 8px 0 8px 8px;
        border: none;
        background: transparent;
        transition: opacity 0.5s;
        &:hover {
          @media (min-width: 992px) {
            opacity: 0.4;
          }
        }
      }
      img {
        max-width: 18px;
      }
      .editor img {
        max-width: 22px;
      }
    }
  }
  .total {
    font-size: 14px;
    border-bottom: none;
    padding: 24px 0 32px 24px;
  }
  .noTodo {
    margin-top: 63px;
    p {
      font-size: 16px;
      text-align: center;
      margin-bottom: 20px;
    }
    img {
      max-width: 240px;
      margin: 0 auto;
    }
  }
}
.editorBox {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  .editorContent {
    width: 350px;
    max-width: calc(100% - 32px);
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
  }
  p {
    font-size: 16px;
    margin-bottom: 15px;
  }
  input {
    width: 100%;
    height: 47px;
    line-height: 47px;
    border-radius: 10px;
    border: 1px solid #333;
    background-color: transparent;
    padding: 0 16px;
    font-size: 16px;
    font-weight: 500;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    button {
      cursor: pointer;
      width: 80px;
      height: 38px;
      line-height: 36px;
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      color: #fff;
      background: #333;
      margin: 0 5px;
      border-radius: 5px;
      border: 1px solid #333;
      &.white {
        color: #333;
        background: #fff;
      }
    }
  }
}
</style>
