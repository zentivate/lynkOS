import { CheckCheck, ChevronLeft, Mic, Paperclip, Send, Smile } from "lucide-react";
import PhoneShell, { PhoneStatusBar } from "../PhoneShell";
import "../../styles/mockup/TelegramChatMockup.css";
import telegramBackground from "../../assets/telegram.png";

const DEFAULT_MESSAGES = [
  {
    id: "out-need-staff",
    type: "out",
    text: "Need 3 weekend staff in Egham. £12/hr. Friday to Sunday. Immediate start..",
    time: "11:50",
    read: true,
  },
  {
    id: "in-job-structured",
    type: "in",
    time: "11:51",
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

function MessageBubble({ message, isGrouped }) {
  const isOutgoing = message.type === "out";

  return (
    <div
      className={`telegram-chat-row ${isOutgoing ? "is-out" : "is-in"}${isGrouped ? " is-grouped" : ""}`}
    >
      <div className={message.jobCard ? "telegram-chat-job-block" : ""}>
      <div
        className={`telegram-chat-bubble${message.attachment ? " has-attachment" : ""}${message.quote ? " has-quote" : ""}`}
      >
        {message.jobCard ? (
          <div className="telegram-chat-job-copy">
            <p className="telegram-chat-job-title">{message.jobCard.title}</p>
            {message.jobCard.fields.map((field) => (
              <p key={field.label} className="telegram-chat-job-line">
                <span className="telegram-chat-job-label">{field.label}</span>
                <span className="telegram-chat-job-value">{field.value}</span>
              </p>
            ))}
          </div>
        ) : message.quote ? (
          <div className="telegram-chat-quote">
            <span className="telegram-chat-quote-bar" aria-hidden="true" />
            <div className="telegram-chat-quote-copy">
              <span className="telegram-chat-quote-name">{message.quote.author}</span>
              <p className="telegram-chat-quote-text">{message.quote.text}</p>
            </div>
          </div>
        ) : null}

        {message.attachment ? (
          <div className="telegram-chat-media">
            <span
              className={`telegram-chat-thumb telegram-chat-thumb-${message.attachment.thumb}`}
              aria-hidden="true"
            />
            <div className="telegram-chat-media-copy">
              <span className="telegram-chat-media-name">{message.attachment.name}</span>
              <span className="telegram-chat-media-meta">{message.attachment.meta}</span>
            </div>
          </div>
        ) : null}

        {message.text && !message.attachment && !message.quote ? (
          <p className="telegram-chat-bubble-line">
            <span className="telegram-chat-bubble-text">{message.text}</span>
            <span className="telegram-chat-bubble-meta">
              <span className="telegram-chat-time">{message.time}</span>
              {isOutgoing && message.read ? (
                <CheckCheck size={15} strokeWidth={2.4} className="telegram-chat-read" />
              ) : null}
            </span>
          </p>
        ) : message.text ? (
          <p className="telegram-chat-bubble-text">{message.text}</p>
        ) : null}

        {message.attachment || message.quote ? (
          <div className="telegram-chat-bubble-meta telegram-chat-bubble-meta-block">
            <span className="telegram-chat-time">{message.time}</span>
            {isOutgoing && message.read ? (
              <CheckCheck size={15} strokeWidth={2.4} className="telegram-chat-read" />
            ) : null}
          </div>
        ) : null}
      </div>
      {message.jobCard ? (
        <button type="button" className="telegram-chat-job-submit">
          <Send size={14} strokeWidth={2.2} />
          {message.jobCard.actionLabel}
        </button>
      ) : null}
      </div>
    </div>
  );
}

function TelegramChatMockup({
  visible = true,
  messages = DEFAULT_MESSAGES,
  contactName = "Martha Craig",
  lastSeen = "last seen just now",
  avatarSrc = "",
  useBrandMarkAvatar = false,
  className = "",
}) {
  return (
    <PhoneShell visible={visible} className={className}>
      <div className="telegram-chat-top">
        <PhoneStatusBar />

        <header className="telegram-chat-nav">
          <div className="telegram-chat-nav-back">
            <button type="button" className="telegram-chat-nav-btn" aria-label="Back to chats">
              <ChevronLeft size={26} strokeWidth={2.2} />
            </button>
            <span className="telegram-chat-nav-chats">Chats</span>
          </div>

          <div className="telegram-chat-nav-center">
            <p className="telegram-chat-contact-name">{contactName}</p>
            <span className="telegram-chat-contact-sub">{lastSeen}</span>
          </div>

          {useBrandMarkAvatar ? (
            <div className="brand-mark telegram-chat-brand-mark" aria-hidden="true">
              <span className="brand-mark-core" />
            </div>
          ) : avatarSrc ? (
            <img src={avatarSrc} alt="" className="telegram-chat-avatar telegram-chat-avatar-image" />
          ) : (
            <span className="telegram-chat-avatar" aria-hidden="true" />
          )}
        </header>
      </div>

      <main
        className="telegram-chat-body"
        style={{ backgroundImage: `url(${telegramBackground})` }}
      >
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const isGrouped = previous && previous.type === message.type;

          return <MessageBubble key={message.id} message={message} isGrouped={isGrouped} />;
        })}
      </main>

      <footer className="telegram-chat-composer">
        <button type="button" className="telegram-chat-composer-btn" aria-label="Attach file">
          <Paperclip size={24} strokeWidth={2} />
        </button>
        <div className="telegram-chat-input" aria-hidden="true">
          <span className="telegram-chat-input-placeholder">Message</span>
          <Smile size={22} strokeWidth={2} className="telegram-chat-input-icon" />
        </div>
        <button type="button" className="telegram-chat-composer-btn" aria-label="Voice message">
          <Mic size={24} strokeWidth={2} />
        </button>
      </footer>

      <div className="mockup-phone-home-indicator" aria-hidden="true" />
    </PhoneShell>
  );
}

export default TelegramChatMockup;
