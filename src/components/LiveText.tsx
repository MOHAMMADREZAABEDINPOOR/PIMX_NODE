import type { CSSProperties } from "react";

// Transitions keep their current position when hover is interrupted.
// Whole words preserve Persian joining; screen readers get plain text.
export default function LiveText({ text }: { text: string }) {
  return (
    <span className="live-text">
      <span className="visually-hidden">{text}</span>
      {text.split("\n").map((line, lineIndex) => (
        <span className="live-line" aria-hidden="true" key={lineIndex}>
          {line.split(" ").map((word, index) => (
            <span
              className="live-word"
              key={index}
              style={{ "--word": index + lineIndex * 4 } as CSSProperties}
            >
              {word}{" "}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
