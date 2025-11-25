interface CafeArrowIconProps {
    className?: string;
    preserveAspectRatio?: "none" | "xMidYMid meet" | "xMidYMid slice";
}

export default function CafeArrowIcon({
    className,
    preserveAspectRatio = "xMidYMid meet",
}: CafeArrowIconProps) {
    return (
        <svg
            width="41"
            height="55"
            viewBox="0 0 41 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="cafe arrow icon"
            preserveAspectRatio={preserveAspectRatio}
        >
            <path
                d="M1.00007 48.1884C2.40156 42.859 7.78119 28.7882 17.3456 19.8746C20.8842 17.2217 25.58 14.0628 28.6135 12.179C31.6469 10.2952 32.8756 9.78218 36.3954 8.70319"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M22.896 2.56421L39.5974 6.44565"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M39.8388 6.42363C39.8394 6.42142 39.8399 6.41921 39.2114 9.01583C38.583 11.6125 37.3256 16.808 36.0302 22.1609"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}
