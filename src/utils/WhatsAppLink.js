import { FaWhatsapp } from "react-icons/fa";
import formatDateDDMMYYYY from "./formatDateDDMMYYYY";

const WhatsAppLink = ({ payment, customMessage }) => {
  const mobileWithCountryCode = '+91'+payment?.user?.mobile;
  const qrLink = `/PaymentQr/${payment?.id}/${payment?.amount}`;
  const dueDate = new Date(formatDateDDMMYYYY(payment?.dueDate)).toLocaleDateString('en-IN');
  // const whatsappMessage = `Hi ${payment?.user?.name}, Your payment is pending from ${formatDateDDMMYYYY(dueDate)} for the amount of ${payment?.amount}. Please make the payment at the earliest.\n Thank you.\n SDL`;
  const whatsappMessage = `Hi ${payment?.user?.name} (${payment?.user?.id}), your payment pending from ${dueDate} is ₹${payment?.amount}. Please pay at the earliest ${qrLink}.\n\nThank you.\nShastra Digital Library 📚`;
  const whatsappURL = `https://wa.me/${mobileWithCountryCode}?text=${encodeURIComponent(whatsappMessage)}`;
  if (customMessage) {
    whatsappMessage = customMessage;
  }
  return (
    <td style={{textAlign: "center"}}>
      <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
        <FaWhatsapp size={24} color="green" />
      </a>
    </td>
  );
};

export default WhatsAppLink;