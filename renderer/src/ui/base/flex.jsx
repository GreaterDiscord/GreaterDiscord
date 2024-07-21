import React from "@modules/react";
import Utilities from "@modules/utilities";


export const Direction = Object.freeze({
    VERTICAL: "gd-flex-vertical",
    HORIZONTAL: "gd-flex-horizontal",
    HORIZONTAL_REVERSE: "gd-flex-reverse"
});

export const Justify = Object.freeze({
    START: "gd-flex-justify-start",
    END: "gd-flex-justify-end",
    CENTER: "gd-flex-justify-center",
    BETWEEN: "gd-flex-justify-between",
    AROUND: "gd-flex-justify-around"
});

export const Align = Object.freeze({
    START: "gd-flex-align-start",
    END: "gd-flex-align-end",
    CENTER: "gd-flex-align-center",
    STRETCH: "gd-flex-align-stretch",
    BASELINE: "gd-flex-align-baseline"
});

export const Wrap = Object.freeze({
    NO_WRAP: "gd-flex-no-wrap",
    WRAP: "gd-flex-wrap",
    WRAP_REVERSE: "gd-flex-wrap-reverse"
});


export function Child(props) {
    if (!props.className) props.className = "";
    props.className = Utilities.className(props.className, "gd-flex-child");
    return <Flex {...props} />;
}


export default function Flex({
        children,
        className,
        style,
        shrink = 1,
        grow = 1,
        basis = "auto",
        direction = Direction.HORIZONTAL,
        align = Align.STRETCH,
        justify = Justify.START,
        wrap = Wrap.NO_WRAP
    }) {
    return <div
                className={Utilities.className(
                    "gd-flex",
                    direction,
                    justify,
                    align,
                    wrap,
                    className
                )}
                style={Object.assign({
                    flexShrink: shrink,
                    flexGrow: grow,
                    flexBasis: basis
                }, style)}
            >
        {children}
        </div>;
}

Flex.Child = Child;
Flex.Direction = Direction;
Flex.Align = Align;
Flex.Justify = Justify;
Flex.Wrap = Wrap;