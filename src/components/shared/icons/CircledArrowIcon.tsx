interface CircledArrowIconProps {
    className?: string;
}

export default function CircledArrowIcon({ className }: CircledArrowIconProps) {
    return (
        <svg
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="circled arrow icon"
        >
            <path
                d="M14.5 28.25C22.0939 28.25 28.25 22.0939 28.25 14.5C28.25 6.90608 22.0939 0.75 14.5 0.75C6.90608 0.75 0.75 6.90608 0.75 14.5C0.75 22.0939 6.90608 28.25 14.5 28.25Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.2326 19.3537L11.3926 14.5L16.2326 9.64624"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
