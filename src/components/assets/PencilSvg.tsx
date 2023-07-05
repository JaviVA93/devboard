
export default function PencilSvg(props?: { className?: string }) {
    return (
        <svg
            className={props?.className}
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            fill="none"
            viewBox="0 0 24 24"
        >
            <g>
                <path
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v4h4L18.869 9.131h0c.396-.396.594-.594.668-.822a1 1 0 000-.618c-.074-.228-.272-.426-.668-.822l-1.74-1.74c-.395-.394-.592-.592-.82-.666a1 1 0 00-.618 0c-.228.074-.426.272-.82.667l-.002.001L4 16.001z"
                ></path>
            </g>
        </svg>
    );
}

