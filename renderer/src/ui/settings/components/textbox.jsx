import {React} from "modules";

const {useState, useCallback} = React;


export default function Textbox({value: initialValue, maxLength, placeholder, onKeyDown, onChange}) {
    const [value, setValue] = useState(initialValue);
    const change = useCallback((e) => {
        onChange?.(e.target.value);
        setValue(e.target.value);
    }, []);

    return <input onChange={change} onKeyDown={onKeyDown} type="text" className="bd-text-input" placeholder={placeholder} maxLength={maxLength} value={value} />;
}