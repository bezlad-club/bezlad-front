"use client";

import clsx from "clsx";
import Image from "next/image";
import React from "react";
import StarIcon from "@/components/shared/icons/StarIcon";
import DashedArrow from "@/components/shared/icons/DashedArrow";
import AnimatedAnimal from "@/components/shared/animatedAnimal/AnimatedAnimal";
import { Noodle, Noodle2, Noodle3 } from "@/components/shared/icons/Noodle";
import type { Direction, PictureSize } from "../interactiveZonesData";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { BREAKPOINT_DESKTOP } from "./slidesLayouts";
import { twMerge } from "tailwind-merge";

export interface InterativeZonesCardProps {
    title: string;
    image: string;
    direction?: Direction;
    desktopDirection?: Direction;
    pictureSize?: PictureSize;
}

// Common style constants to avoid duplication
const COMMON_CARD_BASE = "w-full h-[117px] sm:h-[145px] md:h-[165px]";
const COMMON_CARD_ROUNDED =
    "rounded-[14px] sm:rounded-[16px] md:rounded-[18px]";
const COMMON_CARD_PADDING = "px-4 py-3 sm:px-5 sm:py-4 md:p-5";
const COMMON_TEXT_STYLE =
    "text-base sm:text-lg md:text-[24px] font-azbuka leading-[120%] uppercase";
const COMMON_TEXT_BOTTOM = "bottom-3 sm:bottom-4 md:bottom-5";
const YELLOW_GRADIENT_BG =
    "linear-gradient(164.01deg, var(--color-yellow-gradient-start) 7%, var(--color-yellow-gradient-end) 59.69%)";

export const GlassCard = React.memo(
    ({
        title,
        image,
        direction = "right",
        desktopDirection,
    }: InterativeZonesCardProps) => {
        const screenWidth = useScreenWidth();
        const isDesktop = screenWidth >= BREAKPOINT_DESKTOP;
        const effectiveDirection =
            isDesktop && desktopDirection ? desktopDirection : direction;

        const directionVariant = {
            left: {
                //fountain zone
                imageSize: { width: 224, height: 214 },
                imageClassName:
                    "md:max-w-[272px] md:max-h-[260px] lg:w-[272px] lg:h-[260px] object-cover absolute top-[-75px] md:top-[-91px] right-[-57px] md:right-[-97px] lg:top-[-91px] lg:right-[-130px] xl:right-[-11px]",
                textClassName: `${COMMON_TEXT_BOTTOM} z-1 items-start lg:max-w-[146px]`,
                starClassName: "ml-[-8px] lg:ml-[8px] lg:mb-[6px]",
                cardClassName: "lg:h-[189px]",
            },
            right: {
                // kinetic sand
                imageSize: { width: 198, height: 189.2 },
                imageClassName:
                    "md:w-[272px] md:h-[260px] lg:w-[273px] lg:h-[251px] top-[-54px] md:top-[-91px] lg:top-[-117px] left-[-59px] md:left-[175px] lg:left-[-97px]",
                textClassName:
                    "bottom-3 right-4 sm:right-5 sm:bottom-4 md:bottom-4.5 z-1 items-end lg:max-w-[146px] lg:text-right lg:leading-[120%]",
                cardClassName: "lg:h-[201px]",
                starClassName: "lg:hidden",
            },
        };

        const variant = directionVariant[effectiveDirection];
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                style={{
                    backgroundImage:
                        "linear-gradient(129.84deg, #000000 27.26%, #FFFFFF 97.59%)",
                    backdropFilter: "blur(38px)",
                    boxShadow: "0px 4px 12px 0px #FFFFFF1F inset",
                }}
                className={clsx(
                    "p-px overflow-hidden",
                    COMMON_CARD_BASE,
                    variant.cardClassName,
                    COMMON_CARD_ROUNDED
                )}
            >
                <div
                    className={clsx(
                        "w-full h-full relative bg-white",
                        COMMON_CARD_PADDING,
                        "overflow-hidden",
                        COMMON_CARD_ROUNDED
                    )}
                >
                    <div
                        className={clsx(
                            "absolute flex flex-col gap-1 xl:gap-[9px] items-end md:items-start md:max-w-[146px]",
                            variant.textClassName
                        )}
                    >
                        <StarIcon
                            className={clsx(
                                "text-purple w-[35px] h-[35px]",
                                variant.starClassName
                            )}
                        />
                        <p className={COMMON_TEXT_STYLE}>{title}</p>
                    </div>
                    <Image
                        src={image}
                        alt={title}
                        width={variant.imageSize.width}
                        height={variant.imageSize.height}
                        loading="lazy"
                        className={clsx(
                            "object-cover absolute rounded-full",
                            variant.imageClassName
                        )}
                    />
                </div>
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";

export const PurpleBlobCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    " lg:h-[201px] bg-purple",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING
                )}
            >
                <div
                    className={twMerge(
                        "absolute",
                        COMMON_TEXT_BOTTOM,
                        "z-2 lg:bottom-4"
                    )}
                >
                    <p
                        className={twMerge(
                            COMMON_TEXT_STYLE,
                            "text-white lg:max-w-[154px] "
                        )}
                    >
                        {title}
                    </p>
                </div>
                <div className="w-[207.5px] h-[198px] md:w-[207.5px] md:h-[198px] lg:w-[349px] lg:h-[288px] absolute z-2 top-[-65px] md:top-[-75px] lg:top-[-168px] xl:top-[-128px] right-[-80.5px] md:right-[-40.5px] lg:right-[-134px] xl:right-[-134px]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover lg:hidden"
                    />
                    <Image
                        src="/images/interactiveZone/magnetWall.webp"
                        alt="magnet wall"
                        fill
                        loading="lazy"
                        className="object-cover hidden lg:block"
                    />
                </div>
                <div className="w-[153.74px] h-[60.2px] md:hidden lg:block xl:block lg:w-[220px] xl:w-[309px] z-1 lg:h-[85px] xl:h-[121px] text-purple absolute top-[70px] left-[5px] lg:top-[280px] xl:top-[322px] lg:left-[-12px] pointer-events-none">
                    <div className="bg-purple blur-[10.8466px] w-full h-full" />
                </div>
                <Image
                    src="/images/interactiveZone/blobsHorizontal.svg"
                    alt="blobs horizontal"
                    fill
                    className="absolute inset-0 pointer-events-none lg:hidden"
                />
                <Image
                    src="/images/interactiveZone/purpleBlobsDesk.svg"
                    alt="blobs vertical"
                    fill
                    className="absolute inset-0 pointer-events-none lg:block hidden"
                />
            </div>
        );
    }
);
PurpleBlobCard.displayName = "PurpleBlobCard";

