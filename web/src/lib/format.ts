import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/** Formata um valor em reais (Float vindo da API) como moeda BRL. */
export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

/**
 * A API devolve datas em ISO UTC (ex.: 2026-11-10T00:00:00.000Z).
 * Para não "voltar um dia" em fusos a oeste de UTC (ex.: BRT), usamos
 * apenas a parte de data (YYYY-MM-DD) e criamos a data no fuso local.
 */
export function parseApiDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Formata uma data da API (ex.: "dd/MM/yy"). */
export function formatDate(iso: string, pattern = 'dd/MM/yy') {
  return format(parseApiDate(iso), pattern, { locale: ptBR })
}

/** Converte uma data local para o formato aceito pela API ("YYYY-MM-DD"). */
export function toApiDate(date: Date) {
  return format(date, 'yyyy-MM-dd')
}
