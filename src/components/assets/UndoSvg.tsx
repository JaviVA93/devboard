export default function UndoSvg(props?: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            strokeWidth="1.5"
            color="#000"
            viewBox="0 0 24 24"
        >
            <path
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 8H15s0 0 0 0 5 0 5 4.706C20 18 15 18 15 18H6.286"
            ></path>
            <path
                stroke="#000"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 11.5L4 8l3.5-3.5"
            ></path>
        </svg>
    );
}
