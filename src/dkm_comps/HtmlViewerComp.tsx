interface Props {
    html:string;
}
export default function HtmlViewer(props:Props) {
    return (
        <iframe
            style={{width:"100%", height:"50vh"}}
            srcDoc={props.html}
        />
    )
}