import React from "react";
export default function Select({ className = "", ...rest }) {
  return <select className={`input ${className}`} {...rest} />;
}
