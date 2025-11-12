import {calcRealClassName} from "./native_ctrl_util.ts";
import "./NativeMemo.css"

interface Props {
    value:string|null|undefined
    className?:string
    rowCount:number,
    maxlen?:number
    additionalClassName?:string
    onChange:(value:string|null)=>void
    required?:boolean
}

export function NativeMemo(props: Props) {
    function handleChange(evt:React.ChangeEvent<HTMLTextAreaElement>) {
        if (!evt.target.value) {
            props.onChange(null);
        } else {
            props.onChange(evt.target.value);
        }
    }
    const className = calcRealClassName("native-memo-input w-full",props.className, props.additionalClassName);
    const additionalProps:Record<string, any>={};
    if (props.maxlen) {
        additionalProps["maxlength"] = props.maxlen;
    }
    return <textarea className={className} value={props.value||""} onChange={handleChange}
                     rows={props.rowCount}
                     required={props.required}
                     {...additionalProps} />
}