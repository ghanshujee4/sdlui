import { FaWhatsapp } from "react-icons/fa";

/**
 * Props:
 * - payment        → single payment object (optional)
 * - payments       → array of payment objects (for Send All)
 * - mode           → "single" | "all"
 * - customMessage  → optional custom text
 * - children       → button or icon UI
 */
import config from "../config";
const WhatsAppLink = ({
  payment,
  payments = [],
  mode = "single",
  customMessage,
  children,
}) => {
  const buildMessage = (p) => {
    const mobile = `+91${p?.user?.mobile}`;
    const amount = p?.amount || 0;
    const due = p?.dueDate ? new Date(p.dueDate) : null;
    const paymentDate = p?.paymentDate ? new Date(p.paymentDate) : null;

    // const formattedDueDate = due
    //   ? due.toLocaleDateString("en-IN")   // dd/mm/yyyy format in India
    //   : "";

    const formattedDueDate = due
      ? `${String(due.getDate()).padStart(2, "0")}-${String(due.getMonth() + 1).padStart(2, "0")}-${due.getFullYear()}`
      : "";


    // Calculate overdue days properly
    const today = new Date();
    const diffDays = due
      ? Math.floor((today - due) / (1000 * 60 * 60 * 24))
      : 0;
    const qrLink = `${config?.ENV_FRONT}/PaymentQr/${p?.id}/${p?.amount}`;
    const diffPaymentDate = paymentDate
      ? Math.floor((today - paymentDate) / (1000 * 60 * 60 * 24))
      : 0;

    const message =
      diffDays > 5 && amount >= 250
        ? `Hi ${p?.user?.name} (${p?.user?.id}), your payment pending from ${formattedDueDate} is ₹${amount}. Please pay at the earliest ${qrLink} to avoid deactivation.

Thank you.
Shastra Digital Library 📚`
        : customMessage ||
        `Hi ${p?.user?.name} (${p?.user?.id}), your payment pending from ${formattedDueDate} is ₹${p?.amount}.

Please pay at the earliest:
${qrLink}

Thank you.
Shastra Digital Library 📚`;

    if (diffPaymentDate >= 0) {
      return {
        mobile,
        url: `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`,
      };
    } else {
      return {};
    }
  };

  const handleClick = () => {
    if (mode === "single" && payment) {
      const { url } = buildMessage(payment);
      window.open(url, "_blank");
    }

    if (mode === "all" && payments.length > 0) {
      payments.forEach((p, index) => {
        const { url } = buildMessage(p);
        setTimeout(() => {
          window.open(url, "_blank");
        }, index * 800); // delay to avoid WhatsApp blocking
      });
    }
  };

  return (
    <span style={{ cursor: "pointer" }} onClick={handleClick}>
      {children || <FaWhatsapp size={24} color="green" />}
    </span>
  );
};

export default WhatsAppLink;
