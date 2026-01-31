import React from "react";

type Genre = "pop" | "rock" | "classical" | "electronic";

type GenreFilterProps = {
  /** currently selected genre; null means "all genres" */
  value: Genre | null;
  /** called when user selects/clears a genre */
  onChange: (next: Genre | null) => void;
  disabled?: boolean;
};

const GENRES: { label: string; value: Genre }[] = [
  { label: "Pop", value: "pop" },
  { label: "Rock", value: "rock" },
  { label: "Classical", value: "classical" },
  { label: "Electronic", value: "electronic" },
];

export default function GenreFilter({
  value,
  onChange,
  disabled,
}: GenreFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter by genre"
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(null)}
        aria-pressed={value === null}
        style={chipStyle(value === null, !!disabled)}
      >
        All
      </button>

      {GENRES.map((g) => {
        const selected = value === g.value;
        return (
          <button
            key={g.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(selected ? null : g.value)} // toggle off if clicked again
            aria-pressed={selected}
            style={chipStyle(selected, !!disabled)}
          >
            {g.label}
          </button>
        );
      })}
    </div>
  );
}

function chipStyle(selected: boolean, disabled: boolean): React.CSSProperties {
  return {
    borderRadius: 999,
    border: "1px solid",
    borderColor: selected ? "#111" : "#ccc",
    background: selected ? "#111" : "#fff",
    color: selected ? "#fff" : "#111",
    padding: "8px 12px",
    fontSize: 14,
    lineHeight: 1,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    userSelect: "none",
  };
}
