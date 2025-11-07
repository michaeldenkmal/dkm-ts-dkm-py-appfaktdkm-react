// <tr class="table-row-responsive">
interface Props {
    children?:any
    ref?: (el: HTMLTableRowElement | null) => void;
    additionalProps?:Record<string, any>
    additionalClasses?:string
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

function DkmRespTableRow(props:Props) {
    const myProps = props.additionalProps || {};
    if (props.ref) {
        myProps["ref"] = props.ref;
    }

    let myclass = "table-row-responsive";
    if (props.additionalClasses) {
        myclass = myclass + " " + props.additionalClasses;
    }

    function handleOnMouseEnter() {
        if (props.onMouseEnter){
            props.onMouseEnter();
        }
    }

    function handleOnMouseLeave() {
        if (props.onMouseLeave){
            props.onMouseLeave();
        }
    }

    return (
        <tr className={myclass} {...myProps} onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
        >
            {props.children}
        </tr>
    )
}

export default DkmRespTableRow;