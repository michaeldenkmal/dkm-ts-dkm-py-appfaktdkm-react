import {useMemo} from "react";
import {calcRealClassName} from "./native_ctrl_util.ts";

export interface OptionItem {
    key: string
    value: string
}

interface Props {
    selectItems: Array<OptionItem>
    className?:string
    value: string
    emptyOptionItem?: OptionItem
    onSelected: (item: OptionItem) => void
    additionalClassName?:string
    name?:string

}

function DkmNativeSelect(props: Props) {

    const s_optionItems = useMemo(() => {
            const myselectItems: OptionItem[] = [];
            if (props.emptyOptionItem) {
                myselectItems.push(props.emptyOptionItem)
            }
            myselectItems.push(...props.selectItems)
            return myselectItems
        },
        [props.emptyOptionItem, props.selectItems])

    function getOptionItem(key: string): OptionItem {
        const found = s_optionItems.find(selv => selv.key == key);
        if (!found) {
            throw Error(`interner Fehler`)
        }
        return found;
    }

    function handleSelect(ev: React.ChangeEvent<HTMLSelectElement>): void {
        const selectedOption = getOptionItem(ev.target.value);
        props.onSelected(selectedOption)
    }

    function renderOption(oi: OptionItem) {
        return <option key={oi.key} value={oi.key}>{oi.value}</option>
    }
    const realClassName = calcRealClassName("w-full",props.className,props.additionalClassName);;
    return (
        <select onChange={handleSelect} value={props.value}  className={realClassName} name={props.name} >
            {s_optionItems.map(oi => renderOption(oi))}
        </select>
    )
}

export default DkmNativeSelect;