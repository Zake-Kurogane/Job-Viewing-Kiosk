<template>
  <q-page class="start-menu q-pa-none">
    <!-- Top Section -->
    <div class="top-section">
      <div class="top-content">
        <div class="top-logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/3/33/Ph_seal_Tagum.png"
            alt="TagumLogo"
            class="logo logo-left"
          />
          <img
            src="https://res.cloudinary.com/dxpsvvhsj/image/upload/v1747641032/tttoh5kmfdieo2idmbd7.png"
            alt="CPESCDOlogo"
            class="logo logo-right"
          />
        </div>

        <div class="welcome-title">WELCOME TO</div>
        <div class="agency-name">
          City Public Employment Services<br />
          and Capability Development Office's
        </div>
        <div class="kiosk-label">KIOSK</div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="bottom-section">
      <div class="columns-wrapper">
        <!-- Left Column -->
        <div class="column items-center text-center text-white q-gutter-sm">
          <div class="job-title">Are you<br />looking for a job?</div>

          <q-btn
            label="View Jobs Available"
            color="white"
            text-color="black"
            class="menu-btn"
            @click="goToJobs"
          />
        </div>

        <!-- Center Divider -->
        <div class="column items-center text-white q-gutter-sm">
          <div class="or-label">or</div>
          <div class="divider-vertical"></div>
        </div>

        <!-- Right Column -->
        <div class="column items-center text-center text-white q-gutter-sm">
          <div class="job-title">Want to learn<br />more about us?</div>
          <q-btn
            label="Visit Our Website"
            color="white"
            text-color="black"
            class="menu-btn"
            @click="goToWebsite"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goToJobs = () => {
  router.push('/kiosk')
}
const goToWebsite = () => {
  router.push('/website')
}
</script>

<style scoped>
.start-menu {
  width: 1080px;
  height: 1920px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ─── TOP SECTION #0a9f50 ─── */
.top-section {
  height: 1400px;
  background:
    linear-gradient(rgba(10, 159, 80, 0.85), rgba(10, 159, 80, 0.85)),
    url('src/assets/cityhall.jpg') center center / cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}
.top-content {
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.welcome-title {
  font-size: 70px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-top: 100px;
}
.agency-name {
  font-size: 50px;
  font-weight: 700;
  line-height: 1.4;
  margin: 20px 0;
}
.kiosk-label {
  font-size: 100px;
  font-weight: 700;
  margin-top: 10px;
}

/* ─── BOTTOM SECTION ─── */
.bottom-section {
  height: 520px;
  background-color: #0a9f50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.columns-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 100px;
}

.menu-btn {
  padding: 15px;
  border-radius: 20px;
  font-size: 30px;
  font-weight: 600;
  min-width: 220px;
  text-transform: none;
}

.job-title {
  font-size: 40px;
  font-weight: bold;
  line-height: 1.3;
  margin-bottom: 70px;
}

.or-label {
  font-size: 40px;
  font-weight: bold;
}

.divider-vertical {
  width: 2px;
  height: 250px;
  background-color: white;
  margin-top: 4px;
  margin-bottom: -90px;
}

.top-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 100px; /* horizontal spacing between logos */
  margin-bottom: 40px; /* spacing under the logos */
}

.logo {
  object-fit: contain;
}

/* Individual logo controls */
.logo-left {
  height: 200px; /* you can adjust this */
  width: auto;
}

.logo-right {
  height: 220px; /* you can adjust this separately */
  width: auto;
}
</style>
