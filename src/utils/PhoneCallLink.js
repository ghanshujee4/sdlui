import { FaPhone } from "react-icons/fa";

const PhoneCallLink = ({ payment }) => {
  const mobileWithCountryCode = '+91' + payment?.user?.mobile;
  const telLink = `tel:${mobileWithCountryCode}`;

  return (
    <td style={{textAlign: "center"}}>
      <a href={telLink}>
        <FaPhone size={18} color="#007bff" style={{ transform: "rotate(90deg)" }} /> {/* Bootstrap blue */}
      </a>
    </td>
  );
};

export default PhoneCallLink;
