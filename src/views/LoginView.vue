<script setup>
import { ref } from 'vue'
import validators from '@/utils/validators'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const content = ref({
  email: '',
  password: '',
})

const validTxt = ref({
  email: '',
  password: '',
})

const registerValid = async () => {
  const valid = validTxt.value
  valid.email = validators.email(content.value.email)
  valid.password = validators.password(content.value.password)

  if (!valid.email && !valid.password) {
    const data = await api('post', '/users/sign_in', content.value)
    if (data !== undefined && data.status) {
      Swal.fire({
        title: '登入成功',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/')
        }
      })
    }
  }
}
</script>

<template>
  <div class="account">
    <div class="box">
      <div class="img pc">
        <img src="@/assets/images/left.png" alt="online todo list" />
      </div>
      <div class="img mo">
        <img src="@/assets/images/logo_lg.png" alt="online todo list" />
      </div>
      <div class="form">
        <h2 class="title">最實用的線上代辦事項服務</h2>
        <form>
          <div>
            <label for="">Email</label>
            <input type="text" placeholder="請輸入Email" v-model="content.email" />
            <small>{{ validTxt.email }}</small>
          </div>
          <div>
            <label for="">密碼</label>
            <input type="password" placeholder="請輸入密碼" v-model="content.password" />
            <small>{{ validTxt.password }}</small>
          </div>
        </form>
        <div class="btn">
          <button type="button" @click="registerValid()">登入</button>
          <br />
          <RouterLink to="/register">註冊帳號</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
