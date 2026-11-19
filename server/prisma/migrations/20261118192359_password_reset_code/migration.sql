-- Troca o link de redefinição de senha por um código de 6 dígitos com limite de
-- tentativas. A nova senha fica pendente até o código ser confirmado.
-- Pedidos pendentes do fluxo anterior (link) são descartados.
DROP TABLE "password_reset_tokens";

CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code_hash" TEXT NOT NULL,
    "new_password_hash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "used_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "password_reset_tokens_user_id_idx" ON "password_reset_tokens"("user_id");
