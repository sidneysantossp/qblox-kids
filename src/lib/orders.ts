export function formatOrderNumber(orderId: string) {
  const numeric = orderId.replace(/[^0-9a-f]/gi, '').slice(-8).toUpperCase();
  return `#${numeric}`;
}

export function getOrderStatusLabel(status: string) {
  const statusMap: Record<string, string> = {
    pending: 'Aguardando Pagamento',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    completed: 'Confirmado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
  };

  return statusMap[status] || status;
}
