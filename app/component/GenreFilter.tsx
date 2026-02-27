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

function chipClasses(selected: boolean, disabled: boolean) {
  return `
    rounded-full border px-3 py-2 text-sm leading-none select-none
    transition-colors
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 dark:focus-visible:ring-amber-300
    ${
      selected
        ? "bg-slate-900 text-white border-slate-900 dark:bg-amber-300 dark:text-black dark:border-amber-300"
        : "bg-white text-slate-900 border-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
    }
    ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
  `;
}

export default function GenreFilter({
  value,
  onChange,
  disabled,
}: GenreFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter tracks by genre"
      aria-disabled={disabled ? "true" : "false"}
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
        aria-label="Show all genres"
        aria-disabled={disabled ? "true" : "false"}
        className={chipClasses(value === null, !!disabled)}
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
            onClick={() => onChange(selected ? null : g.value)}
            aria-pressed={selected}
            aria-label={
              selected
                ? `${g.label} genre selected`
                : `Filter by ${g.label} genre`
            }
            aria-disabled={disabled ? "true" : "false"}
            className={chipClasses(selected, !!disabled)}
          >
            {g.label}
          </button>
        );
      })}
    </div>
  );
}
