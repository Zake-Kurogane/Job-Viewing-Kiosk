<template>
  <body>
    <div class="job-application-system">
      <!-- Loading Overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Sending Email...</p>
        </div>
      </div>

      <!-- Header -->
      <header class="custom-header">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/3/33/Ph_seal_Tagum.png"
          alt="Left Logo"
          class="header-logo"
        />

        <div class="header-text">
          <div class="header-subtitle">
            City Public Employment Services and Capability Development Office
          </div>
          <div class="header-title">LOOKING FOR A JOB?</div>
        </div>

        <img
          src="https://res.cloudinary.com/dxpsvvhsj/image/upload/v1747641032/tttoh5kmfdieo2idmbd7.png"
          alt="Right Logo"
          class="header-logo"
        />
      </header>

      <!-- List of Available Jobs -->
      <h2 class="section-title">List of Available Jobs</h2>

      <!-- Search Bar -->
      <div class="search-container">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search for jobs..."
          class="search-input"
        />
      </div>

      <div class="job-list-container" ref="jobListContainer">
        <!-- ▸ Show jobs when we have at least one hit -->
        <ul v-if="filteredJobs.length" class="job-list">
          <li v-for="(form, index) in filteredJobs" :key="index" class="job-item">
            <div class="job-details">
              <h6 class="job-title">{{ form.JOB_TITLE }}</h6>
              <p class="company-name">{{ form.COMPANY_NAME }}</p>
              <p class="date-listed">Listed: {{ formatDate(form.UPDATED_AT) }}</p>
            </div>
            <div class="job-button">
              <button @click="viewForm(form)" class="btn btn-primary">View Details</button>
            </div>
          </li>
        </ul>

        <!-- ▸ Fallback when nothing matched -->
        <div v-else class="no-matches">No matches found</div>
      </div>

      <!-- Job Details Modal -->
      <div
        v-if="viewingForm"
        class="modal-overlay"
        @click="resetIdleTimer"
        @touchstart="resetIdleTimer"
      >
        <div class="modal-content modal-job-details">
          <header class="modal-header">
            <div class="header-content">
              <h3>Job Details</h3>
              <span class="timer-display">Closes in {{ timer }}s</span>
            </div>
            <button class="close-button" @click="closeViewForm">×</button>
          </header>
          <div class="modal-body">
            <!-- Company Name & Job Title Section -->
            <div class="modal-section">
              <h4>Company Name & Job Title</h4>
              <div>{{ selectedForm.COMPANY_NAME }} - {{ selectedForm.JOB_TITLE }}</div>
            </div>
            <div class="modal-section">
              <h4>Job Description</h4>
              <div v-html="selectedForm.JOB_DESCRIPTION"></div>
            </div>
            <div class="modal-section">
              <h4>Qualifications</h4>
              <div v-html="selectedForm.QUALIFICATIONS"></div>
            </div>

            <!-- Compensation -->
            <div class="modal-section">
              <h4>Compensation</h4>
              <div v-if="selectedForm.CURRENCY === 'TBD'">To be discussed</div>
              <div v-else>{{ selectedForm.COMPENSATION }} {{ selectedForm.CURRENCY }}</div>
            </div>
            <!-- Benefits -->
            <div class="modal-section">
              <h4>Benefits</h4>
              <div v-html="selectedForm.BENEFITS"></div>
            </div>
            <div class="modal-section">
              <h4>Where to Apply</h4>
              <div v-html="selectedForm.WHERE_TO_APPLY"></div>
            </div>
          </div>
          <footer class="modal-footer">
            <button @click="printJobDetails" class="btn btn-primary">Print</button>
            <button @click="takePic" class="btn btn-primary">Take A Photo</button>
            <button @click="openEmailModal" class="btn btn-primary">Send Email</button>
          </footer>
        </div>
      </div>

      <!-- Email Input Modal -->
      <div
        v-if="showEmailModal"
        class="modal-overlay"
        @click="resetIdleTimer"
        @touchstart="resetIdleTimer"
      >
        <div class="modal-content modal-email">
          <header class="modal-header">
            <h3>Send Job Details</h3>
            <button class="close-button" @click="closeEmailModal">×</button>
          </header>
          <div class="modal-body">
            <div class="modal-section">
              <h3>Enter your E-mail Address</h3>

              <input
                id="usermail"
                type="email"
                v-model="emailAddress"
                placeholder=""
                class="email-input"
                autocomplete="new-email"
                :name="'user_email_' + emailKey"
                :key="emailKey"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
              />

              <p v-if="emailError" class="error-message">{{ emailError }}</p>
            </div>
          </div>
          <footer class="modal-footer">
            <button @click="sendEmail" class="btn btn-primary">Send</button>
            <button @click="closeEmailModal" class="btn btn-secondary">Cancel</button>
          </footer>
        </div>
      </div>
      <!-- Thank You Modal -->
      <div v-if="thankYouVisible" class="modal-overlay thank-you-overlay">
        <div class="modal-content thank-you-content">
          <h3>THANK YOU FOR USING THE JOB APPLICATION KIOSK</h3>
        </div>
      </div>
      <!-- Proceed-to-Frontdesk Modal -->
      <div v-if="proceedVisible" class="modal-overlay thank-you-overlay">
        <div class="modal-content thank-you-content">
          <h3>You may now proceed to frontdesk to get referred to a job</h3>
        </div>
      </div>

      <!--take a photo overlay-->
      <div v-if="photoOverlayVisible" class="photo-overlay">
        <div class="photo-content">
          <button class="close-btn-photo" @click="photoOverlayVisible = false">×</button>
          <!-- COUNT-DOWN -->
          <span class="photo-timer">Closing in {{ photoTimer }}s</span>
          <div ref="scalableContainer" class="scalable-text-container">
            <div ref="scalableText" class="photo-job-details">
              <h2>{{ selectedForm.COMPANY_NAME }} – {{ selectedForm.JOB_TITLE }}</h2>

              <strong>Description:</strong>
              <p v-html="selectedForm.JOB_DESCRIPTION"></p>

              <strong>Qualification:</strong>
              <p v-html="selectedForm.QUALIFICATIONS"></p>

              <strong>Compensation:</strong>
              <p>{{ selectedForm.COMPENSATION }} {{ selectedForm.CURRENCY }}</p>

              <strong>Benefits:</strong>
              <p v-html="selectedForm.BENEFITS"></p>

              <strong>Where to Apply:</strong>
              <p v-html="selectedForm.WHERE_TO_APPLY"></p>
            </div>
          </div>
        </div>
      </div>
      <!-- Floating Back to Menu Button -->
      <FloatingBackButton />
    </div>
  </body>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import FloatingBackButton from 'components/FloatingBackButton.vue'

