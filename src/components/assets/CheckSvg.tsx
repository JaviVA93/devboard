
export default function CheckSvg(props?: { className?: string }) {
    return (
        <svg
            className={props?.className}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
        >
            <path
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M17 5L8 15l-5-4"
            ></path>
        </svg>
    );
}

