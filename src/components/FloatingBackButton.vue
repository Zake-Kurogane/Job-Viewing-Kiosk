<template>
  <q-btn
    label="Back to Home"
    color="green-8"
    text-color="white"
    rounded
    unelevated
    class="floating-back-btn"
    @click="goBack"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => {
  router.push('/start') // or '/' depending on your routing
}
</script>

<style scoped>
.floating-back-btn {
  position: fixed;
  bottom: 500px;
  left: 20px;
  z-index: 9999;
  pointer-events: auto;
  height: 5vh;
  width: 12vw;
  font-size: 20px;
}
</style>
