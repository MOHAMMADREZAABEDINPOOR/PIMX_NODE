import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
export default function Accordion({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false),
    id = useId(),
    reduced = useReducedMotion();
  return (
    <div className={`accordion ${open ? "is-open" : ""}`}>
      <h3>
        <button
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          onClick={() => setOpen(!open)}
        >
          {question}
          <Plus size={20} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-body`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: reduced ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: reduced ? 0 : 0.2 },
            }}
            className="accordion-reveal"
          >
            <div className="accordion-answer">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