export const YellowElipseCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div className="relative overflow-visible">
                <div
                    role="article"
                    aria-label={`Interactive zone: ${title}`}
                    className={clsx(
                        "relative",
                        COMMON_CARD_BASE,
                        "lg:h-[410px]",
                        COMMON_CARD_ROUNDED,
                        COMMON_CARD_PADDING,
                        "overflow-hidden"
                    )}
                    style={{ background: YELLOW_GRADIENT_BG }}
                >
                    <div
                        className={clsx(
                            "absolute lg:right-5 z-2",
                            COMMON_TEXT_BOTTOM
                        )}
                    >
                        <p
                            className={clsx(
                                COMMON_TEXT_STYLE,
                                "max-w-[103px] md:max-w-[154px] lg:text-right"
                            )}
                        >
                            {title}
                        </p>
                    </div>
                    <div className="lg:hidden z-1 w-[263px] h-[225.7px] xl:w-[263px] xl:h-[225.7px] absolute top-[-93px] right-[-88px] xl:top-[-57px] xl:left-[226px] pointer-events-none">
                        <div className="bg-yellow-light blur-[40.6624px] w-full h-full" />
                    </div>
                    <Noodle
                        preserveAspectRatio="none"
                        className="hidden lg:block w-full h-[185px] text-yellow-detail absolute bottom-0 left-0"
                    />
                </div>
                <AnimatedAnimal
                    svgPath={image}
                    className="z-2 w-[162.7px] h-[196.6px] md:w-[226.8px] md:h-auto lg:w-[286.8px] lg:h-[360.5px] absolute top-[-80px] sm:top-[-80px] md:top-[-110px] lg:top-[-115px] -right-px sm:right-[23px] md:right-[-7px] lg:right-[-22px] pointer-events-none"
                    maxPupilMovement={3}
                />
            </div>
        );
    }
);
YellowElipseCard.displayName = "YellowElipseCard";

export const PurpleNoiseCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                className={clsx(
                    "overflow-hidden relative",
                    COMMON_CARD_BASE,
                    "lg:h-[189px] bg-purple",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING
                )}
            >
                <div className={clsx("absolute", COMMON_TEXT_BOTTOM, "z-3")}>
                    <p
                        className={twMerge(
                            COMMON_TEXT_STYLE,
                            "text-white leading-[150%] lg:leading-[120%]"
                        )}
                    >
                        {title}
                    </p>
                </div>
                <div className="absolute w-[219px] h-[209px] md:w-[323px] md:h-[308.6px] lg:w-[323px] lg:h-[308px] z-1 top-[-62px] sm:top-[-36px] md:top-[-57px] lg:top-[-57px] right-[-33px] sm:right-[-35px] md:right-[-179px] lg:right-[-92px]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover rounded-full"
                    />
                </div>
                <Image
                    src="/images/interactiveZone/noise.webp"
                    alt="noise"
                    fill
                    className="absolute inset-0  pointer-events-none object-cover"
                />
            </div>
        );
    }
);
PurpleNoiseCard.displayName = "PurpleNoiseCard";

