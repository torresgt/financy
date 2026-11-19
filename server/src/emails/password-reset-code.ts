import type { MailContent } from "../lib/mailer.js";

export interface PasswordResetCodeEmailData {
	name: string;
	code: string;
	ttlMinutes: number;
}

const BRAND_COLOR = "#1f6f43";

/**
 * E-mail com o código de redefinição de senha.
 */
export function passwordResetCodeEmail({
	name,
	code,
	ttlMinutes,
}: PasswordResetCodeEmailData): MailContent {
	const firstName = name.trim().split(/\s+/)[0] ?? name;

	const text = [
		`Olá, ${firstName}!`,
		"",
		"Recebemos uma solicitação para redefinir a senha da sua conta no Financy.",
		"",
		`Seu código de verificação: ${code}`,
		"",
		`Digite-o na tela de recuperação de senha. Ele expira em ${ttlMinutes} minutos e só pode ser usado uma vez.`,
		"",
		"Se você não fez essa solicitação, ignore este e-mail: sua senha atual continua valendo.",
		"Nunca compartilhe este código. A equipe do Financy jamais vai pedi-lo.",
	].join("\n");

	const html = `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0">
      Use o código para redefinir sua senha. Ele expira em ${ttlMinutes} minutos.
    </span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px">
            <tr>
              <td style="padding:32px 32px 0;font-size:20px;font-weight:bold;color:${BRAND_COLOR}">Financy</td>
            </tr>
            <tr>
              <td style="padding:24px 32px 0;font-size:16px;line-height:24px">
                <p style="margin:0 0 12px">Olá, ${escapeHtml(firstName)}!</p>
                <p style="margin:0">Recebemos uma solicitação para redefinir a senha da sua conta. Use o código abaixo na tela de recuperação de senha:</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 32px">
                <div style="display:inline-block;padding:16px 24px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0;font-family:'Courier New',monospace;font-size:32px;font-weight:bold;letter-spacing:8px;color:${BRAND_COLOR}">${code}</div>
                <p style="margin:12px 0 0;font-size:14px;color:#6b7280">Expira em ${ttlMinutes} minutos e só pode ser usado uma vez.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;font-size:14px;line-height:20px;color:#6b7280">
                <p style="margin:0 0 8px">Se você não fez essa solicitação, ignore este e-mail: sua senha atual continua valendo.</p>
                <p style="margin:0">Nunca compartilhe este código. A equipe do Financy jamais vai pedi-lo.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

	return {
		subject: "Seu código para redefinir a senha do Financy",
		text,
		html,
	};
}

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}
