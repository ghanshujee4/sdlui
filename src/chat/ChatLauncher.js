import { FaComments } from "react-icons/fa"; // Or use any chat icon SVG or icon font

const ChatLauncher = ({ onClick }) => {
  return (
    <div className="chat-launcher" onClick={onClick}>
      <FaComments className="chat-launcher-icon" />
    </div>
  );
}
export default ChatLauncher;