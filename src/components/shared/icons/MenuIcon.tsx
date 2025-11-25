interface MenuIconProps {
    className?: string;
}

export default function MenuIcon({ className }: MenuIconProps) {
    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="menu icon"
        >
            <path
                d="M6.6665 29.9999H33.3332M6.6665 9.99988H33.3332H6.6665ZM6.6665 19.9999H33.3332H6.6665Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
