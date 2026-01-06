export type CardType =
    | "glass"
    | "purpleBlob"
    | "yellowElipse"
    | "purpleNoise"
    | "gray"
    | "black"
    | "yellowNoodle"
    | "yellowBlob"
    | "singlePlaceholder"
    | "doublePlaceholder";

export type Direction = "left" | "right";
export type PictureSize = "big" | "small";

export interface InteractiveZoneItem {
    id: number;
    title: string;
    image: string;
    card: CardType;
    direction?: Direction;
    desktopDirection?: Direction;
    pictureSize?: PictureSize;
    vertical?: boolean;
}

export const interactiveZonesData: InteractiveZoneItem[] = [
    {
        id: 1,
        title: "Стіна для малювання",
        image: "/images/animals/animalSmall.svg",
        card: "yellowElipse",
        vertical: true,
    },
    {
        id: 5,
        title: "Магнітна стіна",
        image: "/images/interactiveZone/magnet_wall.webp",
        card: "purpleBlob",
    },
    {
        id: 6,
        title: "Кінетичний пісок",
        image: "/images/interactiveZone/kineticSand.webp",
        card: "glass",
        direction: "right",
    },
    {
        id: 4,
        title: "Лего стіна",
        image: "/images/interactiveZone/lego_wall.webp",
        card: "black",
        direction: "left",
    },
    {
        id: 9,
        title: "Зелена зона",
        image: "/images/interactiveZone/green_zone.webp",
        card: "purpleNoise",
    },
    {
        id: 7,
        title: "Зона фонтанів",
        image: "/images/interactiveZone/fountainZone.webp",
        card: "glass",
        direction: "left",
    },
    {
        id: 8,
        title: "Інженерні споруди",
        image: "/images/interactiveZone/engineer.webp",
        card: "black",
        direction: "right",
        vertical: true,
    },
    {
        id: 10,
        title: "Стіна Pixel art",
        image: "/images/interactiveZone/pixelArtWall.webp",
        card: "yellowNoodle",
    },
    {
        id: 2,
        title: "Mала пісочниця",
        image: "/images/interactiveZone/small_sandbox.webp",
        card: "gray",
        pictureSize: "small",
    },
    {
        id: 3,
        title: "Велика пісочниця",
        image: "/images/interactiveZone/bigSandbox.webp",
        card: "yellowBlob",
    },
];
