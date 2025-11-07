
export interface OptionItem {
    key:string
    value:string
}
interface Props{
    selectItems:Array<OptionItem>
    value:string
    onSelected:(item:OptionItem)=>void
}

function DkmNativeSelect(props:Props) {

    function getOptionItem(key:string):OptionItem {
        const found =props.selectItems.find(selv=>selv.key==key);
        if (!found) {
            throw Error(`interner Fehler`)
        }
        return found;
    }

    function handleSelect(ev: React.ChangeEvent<HTMLSelectElement>): void {
        const selectedOption = getOptionItem(ev.target.value);
        props.onSelected(selectedOption)
    }

    function renderOption(oi:OptionItem) {
        return <option key={oi.key} value={oi.key}>{oi.value}</option>
    }

    return (
        <select onChange={handleSelect} value={props.value}>
            {props.selectItems.map(oi=> renderOption(oi))}
        </select>
    )
}

export default DkmNativeSelect;