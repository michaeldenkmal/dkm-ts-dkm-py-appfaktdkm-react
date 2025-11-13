import "./NativeTimeInput.css"
import {fmt2DigitNum} from "@at.dkm/dkm-ts-lib-gen/lib/u";
import {calcRealClassName} from "./native_ctrl_util.ts";
import type {MayBeDate} from "../dkm_django/dkm_django_m.ts";

interface Props {
    value:MayBeDate
    dateOfDay:MayBeDate,
    hourDivisor:number
    className?:string
    disabled?:boolean
    additionalClassName?:string
    onBlur?:()=>void
    onChange:(newTime:MayBeDate)=>void
}

function buildTimes(hourDivisor:number):string[] {
    const arrOptions:string[]=[];

    for (let h=0; h< 24; h++) {
        let szhour="";
        if (h <10){
            szhour = "0" + h;
        } else {
            szhour = h +"";
        }
        for (let parti=0; parti < hourDivisor; parti++) {
            let min = 60/hourDivisor * parti;
            let szmin="";
            if (min <10) {
                szmin="0" + min;
            } else {
                szmin="" +min;
            }
            const value = szhour + ":" + szmin;
            arrOptions.push(value)
        }
    }
    return arrOptions;

}

function buildOptionFromDate(date:Date|null|undefined):string{
    // aus Datum soll eintrag werden
    if (!date) {
        return "";
    }
    const szmin = fmt2DigitNum(date.getMinutes());
    const szh = fmt2DigitNum(date.getHours());
    return `${szh}:${szmin}`;
}

function buildDateFromOption(baseDateWoTime:Date|null|undefined,szopt:string):Date|null {
    if(!baseDateWoTime) {
        return null;
    }

    // 13:00 soll tag+Datum werden
    const myDateWoValue:Date = new Date(
        baseDateWoTime.getFullYear(),
        baseDateWoTime.getMonth(),
        baseDateWoTime.getDate()
    )
    const parts:string[] = szopt.split(":")
    if (parts.length!=2) {
        return myDateWoValue;
    }
    const h = parseInt(parts[0]);
    const m:number = parseInt(parts[1]);
    return new Date(
        baseDateWoTime.getFullYear(),
        baseDateWoTime.getMonth(),
        baseDateWoTime.getDate(),
        h,m
    )
}


export function NativeTimeInput(props:Props) {


    function render() {

        const arrOptions = buildTimes(4)


        function renderOpt(value:string) {
            return <option>{value}</option>
        }

        function handleChange(evt: React.ChangeEvent<HTMLSelectElement>) {
            if (!evt.target.value) {
                props.onChange(null);
            } else {
                props.onChange(buildDateFromOption(props.dateOfDay,evt.target.value));
            }
        }

        const className = calcRealClassName("native-time-input", props.className, props.additionalClassName);

        function handleBlur() {
            if (props.onBlur) {
                props.onBlur();
            }
        }

        return <select className={className} onChange={handleChange} value={buildOptionFromDate(props.value)}
                       disabled={props.disabled} onBlur={handleBlur}>
            {arrOptions.map(renderOpt)}
        </select>
    }
    return render();
}