import React, { useState } from "react";
export default function Tooltip({ content, children }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute z-20 -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black text-white text-xs">
          {content}
        </span>
      )}
    </span>
  );
}
