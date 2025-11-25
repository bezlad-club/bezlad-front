interface LibraryArrowIconProps {
    className?: string;
}

export default function LibraryArrowIcon({ className }: LibraryArrowIconProps) {
    return (
        <svg
            width="58"
            height="46"
            viewBox="0 0 58 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="library arrow icon"
        >
            <path
                d="M9.69658 44.9291C9.91365 44.8506 12.3332 43.9746 16.3791 42.4262C19.2159 41.1481 21.2383 39.7611 26.4752 33.0491C30.8217 27.1419 38.5975 16.1565 45.4283 3.0824"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M47.4986 1.02747C47.5238 1.09708 47.7263 1.78777 48.0408 3.32196C48.1656 4.20132 48.2201 5.28534 47.9629 8.00695C47.7056 10.7286 47.1349 15.0549 46.5469 19.5124"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M26.8155 8.4374C26.7931 8.44548 26.7708 8.45356 30.1474 7.23115C33.5239 6.00874 40.3 3.5556 47.7688 1.00024"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}
