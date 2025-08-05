import { FaWhatsapp } from "react-icons/fa";

const WhatsAppLink = ({ payment }) => {
  const mobileWithCountryCode = '+91'+payment?.user?.mobile;
  const dueDate = new Date(payment?.dueDate).toLocaleDateString('en-IN');
  const whatsappMessage = `Hi ${payment?.user?.name}, Your payment is pending from ${dueDate} for the amount of ${payment?.amount}. Please make the payment at the earliest.\n Thank you.\n SDL`;
  const whatsappURL = `https://wa.me/${mobileWithCountryCode}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <td style={{textAlign: "center"}}>
      <a href={whatsappURL} target="_blank" rel="noopener noreferrer">
        <FaWhatsapp size={24} color="green" />
      </a>
    </td>
  );
};

export default WhatsAppLink;