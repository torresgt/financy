/**
 * Assistente de configuração do envio de e-mails (SMTP).
 *
 *   npm run mail:setup
 *
 * Pergunta o provedor e as credenciais no terminal (a senha não aparece na tela),
 * testa a conexão ANTES de salvar, grava as variáveis no `.env` e envia um e-mail
 * de teste. As credenciais ficam apenas no `.env` local (ignorado pelo git).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'
import nodemailer from 'nodemailer'

interface Provider {
  label: string
  host?: string
  port?: number
  secure?: boolean
  /** Login fixo exigido pelo provedor (ex.: Resend). */
  fixedUser?: string
  userPrompt: string
  passPrompt: string
  /** Gmail/Outlook só enviam com o próprio endereço como remetente. */
  fromIsUser: boolean
  help: string[]
}

const PROVIDERS: Provider[] = [
  {
    label: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    userPrompt: 'Seu e-mail do Gmail',
    passPrompt: 'Senha de app (16 letras)',
    fromIsUser: true,
    help: [
      'Pré-requisitos (uma vez só):',
      '  1. Ative a verificação em 2 etapas: https://myaccount.google.com/security',
      '  2. Gere uma senha de app: https://myaccount.google.com/apppasswords',
      '  Use a senha de app, NÃO a senha da sua conta Google.',
    ],
  },
  {
    label: 'Brevo (gratuito, recomendado para produção)',
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    userPrompt: 'Login SMTP (aparece em SMTP & API > SMTP)',
    passPrompt: 'Chave SMTP',
    fromIsUser: false,
    help: [
      'Crie a conta em https://www.brevo.com e, em "SMTP & API", gere uma chave SMTP.',
      'O remetente precisa estar verificado em "Senders, Domains & Dedicated IPs".',
    ],
  },
  {
    label: 'Resend',
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    fixedUser: 'resend',
    userPrompt: '',
    passPrompt: 'API key (começa com re_)',
    fromIsUser: false,
    help: [
      'Crie a conta em https://resend.com e gere uma API key.',
      'Sem domínio verificado, só é possível enviar para o e-mail da própria conta.',
    ],
  },
  {
    label: 'Outlook / Hotmail',
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    userPrompt: 'Seu e-mail do Outlook/Hotmail',
    passPrompt: 'Senha (ou senha de app, se usar verificação em 2 etapas)',
    fromIsUser: true,
    help: [
      'Atenção: a Microsoft vem bloqueando o login SMTP por senha em contas pessoais.',
      'Se a conexão for recusada, use Gmail, Brevo ou Resend.',
    ],
  },
  {
    label: 'Outro servidor SMTP',
    userPrompt: 'Usuário SMTP (deixe vazio se não houver)',
    passPrompt: 'Senha SMTP',
    fromIsUser: false,
    help: [],
  },
]

const ENV_PATH = resolve(process.cwd(), '.env')
const ENV_SECTION = '# E-mail (gerado por `npm run mail:setup`)'

function cancel(): never {
  console.log('\n\nCancelado. Nada foi alterado.')
  process.exit(130)
}

/** Uma interface por pergunta: libera o terminal para a leitura da senha. */
async function ask(question: string, fallback = ''): Promise<string> {
  const rl = createInterface({ input: stdin, output: stdout })
  rl.on('SIGINT', cancel)
  try {
    const suffix = fallback ? ` [${fallback}]` : ''
    const answer = (await rl.question(`${question}${suffix}: `)).trim()
    return answer || fallback
  } finally {
    rl.close()
  }
}

/** Lê a senha sem ecoar o que é digitado (mostra "*"). Fora de um terminal, lê a linha. */
async function askSecret(question: string): Promise<string> {
  if (!stdin.isTTY) return ask(question)

  stdout.write(`${question}: `)
  stdin.setRawMode(true)
  stdin.resume()

  return new Promise((resolvePromise) => {
    let value = ''
    const finish = () => {
      stdin.off('data', onData)
      stdin.setRawMode(false)
      stdin.pause()
      stdout.write('\n')
    }
    const onData = (chunk: Buffer) => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\r' || char === '\n') {
          finish()
          resolvePromise(value.trim())
          return
        }
        if (char === '\u0003') {
          finish()
          cancel()
        }
        if (char === '\u007f' || char === '\b') {
          if (value) {
            value = value.slice(0, -1)
            stdout.write('\b \b')
          }
          continue
        }
        value += char
        stdout.write('*')
      }
    }
    stdin.on('data', onData)
  })
}

