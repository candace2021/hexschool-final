<script setup>
import { ref } from 'vue'
import validators from '@/utils/validators'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()

const content = ref({
  email: '',
  nickname: '',
  password: '',
  password2: '',
})

const validTxt = ref({
  email: '',
  nickname: '',
  password: '',
  password2: '',
})

const registerValid = async () => {
  const valid = validTxt.value
  valid.email = validators.email(content.value.email)
  valid.nickname = validators.nickname(content.value.nickname)
  valid.password = validators.password(content.value.password)
  valid.password2 = validators.password2(content.value.password2, content.value.password)

  if (!valid.email && !valid.nickname && !valid.password && !valid.password2) {
    const data = await api('post', '/users/sign_up', content.value)

    if (data !== undefined && data.status) {
      Swal.fire({
        title: '註冊成功',
        icon: 'success',
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login')
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
        <h2 class="title">註冊帳號</h2>
        <form>
          <div>
            <label for="">Email</label>
            <input type="text" placeholder="請輸入Email" v-model="content.email" />
            <small>{{ validTxt.email }}</small>
          </div>
          <div>
            <label for="">您的暱稱</label>
            <input type="text" placeholder="請輸入您的暱稱" v-model="content.nickname" />
            <small>{{ validTxt.nickname }}</small>
          </div>
          <div>
            <label for="">密碼</label>
            <input type="password" placeholder="請輸入密碼" v-model="content.password" />
            <small>{{ validTxt.password }}</small>
          </div>
          <div>
            <label for="">再次輸入密碼</label>
            <input type="password" placeholder="請再次輸入密碼" v-model="content.password2" />
            <small>{{ validTxt.password2 }}</small>
          </div>
        </form>
        <div class="btn">
          <button type="button" @click="registerValid()">註冊帳號</button>
          <br />
          <RouterLink to="/login">登入</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
