
export default function ImageFileSvg(props?: { className?: string }) {
    return (
        <svg
            className={props?.className || ''}
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 20 20"
        >
            <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <g fill="#000" transform="translate(-220 -1479)">
                    <g transform="translate(56 160)">
                        <path d="M176 1329.078a.999.999 0 012 0 .999.999 0 01-2 0zm.75 2.94l3.25 3.937h-12l4.518-5.931 2.836 4.041 1.396-2.046zm5.25 4.042c0 .55-.448.893-1 .893h-14c-.552 0-1-.342-1-.893v-13.963c0-.55.448-1.102 1-1.102h9v4.094c0 1.101.895 1.89 2 1.89h4v9.081zm1.707-11.29l-5.414-5.426c-.188-.186-.442-.344-.707-.344H166v.053c-1.105 0-2 .919-2 2.02v15.984c0 1.101.895 1.943 2 1.943v-.053h16v.053c1.105 0 2-.868 2-1.969v-11.529c0-.264-.105-.545-.293-.731z"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
}

