import LoaderIcon from "../icons/LoaderIcon";
import { twMerge } from "tailwind-merge";

interface MainButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit";
  className?: string;
  variant?: "black" | "white" | "outline";
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  loadingText?: string;
  spanClassName?: string;
  icon?: React.ReactNode;
}

export default function MainButton({
  type = "button",
  children,
  className,
  variant = "black",
  disabled = false,
  isLoading = false,
  loadingText = "Надсилання...",
  spanClassName,
  onClick,
  icon,
}: MainButtonProps) {
  const variants = {
    black:
      "bg-black text-white enabled:xl:hover:brightness-125 enabled:focus-visible:brightness-125",
    white:
      "bg-white text-black enabled:xl:hover:bg-purple-ultra-light enabled:focus-visible:bg-purple-ultra-light",
    outline:
      "bg-transparent text-black border border-black enabled:xl:hover:bg-purple-ultra-light enabled:focus-visible:bg-purple-ultra-light",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        `group relative overflow-hidden enabled:cursor-pointer flex items-center justify-center rounded-full 
          disabled:opacity-60  enabled:active:scale-[98%] 
           font-azbuka uppercase will-change-transform transition duration-300 ease-in-out`,
        "w-full",
        variants[variant],
        className
      )}
    >
      <div className="flex lg:items-center justify-between gap-2.5 w-full">
        <p className="relative z-10 w-full">
          {isLoading ? loadingText : children}
        </p>
        {icon ? (
          <span
            className={twMerge(
              "absolute right-1 top-1/2 -translate-y-1/2  flex items-center justify-center rounded-full",
              spanClassName
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      {isLoading ? <LoaderIcon /> : null}
    </button>
  );
}
