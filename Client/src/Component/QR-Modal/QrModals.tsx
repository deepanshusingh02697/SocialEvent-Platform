import { QRCodeSVG } from "qrcode.react";
import styles from "./qrModal.module.css";

interface Props {
  eventId: number;
  onClose: () => void;
  isjoin: boolean;
}

export default function QrModal({ eventId, onClose, isjoin }: Props) {
  const joinUrl = `${window.location.origin}/event/${eventId}?autojoin=true`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>
        <h3>Scan to join this event</h3>
        <br />
        <QRCodeSVG value={joinUrl} size={220} />
        {isjoin ? (
          <p className={styles.hint}>
            You've already join this event.
          </p>
        ) : (
          <p className={styles.hint}>
            Scan this QR Code —
            <br />
            It'll open the event and join automatically.
          </p>
        )}
      </div>
    </div>
  );
}
