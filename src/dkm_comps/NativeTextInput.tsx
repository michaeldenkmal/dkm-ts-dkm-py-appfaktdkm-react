
import {type JSX} from "react";
import {calcRealClassName} from "./native_ctrl_util.ts";
import "./NativeTextInput.css";

interface Props {
    value:string|null
    className?:string
    maxlen?:number
    additionalClassName?:string
    onChange:(value:string|null)=>void
    onBlur?:()=>void
    required?:boolean
    disabled?:boolean
    inputHint?:string
}

export function NativeTextInput(props: Props): JSX.Element {
    function handleChange(evt:React.ChangeEvent<HTMLInputElement>) {
        if (!evt.target.value) {
            props.onChange(null);
        } else {
            props.onChange(evt.target.value);
        }
    }
    const className = calcRealClassName("native-text-input w-full",props.className, props.additionalClassName);
    const additionalProps ={};
    if (props.maxlen) {
        additionalProps["maxlength"] = props.maxlen;
    }
    if (props.onBlur) {
        additionalProps["onBlur"] = props.onBlur;
    }
    if (props.inputHint) {
        additionalProps["hint"] = props.inputHint;
    }
    return <input type={"test"} className={className} value={props.value||""} onChange={handleChange}
                  required={props.required} disabled={props.disabled}
                  {...additionalProps} />
}