import { ReactNode } from "react";

interface IconButtonProps {
  handleClick?: () => void;
  children: ReactNode;
  className?: string;
}

export default function IconButton({
  handleClick,
  children,
  className = "",
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label="icon button"
      onClick={handleClick}
      className={`cursor-pointer outline-none before:content-[''] before:absolute before:-z-10 before:top-0 before:left-0 before:rounded-full before:size-full 
                        before:bg-purple before:blur-[4px] supports-backdrop-filter:before:blur-xs will-change-transform before:opacity-0
                         before:transition before:duration-300 before:ease-out active:before:opacity-20 
                        focus-visible:before:opacity-20 lg:hover:before:opacity-20 ${className}`}
    >
      {children}
    </button>
  );
}
