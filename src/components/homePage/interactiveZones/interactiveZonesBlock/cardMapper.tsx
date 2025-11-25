import { ComponentType } from "react";
import {
    GlassCard,
    PurpleBlobCard,
    YellowElipseCard,
    PurpleNoiseCard,
    GrayCard,
    BlackCard,
    YellowBlobCard,
    SinglePlaceholderCard,
    DoublePlaceholderCard,
    PixelArtCard,
} from "./InterativeZoneCard";
import type { CardType, InteractiveZoneItem } from "../interactiveZonesData";

type CardComponent = ComponentType<{
    title: string;
    image: string;
    direction?: "left" | "right";
    desktopDirection?: "left" | "right";
    pictureSize?: "big" | "small";
    vertical?: boolean;
}>;

const cardComponentMap: Record<CardType, CardComponent> = {
    glass: GlassCard,
    purpleBlob: PurpleBlobCard,
    yellowElipse: YellowElipseCard,
    purpleNoise: PurpleNoiseCard,
    gray: GrayCard,
    black: BlackCard,
    yellowNoodle: PixelArtCard,
    yellowBlob: YellowBlobCard,
    singlePlaceholder: SinglePlaceholderCard,
    doublePlaceholder: DoublePlaceholderCard,
};

export function getCardComponent(cardType: CardType): CardComponent {
    return cardComponentMap[cardType];
}

// Memoized renderCard function
export const renderCard = (item: InteractiveZoneItem) => {
    const CardComponent = getCardComponent(item.card);
    return (
        <CardComponent
            key={item.id}
            title={item.title}
            image={item.image}
            direction={item.direction}
            desktopDirection={item.desktopDirection}
            pictureSize={item.pictureSize}
            vertical={item.vertical}
        />
    );
};
