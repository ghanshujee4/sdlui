import { FaWhatsapp } from "react-icons/fa";

const AdminWhatsAppSummary = ({ payments, adminNumber }) => {

  const sendSummaryToAdmin = () => {
    if (!payments || payments.length === 0) {
      alert("No overdue payments to send.");
      return;
    }

    let message = "📋 *Overdue Payments Summary*\n\n";

    payments.forEach((payment, index) => {
      message += `${index + 1}. ${payment?.user?.name} - ₹${payment?.amount} - ${payment?.user?.mobile}\n`;
    });

    const totalAmount = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    message += `\n👥 Total Students: ${payments.length}`;
    message += `\n💰 *Total Pending Amount: ₹${totalAmount}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${adminNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <button
      className="btn btn-success me-2"
      onClick={sendSummaryToAdmin}
    >
      <FaWhatsapp className="me-2" />
      Send to Admin
    </button>
  );
};

export default AdminWhatsAppSummary;
