import "./NativeNumberInput.css"
import {calcRealClassName} from "./native_ctrl_util.ts";


interface Props {
    value:number|null|undefined
    className?:string
    readonly?:boolean
    additionalClassName?:string
    onChange?:(newNum:number|null)=>void
    required?:boolean
}





export function NativeNumberInput(props:Props) {


    function render() {


        function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
            if (!props.onChange) {
                return
            }
            if (!evt.target.value) {
                props.onChange(null);
            } else {
                props.onChange(parseFloat(evt.target.value));
            }
        }
        const className = calcRealClassName("native-number-input", props.className, props.additionalClassName);
        const additionalProps :Record<string, any>={}
        if (props.readonly) {
            additionalProps["readonly"] = props.readonly;
        }
        return <input className={className} type="number" inputMode="numeric" onChange={handleChange}
                      value={props.value||""} {...additionalProps} required={props.required} />
    }

    return render();
}