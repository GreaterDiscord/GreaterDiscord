import React from "@modules/react";
import Utilities from "@modules/utilities";


export const Colors = Object.freeze({
    STANDARD: "gd-text-normal",
    MUTED: "gd-text-muted",
    ERROR: "gd-text-error",
    BRAND: "gd-text-brand",
    LINK: "gd-text-link",
    HEADER_PRIMARY: "gd-header-primary",
    HEADER_SECONDARY: "gd-header-secondary",
    STATUS_YELLOW: "gd-text-yellow",
    STATUS_GREEN: "gd-text-green",
    STATUS_RED: "gd-text-red",
    ALWAYS_WHITE: "gd-text-white",
    CUSTOM: null
});


export const Sizes = Object.freeze({
    SIZE_10: "gd-text-10",
    SIZE_12: "gd-text-12",
    SIZE_14: "gd-text-14",
    SIZE_16: "gd-text-16",
    SIZE_20: "gd-text-20",
    SIZE_24: "gd-text-24",
    SIZE_32: "gd-text-32"
});


export default function Text({tag: Tag = "div", className, children, color = Colors.STANDARD, size = Sizes.SIZE_14, selectable, strong, style}) {
    return <Tag
                className={
                    Utilities.className(
                        color, size, className,
                        {
                            "gd-selectable": selectable,
                            "gd-text-strong": strong
                        }
                    )}
                style={style}
            >
            {children}
            </Tag>;
}

Text.Colors = Colors;
Text.Sizes = Sizes;

// te = WebpackModules.getModule(m => m?.Sizes?.SIZE_32 && m.Colors)
// foo = []
// for (const color in te.Colors) foo.push(GdApi.React.createElement(te, {color: te.Colors[color]}, color))
// for (const size in te.Sizes) foo.push(GdApi.React.createElement(te, {size: te.Sizes[size]}, size))
// GdApi.showConfirmationModal("Text Elements", foo)