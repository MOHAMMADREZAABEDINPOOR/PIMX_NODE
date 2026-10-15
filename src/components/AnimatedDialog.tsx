import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

export default function AnimatedDialog({
  open,
  onClose,
  onAfterClose,
  children,
  className,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  children: ReactNode;
  className: string;
  labelledBy: string;
}) {
  const element = useRef<HTMLDialogElement>(null),
    returnFocus = useRef<HTMLElement | null>(null),
    retained = useRef(children),
    callbacks = useRef({ onClose, onAfterClose });
  const reduced = useReducedMotion();
  callbacks.current = { onClose, onAfterClose };
  if (open) retained.current = children;
  useEffect(() => {
    const dialog = element.current!;
    let cancelled = false;
    if (!open && !dialog.open) return;
    let animation: Animation;
    if (open) {
      if (!dialog.open) {
        returnFocus.current =
          document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        dialog.showModal();
      }
      dialog.dataset.phase = "opening";
      animation = dialog.animate(
        [
          { opacity: 0, transform: "translateY(24px) scale(.96)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ],
        {
          duration: reduced ? 0 : 360,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        },
      );
      void animation.finished
        .then(() => {
          if (!cancelled) dialog.dataset.phase = "open";
        })
        .catch(() => {});
    } else {
      dialog.dataset.phase = "closing";
      animation = dialog.animate(
        [
          { opacity: 1, transform: "translateY(0) scale(1)" },
          { opacity: 0, transform: "translateY(14px) scale(.98)" },
        ],
        {
          duration: reduced ? 0 : 200,
          easing: "cubic-bezier(.4,0,1,1)",
          fill: "both",
        },
      );
      void animation.finished
        .then(() => {
          if (!cancelled) {
            dialog.close();
            if (returnFocus.current?.isConnected)
              returnFocus.current.focus({ preventScroll: true });
            callbacks.current.onAfterClose?.();
          }
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
      animation.cancel();
    };
  }, [open, reduced]);
  useEffect(() => {
    const dialog = element.current!;
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={element}
      className={className}
      aria-labelledby={labelledBy}
      onCancel={(event) => {
        event.preventDefault();
        callbacks.current.onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          callbacks.current.onClose();
      }}
    >
      {open ? children : retained.current}
    </dialog>
  );
}
