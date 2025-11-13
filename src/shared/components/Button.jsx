import React from "react";
export default function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}) {
  const base =
    variant === "primary"
      ? "btn"
      : variant === "danger"
      ? "btn btn-danger"
      : "btn-ghost";
  return (
    <button className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
}
