import React from "react";
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
}) {
  return (
    <input
      className="input w-full"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
