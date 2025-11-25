import { Dispatch, SetStateAction } from "react";
import IconButton from "../../buttons/IconButton";
import CrossIcon from "../../icons/CrossIcon";

interface CloseButtonProps {
    setIsHeaderMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function CloseButton({
    setIsHeaderMenuOpened,
}: CloseButtonProps) {
    return (
        <IconButton
            handleClick={() => setIsHeaderMenuOpened(false)}
            className="absolute z-60 top-5 right-4 xl:top-6 xl:right-6 size-6 xl:size-10"
        >
            <CrossIcon className="w-6 h-6 text-black" />
        </IconButton>
    );
}
