import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Mic,
  MoreHorizontal,
  Phone,
  Plus,
  Smile,
  Video,
} from "lucide-react";
import PhoneShell, { PhoneStatusBar } from "../PhoneShell";
import "../../styles/mockup/TeamsChatMockup.css";

const DEFAULT_MESSAGES = [
  { id: "ts-1", type: "timestamp", text: "Today 8:12 AM" },
  {
    id: "in-1",
    type: "in",
    sender: "Amanda R.",
    text: "Can everyone confirm they got the invite?",
    showAvatar: true,
  },
  { id: "in-2", type: "in", sender: "Amanda R.", text: "👍" },
  { id: "in-3", type: "in", sender: "Elliot E.", text: "Looks great to me!", showAvatar: true },
  { id: "out-1", type: "out", text: "I updated the trivia deck for Saturday." },
  {
    id: "out-2",
    type: "out",
    attachment: { kind: "ppt", name: "Birthday_Trivia.ppt", meta: "2.4 MB" },
  },
  {
    id: "out-3",
    type: "out",
    attachment: { kind: "xlsx", name: "AddressList2020.xlsx", meta: "2.4 MB" },
  },
];

function FileAttachment({ attachment }) {
  const label = attachment.kind === "ppt" ? "P" : "X";
  const modifier = attachment.kind === "ppt" ? "ppt" : "xlsx";

  return (
    <div className="teams-chat-file-card">
      <span className={`teams-chat-file-icon teams-chat-file-icon-${modifier}`}>{label}</span>
      <div className="teams-chat-file-copy">
        <span className="teams-chat-file-name">{attachment.name}</span>
        <span className="teams-chat-file-meta">{attachment.meta}</span>
      </div>
      <MoreHorizontal size={18} strokeWidth={2} className="teams-chat-file-menu" aria-hidden="true" />
    </div>
  );
}

function MessageRow({ message, isGrouped }) {
  if (message.type === "timestamp") {
    return <div className="teams-chat-timestamp">{message.text}</div>;
  }

  const isOutgoing = message.type === "out";

  if (isOutgoing) {
    return (
      <div className={`teams-chat-row is-out${isGrouped ? " is-grouped" : ""}`}>
        <div className={`teams-chat-bubble${message.attachment ? " has-attachment" : ""}`}>
          {message.text ? <p className="teams-chat-bubble-text">{message.text}</p> : null}
          {message.attachment ? <FileAttachment attachment={message.attachment} /> : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`teams-chat-row is-in${isGrouped ? " is-grouped" : ""}`}>
      {message.showAvatar ? (
        <span className="teams-chat-avatar" aria-hidden="true">
          <span className="teams-chat-avatar-status" />
        </span>
      ) : (
        <span className="teams-chat-avatar-spacer" aria-hidden="true" />
      )}
      <div className="teams-chat-incoming">
        {!isGrouped ? <span className="teams-chat-sender">{message.sender}</span> : null}
        <div className="teams-chat-bubble">
          <p className="teams-chat-bubble-text">{message.text}</p>
        </div>
      </div>
    </div>
  );
}

function TeamsChatMockup({
  visible = true,
  messages = DEFAULT_MESSAGES,
  chatTitle = "Ellis Family",
  className = "",
}) {
  return (
    <PhoneShell visible={visible} className={className}>
      <div className="teams-chat-top">
        <PhoneStatusBar />

        <header className="teams-chat-nav">
          <button type="button" className="teams-chat-nav-btn" aria-label="Back">
            <ChevronLeft size={26} strokeWidth={2.2} />
          </button>
          <button type="button" className="teams-chat-nav-title">
            <span>{chatTitle}</span>
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>
          <div className="teams-chat-nav-actions" aria-hidden="true">
            <span className="teams-chat-nav-btn">
              <Video size={22} strokeWidth={2} />
            </span>
            <span className="teams-chat-nav-btn">
              <Phone size={21} strokeWidth={2} />
            </span>
          </div>
        </header>

        <nav className="teams-chat-tabs" aria-label="Chat sections">
          <button type="button" className="teams-chat-tab is-active">
            Chat
          </button>
          <button type="button" className="teams-chat-tab">
            Dashboard
          </button>
        </nav>
      </div>

      <main className="teams-chat-body">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          let isGrouped = false;

          if (message.type !== "timestamp" && previous && previous.type !== "timestamp") {
            if (message.type === "in" && previous.type === "in") {
              isGrouped = message.sender === previous.sender;
            }
            if (message.type === "out" && previous.type === "out") {
              isGrouped = true;
            }
          }

          return <MessageRow key={message.id} message={message} isGrouped={isGrouped} />;
        })}
      </main>

      <footer className="teams-chat-composer">
        <button type="button" className="teams-chat-plus-btn" aria-label="Add">
          <Plus size={22} strokeWidth={2.4} />
        </button>
        <div className="teams-chat-input" aria-hidden="true">
          <span className="teams-chat-input-placeholder">Type a new message</span>
          <Smile size={22} strokeWidth={2} className="teams-chat-input-icon" />
        </div>
        <div className="teams-chat-composer-actions" aria-hidden="true">
          <span className="teams-chat-composer-btn">
            <Camera size={24} strokeWidth={2} />
          </span>
          <span className="teams-chat-composer-btn">
            <Mic size={24} strokeWidth={2} />
          </span>
        </div>
      </footer>

      <div className="mockup-phone-home-indicator" aria-hidden="true" />
    </PhoneShell>
  );
}

export default TeamsChatMockup;
