"use client";

import {
  TabType,
} from "../page";

export default function TabButton({
  label,
  value,
  activeTab,
  setActiveTab,
}: {
  label: string;
  value: TabType;
  activeTab: TabType;
  setActiveTab: (
    v: TabType
  ) => void;
}) {
  return (
    <button
      className={`simakEmployeePage__tab ${
        activeTab === value
          ? "simakEmployeePage__tab--active"
          : ""
      }`}
      onClick={() =>
        setActiveTab(value)
      }
    >
      {label}
    </button>
  );
}