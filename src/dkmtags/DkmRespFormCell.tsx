
type T_flexGrow = 1|2|3|4|5|6|7|8|9

interface Props {
    label?:string
    children?: any
    felxGrow?: T_flexGrow
}

// für TailWind
export const TAIL_WIN_FLEX_GROW = {
    f1: "flex-1",
    f2: "flex-2",
    f3: "flex-3",
    f4: "flex-4",
    f5: "flex-5",
    f6: "flex-6",
    f7: "flex-7",
    f8: "flex-8",
    f9: "flex-9"
}

function DkmRespFormCell(props: Props) {

    function renderLabel() {
        if (props.label) {
            return <label>{props.label}</label>
        }
        return null;
    }

    const my_flexGrow = props.felxGrow || "1";
    const my_flex_class = `flex-${my_flexGrow}`
    return (
        <div className={my_flex_class}>
            {renderLabel()}
            {props.children}
        </div>
    )
}

export default DkmRespFormCell;