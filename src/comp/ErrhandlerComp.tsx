interface Props {
    err:string
}
export default function ErrhandlerComp(props:Props) {
    return <div className={"error"}>
        {props.err}
    </div>
}