export const GrayCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    "bg-gray-dark lg:h-[189px]",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING
                )}
            >
                <div
                    className={clsx(
                        "absolute",
                        COMMON_TEXT_BOTTOM,
                        "z-1",
                        "max-w-[135px] z-11 leading-[150%]"
                    )}
                >
                    <p
                        className={clsx(
                            COMMON_TEXT_STYLE,
                            "text-white lg:max-w-[198px] xl:max-w-[198px]"
                        )}
                    >
                        {title}
                    </p>
                </div>
                <div
                    className={clsx(
                        "absolute z-10 rounded-full overflow-hidden",
                        "w-[158px] h-[152px] md:w-[323px] md:h-[308.6px] lg:w-[323px] lg:h-[308px] top-[-14px] md:top-[-143px] lg:top-[-56px] right-[-32px] sm:right-[-3px] md:right-[-158px] lg:right-[-130px] xl:right-[-91px]"
                    )}
                >
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="rounded-full object-cover"
                    />
                </div>
                <Image
                    src="/images/interactiveZone/noise.webp"
                    alt="noise"
                    fill
                    className="hidden lg:block absolute inset-0  pointer-events-none object-cover"
                />
            </div>
        );
    }
);
GrayCard.displayName = "GrayCard";

export const BlackCard = React.memo(
    ({
        title,
        image,
        direction = "left",
        desktopDirection,
    }: InterativeZonesCardProps) => {
        const screenWidth = useScreenWidth();
        const isDesktop = screenWidth >= BREAKPOINT_DESKTOP;
        const effectiveDirection =
            isDesktop && desktopDirection ? desktopDirection : direction;

        const directionVariant = {
            left: {
                //lego
                imageSize: { width: 190, height: 181 },
                imageClassName:
                    "w-[190px] h-[181px] md:w-[230px] md:h-[220px] lg:w-[272px] lg:h-[260px] object-cover absolute top-[-16px] md:top-[-26.3px] lg:top-[-91px] right-[-8px] md:right-[-70px] lg:right-[-5px]",
                arrowClassName:
                    "top-[-17px] left-[-8.97px] z-10 rotate-[-165deg] lg:left-[-52px]",
                textClassName: `${COMMON_TEXT_BOTTOM} z-1`,
                cardClassName: "lg:h-[189px]",
            },
            right: {
                //engineer
                imageSize: { width: 170, height: 162 },
                imageClassName:
                    "w-[170px] h-[162px] md:w-[272px] md:h-[260px] lg:w-[404px] lg:h-[386px] object-cover absolute top-[-26px] md:top-[-91px] lg:top-[-72px] left-[-32px] md:right-[-97px] lg:left-[11px] shrink-0",
                arrowClassName:
                    "w-fit top-[-4px] right-[26px] z-10 rotate-[-32deg] lg:w-[166px] lg:h-[93px] lg:top-[220px] lg:left-[-36px] lg:rotate-[238deg]",
                textClassName:
                    "bottom-3 right-4 md:right-5 md:bottom-5 lg:right-auto z-1 max-w-[129px] lg:max-w-full lg:leading-[150%] text-right lg:text-left",
                cardClassName: " lg:h-[410px] ",
            },
        };

        const variant = directionVariant[effectiveDirection];
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    "lg:h-[165px] bg-black",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING,
                    variant.cardClassName
                )}
            >
                <div className={clsx("absolute", variant.textClassName)}>
                    <p
                        className={twMerge(
                            COMMON_TEXT_STYLE,
                            "text-white leading-[150%] lg:leading-[120%]"
                        )}
                    >
                        {title}
                    </p>
                </div>
                <div className={variant.imageClassName}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover rounded-full"
                    />
                </div>
                <div className={clsx("absolute", variant.arrowClassName)}>
                    <DashedArrow className="w-28 xl:w-50 h-auto text-gray-dark" />
                </div>
            </div>
        );
    }
);
BlackCard.displayName = "BlackCard";

