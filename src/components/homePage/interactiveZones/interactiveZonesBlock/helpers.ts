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
        if (missingSlides === 1) {
            newSlides.push({
                id: newSlides.length + 1,
                title: "",
                image: "",
                card: "singlePlaceholder",
            });
        }
        if (missingSlides === 2) {
            newSlides.push({
                id: newSlides.length + 1,
                title: "",
                image: "",
                card: "doublePlaceholder",
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
        if (missingSlides === 1) {
            newSlides.push({
                id: newSlides.length + 1,
                title: "",
                image: "",
                card: "doublePlaceholder",
            });
        }
        if (missingSlides === 2) {
            newSlides.push({
                id: newSlides.length + 1,
                title: "",
                image: "",
                card: "doublePlaceholder",
            });
        }
    }
    return chunkArray(newSlides, TABLET_CARDS_PER_SLIDE);
};

export interface DesktopSlideLayout {
    verticalCard: InteractiveZoneItem;
    topRow: InteractiveZoneItem[];
    bottomRow: InteractiveZoneItem[];
    isVerticalOnLeft: boolean;
}

export const getDesktopSlides = (
    slides: InteractiveZoneItem[]
): DesktopSlideLayout[] => {
    // Create a map for quick lookup by ID
    const itemsById = new Map(slides.map(item => [item.id, item]));

    // Slide 1: top row - id3, bot row - id4, id2, vertical card on the right: id1
    const slide1: DesktopSlideLayout = {
        verticalCard: itemsById.get(1)!,
        topRow: [itemsById.get(3)!].filter(Boolean),
        bottomRow: [itemsById.get(4)!, itemsById.get(2)!].filter(Boolean),
        isVerticalOnLeft: false,
    };

    // Slide 2: top row - id7, id9, bot row - id5, id6, id10, vertical card on the left: id8
    const slide2: DesktopSlideLayout = {
        verticalCard: itemsById.get(8)!,
        topRow: [itemsById.get(7)!, itemsById.get(9)!].filter(Boolean),
        bottomRow: [itemsById.get(5)!, itemsById.get(6)!, itemsById.get(10)!].filter(Boolean),
        isVerticalOnLeft: true,
    };

    return [slide1, slide2].filter(slide => slide.verticalCard);
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
