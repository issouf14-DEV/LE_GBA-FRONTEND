// Emails déclenchés à la demande. Les emails automatiques (bienvenue, nouvelle commande,
// validation ou refus) sont envoyés par le serveur lui-même : le client ne peut pas en forger.
import client from '@/api/client';
import { logger } from '@/lib/logger';

const id = (value) => encodeURIComponent(value);

async function send(label, request) {
  try {
    const { data } = await request();
    return { success: true, data };
  } catch (error) {
    logger.warning(`Email "${label}" non envoyé`, error?.message);
    return { success: false, message: error?.message };
  }
}

// Admin
export const sendPaymentReminder = (orderId) =>
  send('rappel de paiement', () => client.post(`/orders/${id(orderId)}/send-payment-reminder`));

export const sendRentalSummary = (orderId) =>
  send('récapitulatif', () => client.post(`/orders/${id(orderId)}/send-rental-summary`));

// Client propriétaire de la commande
export const resendOrderEmail = (orderId) =>
  send('renvoi', () => client.post(`/orders/${id(orderId)}/resend-email`));
