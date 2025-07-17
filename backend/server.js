const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors()) // Allow requests from frontend
app.use(cors({ origin: '*' })) // Allow all origins for development

// Function to send job details email
async function sendJobEmail(to, job) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'princeajycuyos@gmail.com',
      pass: 'cdzs baum sykl hgae',
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  // Generate HTML email body with job details
  const htmlBody = `
    <table width="100%" cellpadding="10">
      <tr>
        <td width="50%" valign="top">
          <strong>Job Title:</strong> ${job.JOB_TITLE}<br>
          <strong>Job Category:</strong> ${job.JOB_CATEGORY || 'N/A'}<br>
        </td>
        <td width="50%" valign="top">
          <strong>Company:</strong> ${job.COMPANY_NAME}<br>
          <strong>Where to Apply:</strong> ${job.WHERE_TO_APPLY}<br>
        </td>
      </tr>
    </table>
    <h2>Job Description</h2>
    ${job.JOB_DESCRIPTION}
    <h2>Qualifications</h2>
    ${job.QUALIFICATIONS}
    <h2>Compensation & Benefits</h2>
    ${job.COMPENSATION}
  `

  const mailOptions = {
    from: 'princeajycuyos@gmail.com',
    to: to,
    subject: job.JOB_TITLE,
    html: htmlBody,
  }

  await transporter.sendMail(mailOptions)
}

// API Endpoint to Send Job Details Email
app.post('/send-job-email', async (req, res) => {
  const { to, job } = req.body

  if (!to || !job) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    await sendJobEmail(to, job)
    res.status(200).json({ message: 'Job details email sent successfully!' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

// Start Server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000')
})
