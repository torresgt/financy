import nodemailer, { type Transporter } from 'nodemailer'
import { env } from '../env.js'

export interface MailMessage {
  to: string
  subject: string
  text: string
  html: string
}

let transporter: Transporter | null = null

function getTransporter(): Transporter | null {
  if (!env.SMTP_HOST) return null

  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
  })
  return transporter
}

/**
 * Envia um e-mail via SMTP. Sem SMTP configurado (permitido só fora de
 * produção, ver `env.ts`), o conteúdo é exibido no console para testes locais.
 */
export async function sendMail(message: MailMessage): Promise<void> {
  const smtp = getTransporter()

  if (!smtp) {
    console.info(
      `\n📧 [mail:dev] Para: ${message.to}\n   Assunto: ${message.subject}\n\n${message.text}\n`,
    )
    return
  }

  await smtp.sendMail({ from: env.MAIL_FROM, ...message })
}
