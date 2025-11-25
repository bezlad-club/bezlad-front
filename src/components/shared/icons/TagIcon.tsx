interface TagIconProps {
    className?: string;
}

export default function TagIcon({ className }: TagIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            aria-label="tag icon"
            className={className}
        >
            <path
                d="M7.68896 16.8631L11.1946 3.83789H12.3289L8.46228 16.8631H7.68896Z"
                fill="currentColor"
            />
            <path
                d="M13.3845 16.2845V14.9225L17.2266 12.087L13.36 9.25152L13.3845 8.03516L17.9998 11.2995V13.02L13.3845 16.2845Z"
                fill="currentColor"
            />
            <path
                d="M5.60229 16.2123V14.8502L1.76025 12.0147L5.62683 9.17925L5.60229 7.96289L0.98698 11.2272V12.9478L5.60229 16.2123Z"
                fill="currentColor"
            />
            <path
                d="M13.5259 4.90279C12.9866 5.44202 11.0095 5.80151 11.0095 5.80151C11.0095 5.80151 10.1107 3.6446 10.2905 2.92563C10.4702 2.20666 11.0095 1.66743 11.0095 1.66743C11.9314 0.692502 12.6645 0.47509 14.0651 0.229492C14.3267 2.09834 14.0651 4.36357 13.5259 4.90279Z"
                fill="currentColor"
            />
        </svg>
    );
}
