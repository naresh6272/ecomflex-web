import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, phone, company, projectType, budget, description } = body

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'Email service not configured' })
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from: 'ECOMFLEX Enquiry <onboarding@resend.dev>',
    to:   'nareshvn4n@gmail.com',
    subject: `New Enquiry from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#04080f;color:#fff;border-radius:12px;padding:32px">
        <h2 style="color:#06b6d4;margin-top:0">New Project Enquiry</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#94a3b8;width:140px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
          <tr><td style="padding:8px 0;color:#94a3b8">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#3B82F6">${email}</a></td></tr>
          ${phone    ? `<tr><td style="padding:8px 0;color:#94a3b8">Phone</td><td style="padding:8px 0">${phone}</td></tr>` : ''}
          ${company  ? `<tr><td style="padding:8px 0;color:#94a3b8">Company</td><td style="padding:8px 0">${company}</td></tr>` : ''}
          ${projectType ? `<tr><td style="padding:8px 0;color:#94a3b8">Project Type</td><td style="padding:8px 0">${projectType}</td></tr>` : ''}
          ${budget   ? `<tr><td style="padding:8px 0;color:#94a3b8">Budget</td><td style="padding:8px 0">${budget}</td></tr>` : ''}
        </table>
        ${description ? `
        <div style="margin-top:20px;padding:16px;background:#0a1020;border-radius:8px;border-left:3px solid #06b6d4">
          <p style="color:#94a3b8;margin:0 0 8px;font-size:13px">MESSAGE</p>
          <p style="margin:0;line-height:1.6">${description.replace(/\n/g, '<br>')}</p>
        </div>` : ''}
        <p style="margin-top:24px;color:#475569;font-size:12px">Sent from ecomflex.com contact form</p>
      </div>
    `,
  })

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
