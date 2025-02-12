import React from "@modules/react";

export default function ArrowLeft(props) {
    const size = props.size || "24px";
    return <svg viewBox="0 0 24 24" style={{width: size, height: size}}>
        <path d="M14 7l-5 5 5 5V7z" />
        <path d="M24 0v24H0V0h24z" fill="none" />
        </svg>;
}
