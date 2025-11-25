import { Dispatch, SetStateAction } from "react";
import IconButton from "../../buttons/IconButton";
import MenuIcon from "../../icons/MenuIcon";

interface BurgerButtonProps {
    setIsHeaderMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function BurgerButton({
    setIsHeaderMenuOpened,
}: BurgerButtonProps) {
    return (
        <IconButton
            handleClick={() => setIsHeaderMenuOpened(true)}
            className="size-10 lg:hidden"
        >
            <MenuIcon className="w-10 h-10 text-black" />
        </IconButton>
    );
}
