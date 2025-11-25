export type CardType =
    | "glass"
    | "purpleBlob"
    | "yellowElipse"
    | "purpleNoise"
    | "gray"
    | "black"
    | "yellowNoodle"
    | "yellowBlob"
    | "placeholder";

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
    desktopId: number;
    vertical?: boolean;
}

export const interactiveZonesData: InteractiveZoneItem[] = [
    {
        id: 1,
        desktopId: 3,
        title: "Стіна для малювання",
        image: "/images/animals/animalSmall.svg",
        card: "yellowElipse",
    },
    {
        id: 2,
        desktopId: 1,
        title: "Магнітна стіна",
        image: "/images/interactiveZone/magnetWall.webp",
        card: "purpleBlob",
        vertical: true,
    },
    {
        id: 3,
        desktopId: 2,
        title: "Кінетичний пісок",
        image: "/images/interactiveZone/kineticSand.webp",
        card: "glass",
        direction: "right",
        desktopDirection: "left",
    },
    {
        id: 4,
        desktopId: 6,
        title: "Лего стіна",
        image: "/images/interactiveZone/legoWall.webp",
        card: "black",
        direction: "left",
    },
    {
        id: 5,
        desktopId: 8,
        title: "Зона кафе",
        image: "/images/interactiveZone/cafe.webp",
        card: "gray",
        pictureSize: "big",
    },
    {
        id: 6,
        desktopId: 10,
        title: "Зелена зона",
        image: "/images/interactiveZone/greenZone.webp",
        card: "purpleNoise",
    },
    {
        id: 7,
        desktopId: 9,
        title: "Зона фонтанів",
        image: "/images/interactiveZone/fountainZone.webp",
        card: "glass",
        direction: "left",
    },
    {
        id: 8,
        desktopId: 7,
        title: "Інженерні споруди",
        image: "/images/interactiveZone/engineer.webp",
        card: "black",
        direction: "right",
    },
    {
        id: 9,
        desktopId: 11,
        title: "Нудлс стіна",
        image: "/images/interactiveZone/noodlesWall.webp",
        card: "yellowNoodle",
        vertical: true,
    },
    {
        id: 10,
        desktopId: 5,
        title: "Mала пісочниця",
        image: "/images/interactiveZone/smallSandbox.webp",
        card: "gray",
        pictureSize: "small",
    },
    {
        id: 11,
        desktopId: 4,
        title: "Велика пісочниця",
        image: "/images/interactiveZone/bigSandbox.webp",
        card: "yellowBlob",
    },
];
