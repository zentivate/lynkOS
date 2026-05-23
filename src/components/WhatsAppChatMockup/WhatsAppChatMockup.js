import {
  Camera,
  CheckCheck,
  ChevronLeft,
  FileText,
  Mic,
  Phone,
  Plus,
  StickyNote,
  Video,
} from "lucide-react";
import PhoneShell, { PhoneStatusBar } from "../PhoneShell";
import "../../styles/mockup/WhatsAppChatMockup.css";
import wpBackground from "../../assets/wp.png";

const DEFAULT_MESSAGES = [
  { id: "date", type: "date", text: "Fri, Jul 26" },
  { id: "out-1", type: "out", text: "Good morning!", time: "10:10", read: true },
  { id: "out-2", type: "out", text: "Japan looks amazing!", time: "10:10", read: true },
  {
    id: "out-3",
    type: "out",
    time: "10:15",
    read: true,
    attachment: { name: "IMG_0475", meta: "2.4 MB · png" },
  },
  {
    id: "out-4",
    type: "out",
    time: "10:15",
    read: true,
    attachment: { name: "IMG_0481", meta: "3.1 MB · png" },
  },
  { id: "in-1", type: "in", text: "Do you know what time is it?", time: "11:40" },
  { id: "out-5", type: "out", text: "It's morning in Tokyo 😎", time: "11:43", read: true },
  { id: "in-2", type: "in", text: "What is the most popular meal in Japan?", time: "11:45" },
  { id: "in-3", type: "in", text: "Do you like it?", time: "11:45" },
  { id: "out-6", type: "out", text: "I think top two are:", time: "11:50", read: true },
  {
    id: "out-7",
    type: "out",
    time: "11:51",
    read: true,
    attachment: { name: "IMG_0483", meta: "2.8 MB · png" },
  },
  {
    id: "out-8",
    type: "out",
    time: "11:51",
    read: true,
    attachment: { name: "IMG_0484", meta: "2.6 MB · png" },
  },
];

function MessageBubble({ message, isGrouped }) {
  if (message.type === "date") {
    return <div className="whatsapp-chat-date">{message.text}</div>;
  }

  const isOutgoing = message.type === "out";

  return (
    <div
      className={`whatsapp-chat-row ${isOutgoing ? "is-out" : "is-in"}${isGrouped ? " is-grouped" : ""}`}
    >
      <div className={`whatsapp-chat-bubble${message.attachment ? " has-attachment" : ""}`}>
        {message.attachment ? (
          <>
            <div className="whatsapp-chat-attachment-card">
              <FileText size={26} strokeWidth={1.8} className="whatsapp-chat-file-icon" />
              <div className="whatsapp-chat-attachment-copy">
                <p className="whatsapp-chat-file-name">{message.attachment.name}</p>
                <p className="whatsapp-chat-file-meta">{message.attachment.meta}</p>
              </div>
            </div>
            <div className="whatsapp-chat-bubble-meta">
              <span className="whatsapp-chat-time">{message.time}</span>
              {isOutgoing && message.read ? (
                <CheckCheck size={15} strokeWidth={2.2} className="whatsapp-chat-read" />
              ) : null}
            </div>
          </>
        ) : (
          <p className="whatsapp-chat-bubble-line">
            <span className="whatsapp-chat-bubble-text">{message.text}</span>
            <span className="whatsapp-chat-bubble-meta">
              <span className="whatsapp-chat-time">{message.time}</span>
              {isOutgoing && message.read ? (
                <CheckCheck size={15} strokeWidth={2.2} className="whatsapp-chat-read" />
              ) : null}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function WhatsAppChatMockup({
  visible = true,
  messages = DEFAULT_MESSAGES,
  contactName = "Martha Craig",
  contactSubtext = "tap here for contact info",
  className = "",
}) {
  return (
    <PhoneShell visible={visible} className={className}>
      <div className="whatsapp-chat-top">
        <PhoneStatusBar />

        <header className="whatsapp-chat-nav">
          <button type="button" className="whatsapp-chat-nav-btn" aria-label="Back">
            <ChevronLeft size={28} strokeWidth={2.2} />
          </button>
          <div className="whatsapp-chat-nav-profile">
            <span className="whatsapp-chat-avatar" aria-hidden="true" />
            <div className="whatsapp-chat-contact">
              <p className="whatsapp-chat-contact-name">{contactName}</p>
              <span className="whatsapp-chat-contact-sub">{contactSubtext}</span>
            </div>
          </div>
          <div className="whatsapp-chat-nav-actions" aria-hidden="true">
            <span className="whatsapp-chat-nav-btn">
              <Video size={22} strokeWidth={2} />
            </span>
            <span className="whatsapp-chat-nav-btn">
              <Phone size={21} strokeWidth={2} />
            </span>
          </div>
        </header>
      </div>

      <main className="whatsapp-chat-body" style={{ backgroundImage: `url(${wpBackground})` }}>
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const isGrouped =
            previous &&
            previous.type !== "date" &&
            message.type !== "date" &&
            previous.type === message.type;

          return <MessageBubble key={message.id} message={message} isGrouped={isGrouped} />;
        })}
      </main>

      <footer className="whatsapp-chat-composer">
        <button type="button" className="whatsapp-chat-composer-btn" aria-label="Add">
          <Plus size={26} strokeWidth={2} />
        </button>
        <div className="whatsapp-chat-input" aria-hidden="true">
          <StickyNote size={22} strokeWidth={2} className="whatsapp-chat-input-icon" />
        </div>
        <div className="whatsapp-chat-composer-actions" aria-hidden="true">
          <span className="whatsapp-chat-composer-btn">
            <Camera size={24} strokeWidth={2} />
          </span>
          <span className="whatsapp-chat-composer-btn">
            <Mic size={24} strokeWidth={2} />
          </span>
        </div>
      </footer>

      <div className="mockup-phone-home-indicator" aria-hidden="true" />
    </PhoneShell>
  );
}

export default WhatsAppChatMockup;