export default {
  name: 'JobApplicationSystem',
  components: {
    FloatingBackButton,
  },
  setup() {
    const emailKey = ref(Date.now())
    const hiringForms = ref([])
    const searchQuery = ref('')
    const selectedForm = ref(null)
    const viewingForm = ref(false)
    const showEmailModal = ref(false)
    const emailAddress = ref('')
    const emailError = ref('')
    const timer = ref(60)
    const viewCount = ref(0)
    const printCount = ref(0)
    const photoCount = ref(0)
    const thankYouVisible = ref(false)
    const loading = ref(false)
    const proceedVisible = ref(false)
    const photoTimer = ref(0)
    const router = useRouter()
    const scalableContainer = ref(null)
    const scalableText = ref(null)

    let idleTimeout = null
    let refreshInterval = null
    let photoInterval = null
    let inactivityTimer = null

    // ref for dynamic container sizing
    const jobListContainer = ref(null)

    const fetchJobs = async () => {
      //10.0.1.26:82
      try {
        const response = await fetch(process.env.JOB_API_BASE + '/get_jobs.php')
        hiringForms.value = await response.json()
        await nextTick()
        updateMaxHeight()
      } catch (error) {
        console.error('API Fetch Error:', error)
      }
    }

    const updateMaxHeight = () => {
      const container = jobListContainer.value
      if (!container) return
      const firstItem = container.querySelector('.job-item')
      if (!firstItem) return
      const style = getComputedStyle(firstItem)
      const itemHeight = firstItem.offsetHeight + parseFloat(style.marginBottom)
      container.style.maxHeight = `${itemHeight * 5}px`
    }

    onMounted(() => {
      fetchJobs()
      window.addEventListener('resize', updateMaxHeight)

      //refresh every 5 sec
      refreshInterval = setInterval(fetchJobs, 15000)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateMaxHeight)
      clearInterval(refreshInterval)
      clearInterval(photoInterval)

      //clear our interval
      clearInterval(refreshInterval)
    })

    const filteredJobs = computed(() => {
      if (!searchQuery.value) return hiringForms.value
      return hiringForms.value.filter(
        (job) =>
          job.JOB_TITLE.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          job.COMPANY_NAME.toLowerCase().includes(searchQuery.value.toLowerCase()),
      )
    })

    const trackViewPrint = async (jobId, action) => {
      try {
        if (action === 'view') viewCount.value++
        if (action === 'print') printCount.value++
        if (action === 'photo') photoCount.value++
        // 10.0.1.26:82
        await fetch(process.env.JOB_API_BASE + '/get_jobs.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_id: jobId, action }),
        })
      } catch (err) {
        console.error(`Error bumping ${action} for job ${jobId}:`, err)
      }
    }

    const startIdleTimer = () => {
      timer.value = 60
      clearTimeout(idleTimeout)
      idleTimeout = setTimeout(closeViewForm, 60000)
      updateTimerDisplay()
    }

    const updateTimerDisplay = () => {
      clearTimeout(idleTimeout)
      idleTimeout = setTimeout(() => {
        if (timer.value > 0 && viewingForm.value) {
          timer.value--
          updateTimerDisplay()
        } else {
          closeViewForm()
        }
      }, 1000)
    }

    const resetIdleTimer = () => {
      if (viewingForm.value || showEmailModal.value) {
        timer.value = 60
        clearTimeout(idleTimeout)
        startIdleTimer()
      }
    }

    const viewForm = (form) => {
      selectedForm.value = form
      viewingForm.value = true
      if (form.ID) trackViewPrint(form.ID, 'view')
      startIdleTimer()
    }

    const printJobDetails = () => {
      /* 1 ▸ guard-rails */
      if (!selectedForm.value?.ID) return
      trackViewPrint(selectedForm.value.ID, 'print')

      /* 2 ▸ grab the live modal we want to print */
      const modalEl = document.querySelector('.modal-content.modal-job-details')
      if (!modalEl) {
        alert('Nothing to print.')
        return
      }

      /* 3 ▸ ticket CSS */
      const css = `
    @page { size: 52mm auto; margin: 4mm; }
    html,body{ width:38mm; margin:0; font:13px/1.4 Arial,sans-serif; }
    body{ display:flex; justify-content:center; }
    .print-container{
      width:100%;
      display:flex;
      flex-direction:column-reverse;
      align-items:center;
      transform:rotate(180deg);
      transform-origin:center;
    }
    .modal-footer,.close-button,.timer-display{ display:none !important; }
    .modal-section{ margin-bottom:3mm; }
    .modal-section h4{ font:700 14px/1 Arial; margin:0 0 1mm; }
    .print-container strong{ display:block; margin-bottom:0.8mm; }
    .print-container p,.print-container div{
      white-space:pre-line; word-wrap:break-word;
    }
    .print-container ul{ padding-left:4mm; margin:0 0 1mm; }
    .print-container li{ margin-bottom:0.8mm; }
  `

      /* 4 ▸ complete printable HTML */
      const ticket = `
    <!doctype html><html><head><meta charset="utf-8">
    <title>Job Details</title><style>${css}</style></head>
    <body><div class="print-container">${modalEl.outerHTML}</div></body></html>`

      /* 5 ▸ hidden iframe */
      const frame = document.createElement('iframe')
      Object.assign(frame.style, {
        position: 'fixed',
        width: '0',
        height: '0',
        border: '0',
        opacity: '0',
        pointerEvents: 'none',
      })
      document.body.appendChild(frame)

      /* 6 ▸ populate ⟶ print ⟶ clean-up (all inside the same click stack) */
      const doc = frame.contentDocument || frame.contentWindow.document
      doc.open()
      doc.write(ticket)
      doc.close()

      frame.contentWindow.focus() // Chrome kiosk requires focus
      frame.contentWindow.print() // silent with --kiosk --kiosk-printing
      frame.contentWindow.onafterprint = () => {
        document.body.removeChild(frame)
      }

      /* 7 ▸ kiosk feedback */
      proceedVisible.value = true
      setTimeout(() => {
        proceedVisible.value = false
        closeViewForm()
      }, 3000)
    }

    const closeViewForm = () => {
      viewingForm.value = false
      showEmailModal.value = false
      selectedForm.value = null
      emailAddress.value = ''
      emailError.value = ''
      clearTimeout(idleTimeout)
    }

    const openEmailModal = () => {
      showEmailModal.value = true
      emailAddress.value = ''
      emailError.value = ''
      emailKey.value = Date.now()
      resetIdleTimer()
    }

    const closeEmailModal = () => {
      showEmailModal.value = false
      emailAddress.value = ''
      emailError.value = ''
      resetIdleTimer()
    }

    const sendEmail = async () => {
      emailError.value = ''
      const email = emailAddress.value.trim()

      if (!email.endsWith('@gmail.com')) {
        emailError.value = 'Please enter a valid Email address.'
        return
      }

      // Start the loading state
      loading.value = true

      try {
        const response = await fetch(process.env.JOB_API_BASE + '/send_email.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_id: selectedForm.value.ID,
            email,
          }),
        })

        if (!response.ok) {
          const err = await response.json()
          alert(err.error || 'Email send failed.')
          return
        }

        // 1) Show thank-you modal
        thankYouVisible.value = true
        // 2) Close the email-input modal
        closeEmailModal()

        // 3) After 5s, hide thank-you AND close everything else
        setTimeout(() => {
          thankYouVisible.value = false
          // Close the job-details modal as well
          closeViewForm()
        }, 3000)
      } catch (err) {
        console.error('Network or CORS error:', err)
        alert('A network error occurred. Check console.')
      } finally {
        // End the loading state
        loading.value = false
      }
    }

    const formatDate = (iso) => {
      if (!iso) return ''
      const now = Date.now()
      const then = new Date(iso).getTime()
      const diff = now - then

      const minute = 60 * 1000
      const hour = 60 * minute
      const day = 24 * hour
      const week = 7 * day
      const month = 30 * day // approximate
      const year = 365 * day // approximate

      if (diff >= year) {
        const y = Math.floor(diff / year)
        return `${y} year${y > 1 ? 's' : ''} ago`
      } else if (diff >= month) {
        const m = Math.floor(diff / month)
        return `${m} month${m > 1 ? 's' : ''} ago`
      } else if (diff >= week) {
        const w = Math.floor(diff / week)
        return `${w} week${w > 1 ? 's' : ''} ago`
      } else if (diff >= day) {
        const d = Math.floor(diff / day)
        return `${d} day${d > 1 ? 's' : ''} ago`
      } else if (diff >= hour) {
        const h = Math.floor(diff / hour)
        return `${h} hour${h > 1 ? 's' : ''} ago`
      } else if (diff >= minute) {
        const m = Math.floor(diff / minute)
        return `${m} minute${m > 1 ? 's' : ''} ago`
      } else {
        return 'just now'
      }
    }

    const photoOverlayVisible = ref(false)

    const takePic = () => {
      /* safety */
      if (!selectedForm.value?.ID) return
      trackViewPrint(selectedForm.value.ID, 'photo')

      /* show overlay & start countdown */
      photoOverlayVisible.value = true
      photoTimer.value = 15

      nextTick(() => {
        autoFitPhotoText()
      })

      /* clear any previous timer, then tick every second */
      clearInterval(photoInterval)
      photoInterval = setInterval(() => {
        if (photoTimer.value > 0) {
          photoTimer.value--
        } else {
          clearInterval(photoInterval)
          photoOverlayVisible.value = false
        }
      }, 1000)
    }

    const closePhotoOverlay = () => {
      photoOverlayVisible.value = false
      clearInterval(photoInterval)
    }

    // time in milliseconds (10 minutes)
    const INACTIVITY_LIMIT = 1 * 60 * 1000

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(() => {
        router.push('/start')
      }, INACTIVITY_LIMIT)
    }

    const setupInactivityListeners = () => {
      const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'click']
      events.forEach((event) => window.addEventListener(event, resetInactivityTimer))
      resetInactivityTimer()
    }

    const cleanupInactivityListeners = () => {
      const events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'click']
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer))
      clearTimeout(inactivityTimer)
    }

    onMounted(() => {
      setupInactivityListeners()
    })

    onBeforeUnmount(() => {
      cleanupInactivityListeners()
    })

    const autoFitPhotoText = () => {
      const container = scalableContainer.value
      const content = scalableText.value

      if (!container || !content) return

      let fontSize = 48 // start large
      content.style.fontSize = fontSize + 'px'

      while (content.scrollHeight > container.clientHeight && fontSize > 14) {
        fontSize -= 1
        content.style.fontSize = fontSize + 'px'
      }
    }

    return {
      searchQuery,
      filteredJobs,
      viewingForm,
      showEmailModal,
      selectedForm,
      emailAddress,
      emailError,
      timer,
      jobListContainer,
      viewForm,
      printJobDetails,
      openEmailModal,
      closeViewForm,
      closeEmailModal,
      sendEmail,
      resetIdleTimer,
      formatDate,
      thankYouVisible,
      loading,
      proceedVisible,
      photoOverlayVisible,
      takePic,
      closePhotoOverlay,
      photoTimer,
      emailKey,
      scalableContainer,
      scalableText,
    }
  },
}
</script>

