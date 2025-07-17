<template>
  <q-page class="website-view">
    <!-- IFRAME: Fullscreen and interactive -->
    <iframe src="https://tagumcity.gov.ph/cpescdo/" frameborder="0" class="website-iframe"></iframe>

    <!-- Floating Back to Menu Button -->
    <FloatingBackButton />
  </q-page>
</template>

<script setup>
import FloatingBackButton from 'components/FloatingBackButton.vue'
</script>

<style scoped>
.website-view {
  position: relative;
  width: 1080px;
  height: 1920px;
  background-color: #b9f7c4;
  overflow: hidden;
}

.website-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
