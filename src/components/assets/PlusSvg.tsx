import React from "react";

export default function PlusSvg(props: { className?: string }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            strokeWidth="1.5"
            color="#fff"
            viewBox="0 0 24 24"
        >
            <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12h6m6 0h-6m0 0V6m0 6v6"
            ></path>
        </svg>
    );
}
