interface Props {
    children?:any
    addtionalClasses?:string
}

function DkmRespForm(props:Props) {

    return (
        <div className={`flex flex-wrap ${props.addtionalClasses}`}>
            {props.children}
        </div>
    )
}

export default DkmRespForm;