// Export PDF de l'historique : texte écrit directement avec jsPDF (aucun HTML injecté)
import { getOrderStatus } from '@/features/orders/lib/orderStatus';
import { COMPANY } from '@/lib/constants';
import { formatDate, formatDateTime, formatPrice } from '@/lib/format';

const MARGIN = 15;
const PAGE_BOTTOM = 280;
const RED = [220, 38, 38];
const GRAY = [107, 114, 128];
const DARK = [31, 41, 55];

// Le PDF standard ne connaît pas l'espace insécable fine utilisée par Intl
const NARROW_SPACES = [0x202f, 0x00a0].map((code) => String.fromCharCode(code));
const pdfText = (value) =>
  NARROW_SPACES.reduce((text, space) => text.replaceAll(space, ' '), String(value ?? ''));

export async function exportOrdersPdf(orders, user) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF('p', 'mm', 'a4');
  let y = 20;

  const write = (text, { size = 10, color = DARK, bold = false, x = MARGIN } = {}) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(pdfText(text), x, y);
  };

  write(`${COMPANY.name} - Historique des commandes`, { size: 18, color: RED, bold: true });
  y += 8;
  write(`Généré le ${formatDate(new Date(), 'full')}`, { color: GRAY });
  y += 5;
  write(`Client : ${user?.email || 'Non renseigné'}`, { color: GRAY });
  y += 5;
  write(`${orders.length} commande${orders.length > 1 ? 's' : ''} au total`, { bold: true });
  y += 10;

  for (const order of orders) {
    if (y > PAGE_BOTTOM - 35) {
      doc.addPage();
      y = 20;
    }
    doc.setDrawColor(229, 231, 235);
    doc.line(MARGIN, y - 5, 195, y - 5);
    write(order.vehicleName, { size: 13, bold: true });
    write(getOrderStatus(order.status).label, { bold: true, color: RED, x: 160 });
    y += 6;
    write(`Commande #${order.reference}`, { size: 9, color: GRAY });
    y += 6;
    write(`Période : ${formatDate(order.startDate)} - ${formatDate(order.endDate)}`);
    y += 6;
    write(`Prix total : ${formatPrice(order.totalPrice)}`, { bold: true });
    y += 6;
    write(`Créée le ${formatDateTime(order.createdAt)}`, { size: 8, color: GRAY });
    y += 12;
  }

  write(`${COMPANY.name} - ${COMPANY.tagline} | ${COMPANY.phone}`, { size: 8, color: GRAY });
  doc.save(`historique-commandes-${new Date().toISOString().slice(0, 10)}.pdf`);
}
