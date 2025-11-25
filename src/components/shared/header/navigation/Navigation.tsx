"use client";
import { Dispatch, SetStateAction } from "react";
import { navList } from "./navList";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

interface NavigationProps {
    className?: string;
    variant?: "default" | "burger";
    setIsHeaderMenuOpened?: Dispatch<SetStateAction<boolean>>;
}

export default function Navigation({
    className,
    variant = "default",
    setIsHeaderMenuOpened,
}: NavigationProps) {
    return (
        <nav className={className}>
            <ul
                className={twMerge(
                    "flex items-center gap-7 w-full",
                    variant === "burger" && "flex-col gap-5 items-start"
                )}
            >
                {navList.map(item => (
                    <li key={item.href}>
                        <Link
                            onClick={() => {
                                if (setIsHeaderMenuOpened)
                                    setIsHeaderMenuOpened(false);
                            }}
                            href={`/${item.href}`}
                            className="cursor-pointer text-black font-azbuka uppercase text-4 leading-[120%] xl:hover:text-purple xl:focus-visible:text-purple transition duration-300 ease-in-out"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
