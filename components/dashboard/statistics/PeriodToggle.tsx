"use client";

interface PeriodOption<T extends string> {
  key: T;
  label: string;
}

export default function PeriodToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (p: T) => void;
  options: PeriodOption<T>[];
}) {
  return (
    <div className="flex rounded-lg bg-hover">
      {options.map(({ key, label }, i) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex h-9 items-center px-3 text-xs transition-colors sm:h-7 ${
            value === key
              ? "bg-pop font-medium text-fg"
              : "text-fg-faint hover:text-fg-muted"
          } ${i === 0 ? "rounded-l-lg" : i === options.length - 1 ? "rounded-r-lg" : ""}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
