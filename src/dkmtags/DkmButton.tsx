interface Props {
    children?:any
    defaultBtn?:boolean
    onClick:()=>void
}

function DkmButton(props:Props) {

    const btnClassName = props.defaultBtn  ? "dkm-default-button" :"dkm-button";


    return <button className={btnClassName} onClick={props.onClick}>
        {props.children}
    </button>
}

export default DkmButton;