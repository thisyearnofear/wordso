import { IconX } from "@tabler/icons-react";
import { useOnClickOutside } from "usehooks-ts";
import { useTranslation } from "hooks/use-translations";
import { useCallback, useRef } from "react";

interface ModalProps {
  title: string;
  titleClass: string;
  className?: string;
  children: React.ReactNode;
  active: boolean;
  onClose?: () => void;
}

export function Modal({
  active,
  className,
  children,
  title,
  titleClass,
  onClose,
}: ModalProps) {
  const translation = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    modalRef.current?.classList.remove("active");
    modalOverlayRef.current?.classList.remove("active");
    onClose?.();
  }, [onClose]);

  useOnClickOutside(modalRef, handleClose);

  return (
    <div
      ref={modalOverlayRef}
      className={`modal_overlay ${active ? " active" : ""}`}
    >
      <div
        ref={modalRef}
        className={`modal_finish${active ? " active" : ""} ${className ?? ""}`}
      >
        <div className={`top ${titleClass}`}>{title}</div>
        <div className="data">{children}</div>
        <button
          type="button"
          className="close"
          aria-label={translation.close}
          onClick={handleClose}
        >
          <IconX />
        </button>
      </div>
    </div>
  );
}
