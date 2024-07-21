import React from "@modules/react";


export default function SettingItem({id, name, note, inline, children}) {
    return <div className={"gd-setting-item" + (inline ? " inline" : "")}>
                <div className={"gd-setting-header"}>
                    <label htmlFor={id} className={"gd-setting-title"}>{name}</label>
                    {inline && children}
                </div>
                <div className={"gd-setting-note"}>{note}</div>
                {!inline && children}
                <div className={"gd-setting-divider"} />
            </div>;
}