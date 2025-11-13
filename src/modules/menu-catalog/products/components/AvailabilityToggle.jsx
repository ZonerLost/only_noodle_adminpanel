import React from "react";
import { toggleAvailability } from "../../api/catalog.service.js";

export default function AvailabilityToggle({ id, value, onChange }) {
  async function toggle() {
    await toggleAvailability(id, !value);
    onChange && onChange(!value);
  }
  return (
    <button
      onClick={toggle}
      className={`px-2 py-0.5 rounded-full text-xs ${
        value
          ? "bg-green-500/15 text-green-700"
          : "bg-gray-500/15 text-gray-700"
      }`}
    >
      {value ? "active" : "inactive"}
    </button>
  );
}
