import nodemailer from "nodemailer"

export interface ContactData {
  name: string
  phone: string
  email?: string
  service: string
  message?: string
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendContactEmail(data: ContactData): Promise<void> {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#06080b;color:#e2e8f0;padding:32px;border-radius:12px;">
      <h2 style="color:#0ea5ff;margin-top:0;">Novo contato — DN Teacher</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#94a3b8;width:120px;">Nome</td>
          <td style="padding:8px 0;font-weight:600;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#94a3b8;">Telefone</td>
          <td style="padding:8px 0;">${data.phone}</td>
        </tr>
        ${data.email ? `
        <tr>
          <td style="padding:8px 0;color:#94a3b8;">E-mail</td>
          <td style="padding:8px 0;">${data.email}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:8px 0;color:#94a3b8;">Serviço</td>
          <td style="padding:8px 0;">${data.service}</td>
        </tr>
        ${data.message ? `
        <tr>
          <td style="padding:8px 0;color:#94a3b8;vertical-align:top;">Mensagem</td>
          <td style="padding:8px 0;">${data.message}</td>
        </tr>` : ""}
      </table>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
      <p style="color:#64748b;font-size:12px;margin:0;">DN Teacher · ${new Date().toLocaleDateString("pt-BR", { dateStyle: "full" })}</p>
    </div>
  `

  await transporter.sendMail({
    from: `"DN Teacher" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `Novo contato: ${data.name} — ${data.service}`,
    html,
  })
}
