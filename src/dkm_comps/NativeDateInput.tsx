import {fmtGermanDate} from "@at.dkm/dkm-ts-lib-gen/lib/dateUtil";
import * as u from "@at.dkm/dkm-ts-lib-gen/lib/u"
import "./NativeDateInput.css"
import {calcRealClassName} from "./native_ctrl_util.ts";
import type {MayBeDate} from "../dkm_django/dkm_django_m.ts";


interface Props {
    value: MayBeDate
    onChange: (value: MayBeDate) => void
    className?:string
    additionalClassName?:string
    mindate?:MayBeDate
    maxdate?: MayBeDate
    disabled?:boolean
}

//https://stackoverflow.com/questions/45397107/reactjs-input-type-date-format-date
// This actually has nothing to do with React. for <input type="date"> values, Chrome expects the value of the date to be in YYYY-MM-DD format.

function fmtGoogleDateInputVal(value:MayBeDate):string {
    if (!value) {
        return "";
    }
    const y= value.getFullYear();
    const month = value.getMonth() +1;
    const d = value.getDate();

    return u.fmt4DigitNum(y) + "-" + u.fmt2DigitNum(month) + "-" + u.fmt2DigitNum(d)
}


function NativeDateInput(props: Props) {

    const szMin = fmtGermanDate(props.mindate||"" );
    const szMax = fmtGermanDate(props.maxdate||"");
    const value = fmtGoogleDateInputVal(props.value);
    const  className = calcRealClassName("native-date-input",props.className,props.additionalClassName);


    function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const inp = evt.target as HTMLInputElement;
        props.onChange(inp.valueAsDate);
    }

    const addProps:Record<string, any > ={};
    if (props.disabled) {
        addProps.disabled = true;
    }

    return <input type={"date"} value={value} onChange={handleChange} className={className}
        min={szMin} max={szMax} {...addProps} />
}

export default NativeDateInput;