import { Battery, Signal, Wifi } from "lucide-react";
import "../../styles/mockup/PhoneShell.css";

const statusIconProps = {
  size: 16,
  strokeWidth: 2.4,
  color: "#000000",
  "aria-hidden": true,
};

export function PhoneStatusBar() {
  return (
    <div className="mockup-phone-status-bar" aria-hidden="true">
      <span className="mockup-phone-status-time">9:41</span>
      <span className="mockup-phone-dynamic-island">
        <span className="mockup-phone-island-camera" />
      </span>
      <div className="mockup-phone-status-icons">
        <Signal {...statusIconProps} />
        <Wifi {...statusIconProps} />
        <Battery {...statusIconProps} size={18} />
      </div>
    </div>
  );
}

function PhoneShell({ visible = true, className = "", children }) {
  const rootClassName = ["mockup-phone-root", visible ? "is-visible" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <div className="mockup-phone-device">
        <div className="mockup-phone-hardware">
          <span className="mockup-phone-btn mockup-phone-btn-mute" aria-hidden="true" />
          <span className="mockup-phone-btn mockup-phone-btn-vol-up" aria-hidden="true" />
          <span className="mockup-phone-btn mockup-phone-btn-vol-down" aria-hidden="true" />
          <span className="mockup-phone-btn mockup-phone-btn-power" aria-hidden="true" />
          <div className="mockup-phone-bezel">
            <div className="mockup-phone-screen">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhoneShell;
