import React from "@modules/react";

import Button from "../base/button";
import Close from "../icons/close";


export default function CloseButton({onClick}) {
    return <Button
                className="gd-close-button"
                size={Button.Sizes.ICON}
                look={Button.Looks.BLANK}
                color={Button.Colors.TRANSPARENT}
                onClick={onClick}
            >
        <Close size="24px" />
    </Button>;
}