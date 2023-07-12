import { CSSProperties } from "react";

export default function CopySvg(props?: { className?: string, style?: CSSProperties, color?: string }) {
  return (
    <svg
      className={props?.className}
      style={props?.style}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      strokeWidth="1.5"
      color={props?.color || "#000"}
      viewBox="0 0 24 24"
    >
      <path
        stroke={props?.color || "#000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 20H9.6a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h9.8a.6.6 0 01.6.6v9.8a.6.6 0 01-.6.6z"
      ></path>
      <path
        stroke={props?.color || "#000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 9V4.6a.6.6 0 00-.6-.6H4.6a.6.6 0 00-.6.6v9.8a.6.6 0 00.6.6H9"
      ></path>
    </svg>
  );
}

