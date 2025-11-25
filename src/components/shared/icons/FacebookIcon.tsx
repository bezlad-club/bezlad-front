interface FacebookIconProps {
    className?: string;
}

export default function FacebookIcon({ className }: FacebookIconProps) {
    return (
        <svg
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="facebook icon"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M21.9375 0H5.0625C3.71984 0 2.43217 0.533369 1.48277 1.48277C0.533369 2.43217 0 3.71984 0 5.0625V21.9375C0 23.2802 0.533369 24.5678 1.48277 25.5172C2.43217 26.4666 3.71984 27 5.0625 27H21.9375C23.2802 27 24.5678 26.4666 25.5172 25.5172C26.4666 24.5678 27 23.2802 27 21.9375V5.0625C27 3.71984 26.4666 2.43217 25.5172 1.48277C24.5678 0.533369 23.2802 0 21.9375 0ZM21.252 14.541H18.726V23.892H14.505V14.541H12.867V11.391H14.505V9.381C14.505 6.7515 15.6 5.1885 18.6975 5.1885H21.8385V8.3265H20.01C18.8025 8.3265 18.7245 8.7765 18.7245 9.6165L18.7215 11.385H21.591L21.246 14.535L21.252 14.541Z"
                fill="currentColor"
            />
        </svg>
    );
}
