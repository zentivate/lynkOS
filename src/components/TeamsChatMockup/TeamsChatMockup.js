import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Mic,
  MoreHorizontal,
  Phone,
  Plus,
  Send,
  Smile,
  Video,
} from "lucide-react";
import PhoneShell, { PhoneStatusBar } from "../PhoneShell";
import "../../styles/mockup/TeamsChatMockup.css";

const DEFAULT_MESSAGES = [
  {
    id: "out-need-staff",
    type: "out",
    text: "Need 3 weekend staff in Egham. £12/hr. Friday to Sunday. Immediate start..",
  },
  {
    id: "in-job-structured",
    type: "in",
    sender: "LynkOS",
    showAvatar: true,
    jobCard: {
      title: "Job",
      fields: [
        { label: "Role", value: "Weekend Staff" },
        { label: "Location", value: "Egham" },
        { label: "Pay", value: "£12/hr" },
        { label: "Availability", value: "Fri–Sun" },
      ],
      actionLabel: "Submit for verification",
    },
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
        <div className={message.jobCard ? "teams-chat-job-block" : ""}>
          <div className="teams-chat-bubble">
            {message.jobCard ? (
              <div className="teams-chat-job-copy">
                <p className="teams-chat-job-title">{message.jobCard.title}</p>
                {message.jobCard.fields.map((field) => (
                  <p key={field.label} className="teams-chat-job-line">
                    <span className="teams-chat-job-label">{field.label}</span>
                    <span className="teams-chat-job-value">{field.value}</span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="teams-chat-bubble-text">{message.text}</p>
            )}
          </div>
          {message.jobCard ? (
            <button type="button" className="teams-chat-job-submit">
              <Send size={14} strokeWidth={2.2} />
              {message.jobCard.actionLabel}
            </button>
          ) : null}
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