<style>
/* Import Poppins Font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* Global & Layout */
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
body {
  margin: 0;
  background: #f5f5f5;
  font-family: 'Poppins', sans-serif;
}
/* 1 ▸ make the whole app a flex column */
.job-application-system {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 2vh 3vw;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow: hidden; /* keep this – but now inner list will fit */
}

/* Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #28a745; /* Green #28a745 */
  border-radius: 12px;
  padding: 10px 24px;
  width: 100%;
}
header h1 {
  font-size: 3.7vh;
  font-weight: 600;
  color: white;
  padding-left: 20px;
}

.logo {
  height: 120px;
  width: 120px;
  margin-left: 20px;
}

/* Search Bar */
.search-container {
  margin: 20px 0;
  text-align: center;
}
.search-input {
  width: 100%;
  padding: 2vh;
  font-size: 2.4vh;
  border: 1px solid #ccc;
  border-radius: 50px;
  font-family: 'Poppins', sans-serif;
}

/* 3 ▸ the list container takes the remaining space and scrolls */
.job-list-container {
  flex: 1; /* ← grow/shrink to fill */
  overflow-y: auto; /* ← internal scroll */
  overflow-x: hidden; /* keep rows from sideways scroll */
  max-height: none; /* kill any JS-set inline max-height */
  height: auto; /* remove the calc(2560px – 380px) line */
}
.job-list {
  list-style: none;
  padding: 0;
}
.job-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px; /*updated */
  border-radius: 8px;
  background-color: #fafafa;
  margin-bottom: 12px; /*updated */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 10cm;
  transition:
    background-color 0.3s,
    transform 0.2s;
}
.job-item:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

