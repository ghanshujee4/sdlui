import { Icon } from "lucide-react";

const IconButton = ({ Icon, label, onClick, className = "", iconClass = "" }) => {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer text-blue-600 hover:underline ${className}`}
      onClick={onClick}
    >
      <Icon className={`text-xl ${iconClass}`} />
      <span> {label}</span>
    </div>
  );
};

export default IconButton;
