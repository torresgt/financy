/**
 * Envia um e-mail de teste com a configuração atual do `.env`, usando o mesmo
 * caminho do servidor (mesmo mailer e mesmo modelo do código de recuperação).
 *
 *   npm run mail:test -- destinatario@exemplo.com
 */
import { passwordResetCodeEmail } from '../emails/password-reset-code.js'
import { env } from '../env.js'
import { sendMail, verifyMailer } from '../lib/mailer.js'

const to = process.argv[2]

if (!to || !to.includes('@')) {
  console.error('Uso: npm run mail:test -- destinatario@exemplo.com')
  process.exit(1)
}

if (!env.SMTP_HOST) {
  console.error('SMTP não configurado. Rode primeiro: npm run mail:setup')
  process.exit(1)
}

await verifyMailer()

try {
  await sendMail({
    to,
    ...passwordResetCodeEmail({
      name: 'Teste',
      code: '123456',
      ttlMinutes: env.PASSWORD_RESET_CODE_TTL_MINUTES,
    }),
  })
  console.log(`✅ E-mail de teste (modelo do código de recuperação) enviado para ${to}.`)
} catch (error) {
  console.error(`❌ ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
