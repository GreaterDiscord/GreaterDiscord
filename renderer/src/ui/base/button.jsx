import React from "@modules/react";
import Utilities from "@modules/utilities";

// S.Looks = y;
// S.Colors = I;
// S.BorderColors = O;
// S.Hovers = T;
// S.Sizes = v;

const {useCallback} = React;

export const Looks = Object.freeze({
    FILLED: "gd-button-filled",
    OUTLINED: "gd-button-outlined",
    LINK: "gd-button-link",
    BLANK: "gd-button-blank"
});

export const Colors = Object.freeze({
    BRAND: "gd-button-color-brand",
    BLURPLE: "gd-button-color-blurple",
    RED: "gd-button-color-red",
    GREEN: "gd-button-color-green",
    YELLOW: "gd-button-color-yellow",
    PRIMARY: "gd-button-color-primary",
    LINK: "gd-button-color-link",
    WHITE: "gd-button-color-white",
    TRANSPARENT: "gd-button-color-transparent",
    CUSTOM: ""
});


export const Sizes = Object.freeze({
    NONE: "",
    TINY: "gd-button-tiny",
    SMALL: "gd-button-small",
    MEDIUM: "gd-button-medium",
    LARGE: "gd-button-large",
    ICON: "gd-button-icon"
});


export default function Button({
    className,
    children,
    onClick,
    onKeyDown,
    buttonRef,
    disabled = false,
    type = "button",
    look = Looks.FILLED,
    color = Colors.BRAND,
    size = Sizes.MEDIUM,
    grow = true,
    ...others
}) {
    
    const handleClick = useCallback(event => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.(event);
    }, [onClick]);
    
    return <button {...others} className={
        Utilities.className(
            "gd-button",
            className,
            look,
            color,
            size,
            grow ? "gd-button-grow" : ""
        )}
        ref={buttonRef}
        type={type === "button" ? null : type}
        onClick={disabled ? () => {} : handleClick}
        onKeyDown={disabled ? () => {} : onKeyDown}
        >
        <div className="gd-button-content">{children}</div>
    </button>;
}

Button.Looks = Looks;
Button.Colors = Colors;
Button.Sizes = Sizes;
// window.BDButton = Button;
// (() => {
//     const buttons = [];
//     for (const look in window.BDButton.Looks) {
//         if (!window.BDButton.Looks[look] || look === "BLANK") continue;
//         for (const color in window.BDButton.Colors) {
//             if (!window.BDButton.Colors[color]) continue;
//             for (const size in window.BDButton.Sizes) {
//                 if (!window.BDButton.Sizes[size]) continue;
//                 buttons.push(window.GdApi.React.createElement(window.BDButton, {
//                     look: window.BDButton.Looks[look],
//                     color: window.BDButton.Colors[color],
//                     size: window.BDButton.Sizes[size]
//                 }, "Hello World!"));
//                 buttons.push(window.GdApi.React.createElement("br"));
//             }
//         }
//     }
//     window.GdApi.showConfirmationModal("Buttons", buttons);
// })();