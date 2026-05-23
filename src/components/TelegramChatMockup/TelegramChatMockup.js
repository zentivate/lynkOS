import { CheckCheck, ChevronLeft, Mic, Paperclip, Smile } from "lucide-react";
import PhoneShell, { PhoneStatusBar } from "../PhoneShell";
import "../../styles/mockup/TelegramChatMockup.css";
import telegramBackground from "../../assets/telegram.png";

const DEFAULT_MESSAGES = [
  { id: "out-1", type: "out", text: "Good morning!", time: "10:10", read: true },
  { id: "out-2", type: "out", text: "Japan looks amazing!", time: "10:10", read: true },
  {
    id: "out-3",
    type: "out",
    time: "10:15",
    read: true,
    attachment: { name: "IMG_0475.PNG", meta: "2.4 MB", thumb: "sunset" },
  },
  {
    id: "out-4",
    type: "out",
    time: "10:15",
    read: true,
    attachment: { name: "IMG_0481.PNG", meta: "3.1 MB", thumb: "city" },
  },
  {
    id: "in-1",
    type: "in",
    time: "11:40",
    quote: { author: "Martha Craig", text: "Good morning!" },
    text: "Do you know what time is it?",
  },
  { id: "out-5", type: "out", text: "It's morning in Tokyo 😎", time: "11:43", read: true },
  { id: "in-2", type: "in", text: "What is the most popular meal in Japan?", time: "11:45" },
  { id: "in-3", type: "in", text: "Do you like it?", time: "11:45" },
  { id: "out-6", type: "out", text: "I think top two are:", time: "11:50", read: true },
  {
    id: "out-7",
    type: "out",
    time: "11:51",
    read: true,
    attachment: { name: "IMG_0483.PNG", meta: "2.8 MB", thumb: "food" },
  },
  {
    id: "out-8",
    type: "out",
    time: "11:51",
    read: true,
    attachment: { name: "IMG_0484.PNG", meta: "2.6 MB", thumb: "food2" },
  },
];

function MessageBubble({ message, isGrouped }) {
  const isOutgoing = message.type === "out";

  return (
    <div
      className={`telegram-chat-row ${isOutgoing ? "is-out" : "is-in"}${isGrouped ? " is-grouped" : ""}`}
    >
      <div
        className={`telegram-chat-bubble${message.attachment ? " has-attachment" : ""}${message.quote ? " has-quote" : ""}`}
      >
        {message.quote ? (
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
    </div>
  );
}

function TelegramChatMockup({
  visible = true,
  messages = DEFAULT_MESSAGES,
  contactName = "Martha Craig",
  lastSeen = "last seen just now",
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

          <span className="telegram-chat-avatar" aria-hidden="true" />
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
