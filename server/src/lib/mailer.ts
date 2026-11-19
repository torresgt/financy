import nodemailer, { type Transporter } from 'nodemailer'
import { env } from '../env.js'

export interface MailContent {
  subject: string
  text: string
  html: string
}

export interface MailMessage extends MailContent {
  to: string
}

/** Tentativas de envio para falhas temporárias (rede, servidor ocupado). */
const MAX_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 1_000
/** Códigos de erro do nodemailer que valem nova tentativa. */
const TRANSIENT_ERROR_CODES = new Set(['ECONNECTION', 'ETIMEDOUT', 'ESOCKET', 'EDNS'])

let transporter: Transporter | null = null

function getTransporter(): Transporter | null {
  if (!env.SMTP_HOST) return null

  transporter ??= nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    // Sem esses limites, um servidor lento deixaria o envio pendurado indefinidamente.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })
  return transporter
}

function isTransient(error: unknown): boolean {
  const { code, responseCode } = (error ?? {}) as { code?: string; responseCode?: number }
  // Respostas SMTP 4xx são temporárias por definição (ex.: 421, 450, 451).
  return (
    (!!code && TRANSIENT_ERROR_CODES.has(code)) ||
    (!!responseCode && responseCode >= 400 && responseCode < 500)
  )
}

/** Dica de correção para os erros de configuração mais comuns. */
function describeError(error: unknown): string {
  const { code, message } = (error ?? {}) as { code?: string; message?: string }
  if (code === 'EAUTH') {
    return 'usuário ou senha SMTP recusados (no Gmail/Outlook, use uma senha de app, não a senha da conta)'
  }
  if (code && TRANSIENT_ERROR_CODES.has(code)) {
    return `não foi possível conectar em ${env.SMTP_HOST}:${env.SMTP_PORT} (confira host, porta e SMTP_SECURE)`
  }
  return message ?? String(error)
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Envia um e-mail via SMTP, com novas tentativas para falhas temporárias.
 * Sem SMTP configurado (permitido só fora de produção, ver `env.ts`), o
 * conteúdo é exibido no console para testes locais.
 */
export async function sendMail(message: MailMessage): Promise<void> {
  const smtp = getTransporter()

  if (!smtp) {
    console.info(
      `\n📧 [mail:console] Para: ${message.to}\n   Assunto: ${message.subject}\n\n${message.text}\n`,
    )
    return
  }

  for (let attempt = 1; ; attempt++) {
    try {
      await smtp.sendMail({ from: env.MAIL_FROM, ...message })
      return
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS || !isTransient(error)) {
        throw new Error(`Falha ao enviar e-mail: ${describeError(error)}`, { cause: error })
      }
      await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1))
    }
  }
}

/**
 * Confere a conexão e o login SMTP na inicialização, para que um `.env` errado
 * apareça na hora, e não só quando alguém tentar recuperar a senha.
 * Não derruba o servidor: o restante da API continua funcionando.
 */
export async function verifyMailer(): Promise<void> {
  const smtp = getTransporter()

  if (!smtp) {
    console.warn('✉️  SMTP não configurado: os e-mails serão exibidos apenas no console.')
    return
  }

  try {
    await smtp.verify()
    console.log(`✉️  SMTP pronto (${env.SMTP_HOST}:${env.SMTP_PORT}), remetente ${env.MAIL_FROM}`)
  } catch (error) {
    console.error(`❌ SMTP com problema: ${describeError(error)}`)
  }
}
