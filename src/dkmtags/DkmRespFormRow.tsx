interface FormRowProps {
    children: any
}

export default function DkmRepFormRow(props: FormRowProps) {
    return <div className={"flex flex-row flex-wrap w-full gap-1"}>
        {props.children}
        </div>
}