/* Buttons */
.btn {
  padding: 1.2vh 2vh;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.8vh;
  font-weight: 500;
  min-width: 120px; /* Touch-friendly size */
  margin-left: 10px;
  transition:
    background-color 0.3s,
    transform 0.2s;
}
.btn-primary {
  background-color: #28a745; /* Green */
  color: white;
}
.btn-primary:hover {
  background-color: #218838; /* Darker Green */
  transform: translateY(-2px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 100%;
  max-width: 90vw;
}
.modal-header {
  background-color: #28a745;
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.header-content {
  display: flex;
  flex-direction: column;
}

.modal-body {
  padding: 20px; /*updated */
  max-height: 60vh; /*update if needed */
  overflow-y: auto;
}
.modal-footer {
  background-color: #f1f1f1;
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
/* recently added */
.job-title {
  font-size: 1.9vh;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.company-name,
.date-listed {
  font-size: 1.9vh;
  line-height: 1.4;
}

/* Responsiveness */
@media (max-width: 768px) {
  /* Shrink logo and allow header to wrap */
  .logo {
    height: 60px;
    width: 60px;
    margin: 10px 0;
  }

  header h1 {
    font-size: 1.5rem;
    text-align: center;
    width: 100%;
    margin-top: 10px;
  }

  /* Center and constrain search bar */
  .search-container {
    margin: 20px 0;
    width: 90%;
  }
  .search-input {
    width: 100%;
  }

  /* Fluid grid for job cards */
  .job-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    grid-gap: 15px;
    padding: 0;
  }

  /* Let each card size itself vertically */
  .job-item {
    flex-direction: column;
    height: auto;
    text-align: center;
  }

  /* Tighter margins/padding on small phones */
  .job-application-system {
    margin: 20px;
    padding: 15px;
  }

  /* Scale down modal width and padding */
  .modal-content {
    width: 95% !important;
    margin: 10px;
  }
  .modal-body {
    padding: 15px;
  }
  .modal-header,
  .modal-footer {
    padding: 10px;
  }
}
/* Loading Screen Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it appears above other content */
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #28a745; /* Green spinner */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner p {
  color: white;
  margin-top: 10px;
  font-size: 16px;
}

/* Email Input Field */
.email-input {
  width: 100%;
  padding: 12px;
  font-size: 50px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;
}

/* Responsiveness */
@media (max-width: 768px) {
  /* Ensure email input field takes full width on smaller screens */
  .email-input {
    width: 100%;
    padding: 12px;
    font-size: 14px; /* Smaller text size for mobile */
  }
}

.close-button {
  /* White border and icon */
  border: 2px solid #28a745;
  color: #fff;
  background: transparent;

  /* Center the “×” character */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  line-height: 1;

  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
}

.close-button-photo {
  /* White border and icon */
  border: 2px solid #28a745;
  color: #fff;
  background: transparent;

  /* Center the “×” character */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  line-height: 1;

  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.1s;
}

/* Hover/focus states */
.close-button:hover,
.close-button:focus {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.modal-overlay.thank-you-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeInOverlay 0.3s ease-out forwards;
}

/* email thank you */
.modal-content.thank-you-content {
  position: relative;
  background-color: #fff;
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 90%;
  width: 360px;
  animation: zoomIn 0.3s ease-out forwards;
  overflow: hidden;
}

/* Checkmark */
.modal-content.thank-you-content::before {
  content: '✔︎';
  display: block;
  font-size: 3rem;
  color: #4caf50;
  margin-bottom: 1rem;
}

/* Heading style */
.thank-you-content h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #333;
  letter-spacing: 0.5px;
  line-height: 1.3;
}

/* Animations */
@keyframes fadeInOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* icon badge */
.modal-content.proceed-content::before {
  content: '✔';
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.5rem;
  background: #4caf50;
  color: white;
  border-radius: 50%;
  width: 56px;
  height: 86px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* message text */
.proceed-content h3 {
  margin: 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  line-height: 1.3;
}

.photo-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}

.photo-content {
  background: #ffffff;
  border: 6px solid #4caf50;
  border-radius: 12px;
  width: 1300px;
  height: 98vh;
  padding: 40px 50px; /*updated*/
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.2);
  position: relative;
}

