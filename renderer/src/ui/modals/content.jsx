import React from "@modules/react";
import Utilities from "@modules/utilities";


export default function Content({id, className, children, scroller = true}) {
    return <div id={id} className={Utilities.className("gd-modal-content", {"gd-scroller-base gd-scroller-thin": scroller}, className)}>
        {children}
    </div>;
}