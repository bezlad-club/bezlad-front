"use client";
import { useMemo } from "react";
import { SwiperSlide } from "swiper/react";
import {
    interactiveZonesData,
    InteractiveZoneItem,
} from "../interactiveZonesData";
import {
    BREAKPOINT_TABLET,
    BREAKPOINT_DESKTOP,
    TABLET_CARDS_STYLES,
    MOBILE_CARDS_STYLES,
} from "./slidesLayouts";
import { SwiperWrapper } from "@/components/shared/swiper/SwiperWrapper";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { renderCard } from "./cardMapper";
import { getSlides } from "./helpers";
import dynamic from "next/dynamic";

function InteractiveZonesBlock() {
    const screenWidth = useScreenWidth();

    const breakpoint: "desktop" | "tablet" | "mobile" =
        screenWidth >= BREAKPOINT_DESKTOP
            ? "desktop"
            : screenWidth >= BREAKPOINT_TABLET
              ? "tablet"
              : "mobile";

    const slides = useMemo(
        () =>
            getSlides(
                breakpoint,
                breakpoint === "desktop"
                    ? interactiveZonesData.sort(
                          (a, b) => a.desktopId - b.desktopId
                      )
                    : interactiveZonesData.sort((a, b) => a.id - b.id)
            ),
        [breakpoint]
    );

    const renderSlides = useMemo(() => {
        if (breakpoint === "desktop") {
            return (slides as InteractiveZoneItem[][][]).map(
                (slide, slideIndex) => (
                    <SwiperSlide key={breakpoint + "-" + slideIndex}>
                        {({ isVisible }) => (
                            <div
                                className="flex flex-row gap-[14px]"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transition: "opacity 0.3s ease-in-out",
                                }}
                            >
                                {slide.map((chunk, chunkIndex) => (
                                    <div
                                        key={
                                            breakpoint +
                                            "-" +
                                            slideIndex +
                                            "-" +
                                            chunkIndex
                                        }
                                        className="flex flex-wrap gap-[14px]"
                                    >
                                        {chunk.map(
                                            (item: InteractiveZoneItem) => (
                                                <div key={item.id}>
                                                    {renderCard(item)}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SwiperSlide>
                )
            );
        } else {
            return (slides as InteractiveZoneItem[][]).map(
                (slide, slideIndex) => (
                    <SwiperSlide key={breakpoint + "-" + slideIndex}>
                        {({ isVisible }) => (
                            <div
                                className={
                                    breakpoint === "tablet"
                                        ? TABLET_CARDS_STYLES
                                        : MOBILE_CARDS_STYLES
                                }
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transition: "opacity 0.3s ease-in-out",
                                }}
                            >
                                {slide.map((item: InteractiveZoneItem) => (
                                    <div
                                        key={
                                            breakpoint +
                                            "-" +
                                            slideIndex +
                                            "-" +
                                            item.id
                                        }
                                    >
                                        {renderCard(item)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SwiperSlide>
                )
            );
        }
    }, [slides, breakpoint]);

    return (
        <SwiperWrapper
            pagination={breakpoint !== 'desktop'}
            navigation={breakpoint === 'desktop'}
            overflowVisible={true}
            spaceBetween={30}
            controllsVariant='black'
        >
            {renderSlides}
        </SwiperWrapper>
    );
}

export default InteractiveZonesBlock;

export const InteractiveZonesBlockDynamic = dynamic(
    () => Promise.resolve(InteractiveZonesBlock),
    {
        ssr: false,
    }
);
