import { InteractiveZoneItem } from "../interactiveZonesData";
import {
    DESKTOP_CARDS_PER_SLIDE,
    MOBILE_CARDS_PER_SLIDE,
    TABLET_CARDS_PER_SLIDE,
} from "./slidesLayouts";

export const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};

export const chunkDesktopArray = (
    array: InteractiveZoneItem[],
    isReverse: boolean
): InteractiveZoneItem[][] => {
    const horizontalItems = array.filter(item => !item.vertical);
    const verticalItem = array.filter(item => item.vertical);
    return isReverse
        ? [verticalItem, horizontalItems]
        : [horizontalItems, verticalItem];
};

export const getMobileSlides = (slides: InteractiveZoneItem[]) => {
    const missingSlides =
        MOBILE_CARDS_PER_SLIDE - (slides.length % MOBILE_CARDS_PER_SLIDE);
    const newSlides = [...slides];
    if (missingSlides > 0) {
        for (let i = 0; i < missingSlides; i++) {
            newSlides.push({
                id: newSlides.length + 1,
                title: "",
                image: "",
                card: "placeholder",
                desktopId: 0,
            });
        }
    }
    return chunkArray(newSlides, MOBILE_CARDS_PER_SLIDE);
};

export const getTabletSlides = (slides: InteractiveZoneItem[]) => {
    const missingSlides =
        TABLET_CARDS_PER_SLIDE - (slides.length % TABLET_CARDS_PER_SLIDE);
    const newSlides = [...slides];
    if (missingSlides > 0) {
        for (let i = 0; i < missingSlides; i++) {
            newSlides.push({
                id: newSlides.length + 1,
                title: "",
                image: "",
                card: "placeholder",
                desktopId: 0,
            });
        }
    }
    return chunkArray(newSlides, TABLET_CARDS_PER_SLIDE);
};

export const getDesktopSlides = (
    slides: InteractiveZoneItem[]
): InteractiveZoneItem[][][] => {
    const chunks = chunkArray(slides, DESKTOP_CARDS_PER_SLIDE);
    return chunks.map((chunk, chunkIndex) =>
        chunkDesktopArray(chunk, chunkIndex % 2 === 0)
    );
};

export const getSlides = (
    breakpoint: "desktop" | "tablet" | "mobile",
    slides: InteractiveZoneItem[]
) => {
    switch (breakpoint) {
        case "desktop":
            return getDesktopSlides(slides);
        case "tablet":
            return getTabletSlides(slides);
        case "mobile":
            return getMobileSlides(slides);
        default:
            return [];
    }
};
