import React from "@modules/react";

const {useState, useCallback} = React;


export default function Slider({value: initialValue, min, max, step, onChange}) {
    const [value, setValue] = useState(initialValue);
    const change = useCallback((e) => {
        onChange?.(e.target.value);
        setValue(e.target.value);
    }, [onChange]);

    return <div className="gd-slider-wrap">
        <div className="gd-slider-label">{value}</div><input onChange={change} type="range" className="gd-slider-input" min={min} max={max} step={step} value={value} style={{backgroundSize: (value - min) * 100 / (max - min) + "% 100%"}} />
    </div>;
}