.close-btn-photo {
  position: relative;
  top: 5px;
  left: 450px;
  font-size: 4rem;
  border: none;
  background: transparent;
  color: #28a745;
  cursor: pointer;
}

.photo-job-details {
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 3rem;
  line-height: 2rem;
  font-family: 'Poppins', sans-serif;
  color: #000;
}

.photo-job-details h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: justify;
  margin-bottom: 5rem;
}

.photo-job-details strong {
  display: block;
  font-size: 2rem;
  margin-top: 30px;
  margin-bottom: 10px;
}

.photo-job-details p {
  font-size: 1.6rem;
  margin-bottom: 20px;
  line-height: 1.6;
}
/* ─── Job-details modal: bigger text & better spacing ─── */
.modal-content.modal-job-details {
  /* raise the base size for everything inside the modal */
  font-size: 2.2vh; /* scales with screen height */
  line-height: 1.45;
}

/* main modal title (“Job Details”) */
.modal-content.modal-job-details h3 {
  font-size: 3.4vh;
  font-weight: 700;
}

/* section headings (“Job Description”, “Qualifications”, …) */
.modal-content.modal-job-details h4 {
  font-size: 2.2vh;
  font-weight: 600;
  margin: 1.6vh 0 0.8vh;
}

/* paragraph & rich-text content */
.modal-content.modal-job-details .modal-section div,
.modal-content.modal-job-details .modal-section p {
  font-size: 1.6vh; /* matches the base set above */
  line-height: 1.5;
}

