import { OrderData } from "./d/type";

export function dateFormating(isoDate: string): string {
  const date = new Date(isoDate);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("id-ID", options);
}

export const generateWhatsAppMessage = (order: any) => {
  // Format customer info
  const customerInfo = `
*Customer Information*
Name: ${order.customer.customer_name}
Phone: ${order.customer.customer_phone}
Email: ${order.customer.customer_email}
`;

  // Format event info
  const eventInfo = `
*Event Details*
Type: ${order.event.event_name}
Date: ${order.event.event_date}
Time: ${order.event.event_time}
Location: ${order.event.event_location}
Building: ${order.event.event_building}
`;

  // Format order summary
  const orderSummary = `
*Order Summary*
Invitations: ${order.invitation}
Visitors: ${order.visitor}
Total Price: ${order.price}
Portions: ${order.portion}
Note: ${order.note || "N/A"}
`;

  // Format sections
  const sectionsInfo = order.sections
    .map((section: any) => {
      const portionsInfo = section.portions.map((portion: any) => `- ${portion.portion_name || "Untitled"}: ${portion.portion_count} x Rp${portion.portion_price} = Rp${portion.portion_total_price}`).join("\n");

      return `
*${section.section_name}*
Price: Rp${section.section_price}
Portions: ${section.section_portion}
Total: Rp${section.section_total_price}
${section.section_note ? `Note: ${section.section_note}` : ""}
${portionsInfo}
`;
    })
    .join("\n");

  // Combine all parts
  const fullMessage = `
*NEW ORDER CONFIRMATION*
${customerInfo}
${eventInfo}
${orderSummary}
${sectionsInfo}

_Generated on ${new Date().toLocaleString()}_
`.trim();

  return encodeURIComponent(fullMessage);
};

export const pushWhatsapMsg = (order: any, phone: string) => {
  generateWhatsAppMessage(order)
  const formattedPhone = `+62${phone.slice(1)}`;
  console.log(formattedPhone)
  const url = `https://wa.me/${formattedPhone}?text=${generateWhatsAppMessage(order)}`;
  window.open(url);
}