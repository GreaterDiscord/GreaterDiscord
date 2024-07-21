import React from "@modules/react";

import RadioIcon from "@ui/icons/radio";

const {useState, useCallback} = React;


export default function Radio({name, value, options, onChange}) {
    const [index, setIndex] = useState(options.findIndex(o => o.value === value));
    const change = useCallback((e) => {
        const newIndex = parseInt(e.target.value);
        const newValue = options[newIndex].value;
        onChange?.(newValue);
        setIndex(newIndex);
    }, [options, onChange]);

    function renderOption(opt, i) {
        const isSelected = index === i;
        return <label className={"gd-radio-option" + (isSelected ? " gd-radio-selected" : "")}>
                <input onChange={change} type="radio" name={name} checked={isSelected} value={i} />
                {/* <span className="gd-radio-button"></span> */}
                <RadioIcon className="gd-radio-icon" size="24" checked={isSelected} />
                <div className="gd-radio-label-wrap">
                    <div className="gd-radio-label">{opt.name}</div>
                    <div className="gd-radio-description">{opt.desc || opt.description}</div>
                </div>
            </label>;
    }

    return <div className="gd-radio-group">{options.map(renderOption)}</div>;
}