<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang="scss">
.account {
  width: 100%;
  background-color: #ffd370;
  color: #333333;
  .box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90%;
    min-height: 100vh;
    margin: 0 auto;
    @media (max-width: 767px) {
      flex-direction: column;
      justify-content: start;
      width: 100%;
      padding: 49px 32px;
    }
  }
  .img {
    margin-bottom: 22px;
    @media (min-width: 992px) {
      margin: 0 103px 19px 0;
    }
    @media (min-width: 768px) and (max-width: 991px) {
      margin-right: 7%;
    }
  }
  .form {
    width: 100%;
    @media (min-width: 768px) {
      flex: 0 0 304px;
    }
  }
  .title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 34px;
    @media (max-width: 767px) {
      text-align: center;
    }
  }
  label {
    display: block;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  input {
    display: block;
    width: 100%;
    height: 47px;
    line-height: 47px;
    font-size: 16px;
    font-weight: 500;
    border: none;
    border-radius: 10px;
    background-color: #fff;
    margin-bottom: 6px;
    padding: 0 16px;
    &::placeholder {
      color: #9f9a91;
    }
  }
  small {
    display: block;
    font-size: 14px;
    font-weight: 700;
    color: #d87355;
    margin-bottom: 20px;
  }
  .btn {
    margin-top: 24px;
    text-align: center;
    button {
      cursor: pointer;
      display: inline-block;
      width: 128px;
      height: 47px;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      border-radius: 10px;
      border: 1px solid #333;
      background-color: #333;
      margin-bottom: 12px;
    }
    a {
      display: inline-block;
      width: 128px;
      height: 47px;
      font-size: 16px;
      line-height: 47px;
      font-weight: 700;
    }
  }
}
</style>
