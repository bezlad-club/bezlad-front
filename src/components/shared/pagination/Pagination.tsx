"use client";
import { useState, ReactNode, RefObject } from "react";
import clsx from "clsx";
import CircledArrowIcon from "../icons/CircledArrowIcon";

interface PaginationProps<T> {
    items: T[];
    renderItems: (items: T[]) => ReactNode;
    useItemsPerPage: () => number;
    scrollTargetRef: RefObject<HTMLDivElement | null>;
    className?: string;
}

export default function Pagination<T>({
    items,
    renderItems,
    useItemsPerPage,
    scrollTargetRef,
    className = "",
}: PaginationProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = useItemsPerPage();
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const currentItems = items.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;

        setCurrentPage(page);

        requestAnimationFrame(() => {
            scrollTargetRef?.current?.scrollIntoView({
                block: "start",
            });
        });
    };

    return (
        <>
            <div key={currentPage} className={`${className} w-full`}>
                {renderItems(currentItems)}
            </div>
            {totalPages > 1 && (
                <div className="w-full flex items-center justify-center gap-[35px]">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="shrink-0 enabled:cursor-pointer w-[50px] h-[50px] rounded-full flex items-center justify-center pointer-events-auto transition-filter 
          duration-300 xl:enabled:hover:brightness-[1.25] bg-white disabled:bg-transparent disabled:border-11 disabled:border-transparent disabled:shadow-[0_0_0_1.5px_#ffffff]"
                    >
                        <CircledArrowIcon
                            className={clsx(
                                "w-[28px] h-[28px]",
                                currentPage === 1 ? "text-white" : "text-purple"
                            )}
                        />
                    </button>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="shrink-0 enabled:cursor-pointer w-[50px] h-[50px] rounded-full flex items-center justify-center pointer-events-auto transition-filter 
          duration-300 xl:enabled:hover:brightness-[1.25] bg-white disabled:bg-transparent disabled:border-11 disabled:border-transparent disabled:shadow-[0_0_0_1.5px_#ffffff]"
                    >
                        <CircledArrowIcon
                            className={clsx(
                                "w-[28px] h-[28px] rotate-180",
                                currentPage === totalPages
                                    ? "text-white"
                                    : "text-purple"
                            )}
                        />
                    </button>
                </div>
            )}
        </>
    );
}
