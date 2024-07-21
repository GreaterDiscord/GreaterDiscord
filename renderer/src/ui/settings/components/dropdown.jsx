import React from "@modules/react";

import Arrow from "@ui/icons/downarrow";

const {useState, useCallback} = React;


export default function Select({value: initialValue, options, style, onChange}) {
    const [value, setValue] = useState(initialValue ?? options[0].value);
    const change = useCallback((val) => {
        onChange?.(val);
        setValue(val);
    }, [onChange]);


    const hideMenu = useCallback(() => {
        setOpen(false);
        document.removeEventListener("click", hideMenu);
    }, []);

    const [open, setOpen] = useState(false);
    const showMenu = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        const next = !open;
        setOpen(next);
        if (!next) return;
        document.addEventListener("click", hideMenu);
    }, [hideMenu, open]);


    // ?? options[0] provides a double failsafe
    const selected = options.find(o => o.value == value) ?? options[0];
    const optionComponents = <div className="gd-select-options">
            {options.map(opt =>
                <div className={`gd-select-option${selected.value == opt.value ? " selected" : ""}`} onClick={() => change(opt.value)}>{opt.label}</div>
            )}
        </div>;

    const styleClass = style == "transparent" ? " gd-select-transparent" : "";
    const isOpen = open ? " menu-open" : "";
    return <div className={`gd-select${styleClass}${isOpen}`} onClick={showMenu}>
                <div className="gd-select-value">{selected.label}</div>
                <Arrow className="gd-select-arrow" />
                {open && optionComponents}
            </div>;
}