/* make the action buttons a touch larger too */
.modal-content.modal-job-details .modal-footer .btn {
  font-size: 2.1vh;
  padding: 1.4vh 2.4vh;
}
/* ─── Bullet lists inside the Job-details modal ─── */

/* 1. If the data already contains real <ul><li> markup */
.modal-content.modal-job-details .modal-section ul {
  margin: 0.8vh 0;
  padding-left: 2.4vh; /* enough indent for kiosk view */
}
.modal-content.modal-job-details .modal-section ul li {
  margin-bottom: 0.6vh; /* a little breathing room */
  list-style-type: disc; /* standard bullet */
}

/* 2. If the data is just text with “•” bullets + new-lines            */
/*    (HTML collapses \n by default), show every newline as <br>     */
.modal-content.modal-job-details .modal-section div,
.modal-content.modal-job-details .modal-section p {
  white-space: pre-line; /* turns \n into line-breaks */
}
/* ─── Take-a-Photo overlay: put data on the next line ─── */
.photo-job-details strong {
  display: block; /* break right after the colon   */
  margin-bottom: 0.6vh; /* a little gap before the data  */
}

/* respect \n breaks & bullets inside the DB text         */
.photo-job-details p,
.photo-job-details div {
  white-space: pre-line; /* \n → real line-breaks         */
}

.no-matches {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.4vh; /* same scale as the rest of the UI */
  color: #999;
  text-align: center;
}

.error-message {
  color: #e53935;
  font-size: 1.8vh;
  margin-top: 8px;
}

.photo-timer {
  font-size: 2rem;
  color: #28a745;
}

.custom-header {
  background-color: #28a745;
  border-radius: 12px;
  padding: 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 9.8vh;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.header-logo {
  width: 13vw;
  height: 13vh;
  object-fit: contain;
}

.header-text {
  flex: 1;
  text-align: center;
  color: white;
}

.header-subtitle {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 2px;
}

.header-title {
  font-size: 50px;
  font-weight: 700;
}

.section-title {
  margin-bottom: 2px;
}

/* Target only the job list scroll area */
.job-list-container::-webkit-scrollbar {
  width: 8px;
}

.job-list-container::-webkit-scrollbar-button {
  display: none; /* 🔥 This hides the top/bottom arrows */
}

.job-list-container::-webkit-scrollbar-track {
  background: transparent;
}

.job-list-container::-webkit-scrollbar-thumb {
  background-color: #28a745;
  border-radius: 4px;
}

.scalable-text-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