function errorHint(error: unknown): string {
  const { code, message } = (error ?? {}) as { code?: string; message?: string }
  if (code === 'EAUTH') {
    return 'login recusado. Confira o usuário e use uma senha de app / chave SMTP (não a senha da conta).'
  }
  if (code && ['ECONNECTION', 'ETIMEDOUT', 'ESOCKET', 'EDNS'].includes(code)) {
    return 'não foi possível conectar. Confira host/porta ou se a rede/firewall bloqueia SMTP.'
  }
  return message ?? String(error)
}

/**
 * Valor pronto para o .env. O dotenv não interpreta escapes como `\"`, então
 * escolhemos um delimitador que não apareça no valor: ' (literal), ` (literal)
 * ou " (expande `\n`, por isso só sem barra invertida).
 */
function quote(value: string): string {
  if (/^[\w.@:/+-]*$/.test(value)) return value
  if (!value.includes("'")) return `'${value}'`
  if (!value.includes('`')) return `\`${value}\``
  if (!value.includes('"') && !value.includes('\\')) return `"${value}"`
  throw new Error(
    'A senha usa aspas simples, duplas e crase ao mesmo tempo, o que o .env não suporta. Gere outra senha.',
  )
}

/** Atualiza ou acrescenta as chaves no .env, preservando o restante do arquivo. */
function writeEnv(values: Record<string, string>) {
  const lines = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, 'utf8').split(/\r?\n/) : []
  const pending = new Map(Object.entries(values))

  const updated = lines.map((line) => {
    const key = /^([A-Z0-9_]+)=/.exec(line)?.[1]
    if (key && pending.has(key)) {
      const next = `${key}=${quote(pending.get(key) ?? '')}`
      pending.delete(key)
      return next
    }
    return line
  })

  if (pending.size > 0) {
    while (updated.length > 0 && updated.at(-1) === '') updated.pop()
    updated.push('', ENV_SECTION)
    for (const [key, value] of pending) updated.push(`${key}=${quote(value)}`)
  }

  writeFileSync(ENV_PATH, `${updated.join('\n').trimEnd()}\n`, 'utf8')
}

async function main() {
  console.log('\n✉️  Configuração do envio de e-mails do Financy\n')
  for (const [index, provider] of PROVIDERS.entries()) {
    console.log(`  ${index + 1}. ${provider.label}`)
  }

  const provider = PROVIDERS[Number(await ask('\nProvedor', '1')) - 1]
  if (!provider) throw new Error('Opção inválida.')

  if (provider.help.length) console.log(`\n${provider.help.join('\n')}\n`)

  const host = provider.host ?? (await ask('Host SMTP'))
  const port = provider.port ?? Number(await ask('Porta', '587'))
  const secure =
    provider.secure ??
    (await ask('TLS direto? (s = porta 465, n = STARTTLS)', port === 465 ? 's' : 'n')) === 's'

  const user = provider.fixedUser ?? (await ask(provider.userPrompt))
  let pass = await askSecret(provider.passPrompt)
  // O Google exibe a senha de app em blocos ("abcd efgh ijkl mnop").
  if (provider.label === 'Gmail') pass = pass.replaceAll(' ', '')

  const fromAddress = provider.fromIsUser
    ? user
    : await ask('E-mail remetente (verificado no provedor)', user.includes('@') ? user : '')
  const fromName = await ask('Nome do remetente', 'Financy')

  if (!host || !fromAddress) throw new Error('Host e remetente são obrigatórios.')

  console.log(`\nTestando conexão com ${host}:${port}...`)
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user ? { user, pass } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  })

  try {
    await transporter.verify()
  } catch (error) {
    console.error(`\n❌ Falha: ${errorHint(error)}\nO .env NÃO foi alterado. Rode o comando de novo.`)
    process.exitCode = 1
    return
  }
  console.log('✅ Conexão e login OK.')

  const mailFrom = `${fromName} <${fromAddress}>`
  writeEnv({
    SMTP_HOST: host,
    SMTP_PORT: String(port),
    SMTP_SECURE: String(secure),
    SMTP_USER: user,
    SMTP_PASS: pass,
    MAIL_FROM: mailFrom,
  })
  console.log(`✅ Configuração salva em ${ENV_PATH}`)

  const to = await ask('\nEnviar um e-mail de teste para', fromAddress)
  if (to) {
    await transporter.sendMail({
      from: mailFrom,
      to,
      subject: 'Financy: envio de e-mails configurado',
      text: 'Se você recebeu esta mensagem, o envio de e-mails do Financy está funcionando.',
      html: '<p>Se você recebeu esta mensagem, o envio de e-mails do Financy está funcionando. ✅</p>',
    })
    console.log(`✅ E-mail de teste enviado para ${to}. Confira a caixa de entrada (e o spam).`)
  }

  console.log('\nPronto! Reinicie o servidor (npm run dev) para usar a nova configuração.\n')
}

main().catch((error: unknown) => {
  console.error(`\n❌ ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