export const PixelArtCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                style={{
                    background: YELLOW_GRADIENT_BG,
                }}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    " lg:h-[201px]",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING
                )}
            >
                <div className="absolute bottom-3 right-4 sm:right-5 sm:bottom-4 md:right-5 md:bottom-5 lg:right-auto z-1 md:max-w-[105px] md:text-right lg:text-left">
                    <p className={COMMON_TEXT_STYLE}>{title}</p>
                </div>

                <div className="w-[202px] h-[193px] z-2 md:w-[252px] md:h-[237px] lg:w-[323px] lg:h-[308px] absolute top-[-41px] md:top-[-75px] lg:top-[-154px] xl:top-[-54px] left-[-62px] md:left-[-38px] lg:left-auto lg:right-[-200px] xl:right-[-169px]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover rounded-full"
                    />
                    <Image
                        src="/images/interactiveZone/pixelArtWallDesk.webp"
                        alt="pixel art wall"
                        fill
                        loading="lazy"
                        className="object-cover rounded-full hidden lg:block"
                    />
                </div>
                <Noodle2
                    preserveAspectRatio="none"
                    className="lg:hidden z-1 absolute w-[238px] h-auto top-0 right-0 text-yellow-detail"
                />
                <Noodle3
                    preserveAspectRatio="none"
                    className="hidden lg:block absolute top-0 left-0 text-yellow-detail"
                />
                <div className="absolute hidden lg:block w-[309px] h-[121px] top-[324px] left-[78px]">
                    <div className="bg-yellow-light blur-[21.8px] w-full h-full" />
                </div>
            </div>
        );
    }
);
PixelArtCard.displayName = "PixelArtCard";

export const SinglePlaceholderCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                className={clsx(
                    "overflow-visible relative",
                    COMMON_CARD_ROUNDED,
                    "flex items-center justify-center",
                    COMMON_CARD_BASE
                )}
            >
                <p className="sr-only">And more...</p>

                <Image
                    src="/images/interactiveZone/placeholder.svg"
                    alt="Placeholder"
                    width={104}
                    height={164}
                    className="w-[104px] h-[164px] md:h-[204px] md:w-auto object-contain z-10 absolute top-[-31px] left-1/2 -translate-x-1/2"
                />
            </div>
        );
    }
);
SinglePlaceholderCard.displayName = "SinglePlaceholderCard";

export const DoublePlaceholderCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                className={clsx(
                    "overflow-visible relative",
                    COMMON_CARD_ROUNDED,
                    "flex items-center justify-center",
                    COMMON_CARD_BASE
                )}
            >
                <p className="sr-only">And more...</p>

                <Image
                    src="/images/interactiveZone/placeholder.svg"
                    alt="Placeholder"
                    width={170.6}
                    height={269}
                    className="w-[170.6px] h-[269px] md:w-auto md:h-[365px] object-contain z-10 absolute top-[-13px] left-1/2 -translate-x-1/2"
                />
            </div>
        );
    }
);
DoublePlaceholderCard.displayName = "DoublePlaceholderCard";

export const YellowBlobCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                style={{
                    background: "var(--color-yellow-gradient-start)",
                }}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    "lg:h-[201px]",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING
                )}
            >
                <div className={clsx("absolute", COMMON_TEXT_BOTTOM, "z-3")}>
                    <p
                        className={clsx(
                            COMMON_TEXT_STYLE,
                            "max-w-[135px] lg:leading-[150%]"
                        )}
                    >
                        {title}
                    </p>
                </div>
                <div className="z-2 absolute w-[158px] h-[152px] sm:w-[349px] sm:h-[288px] lg:w-[606px] lg:h-[439px] top-[-14px] md:top-[-143px] lg:top-[-135px] right-[-32px] md:right-[-164px] lg:right-[-230px] xl:right-[-58px] rounded-full overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover rounded-full object-top lg:hidden"
                    />
                    <Image
                        src="/images/interactiveZone/bigSandboxDesk.webp"
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover rounded-full object-top hidden lg:block"
                    />
                </div>
                <div className="rounded-full w-[255px] h-[100px] md:hidden lg:block lg:w-[309px] z-1 lg:h-[194px] absolute top-[43px] left-[-72px] lg:top-[20px] lg:left-[-59.69px] lg:rotate-[24.54deg] pointer-events-none">
                    <div
                        className="blur-[10.8466px] w-full h-full rounded-full"
                        style={{
                            background: YELLOW_GRADIENT_BG,
                        }}
                    />
                </div>
                <Image
                    src="/images/interactiveZone/yellowBlobs.svg"
                    alt="yellow blob"
                    fill
                    className="absolute inset-0 pointer-events-none lg:hidden"
                />
                <Image
                    src="/images/interactiveZone/yellowBlobDesk.svg"
                    alt="yellow blob"
                    fill
                    className="absolute inset-0 pointer-events-none hidden lg:block"
                />
            </div>
        );
    }
);
YellowBlobCard.displayName = "YellowBlobCard";
