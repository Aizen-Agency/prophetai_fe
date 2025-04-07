const RevealText = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const perCharDelay = text.length > 30 ? 0.01 : 0.05;

  return (
    <span className={`inline-block`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`reveal-letter inline-block ${className}`}
          style={{
            animationDelay: `${delay + (i * perCharDelay)}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default RevealText; 