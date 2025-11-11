import type {ToastCenterContextType} from "./ToastCenterContext.tsx";

export class HtmlError extends Error {
    errmsg: string;
    html: string;

    constructor(errmsg: string, html: string) {
        super(errmsg);
        this.errmsg = errmsg;
        this.html = html;
        Object.setPrototypeOf(this, HtmlError.prototype); // damit instanceof klappt
    }
}


interface ShowMayBeHtmlErrorProps{
    e:unknown
    errprefix:string
}

export function showMayBeHtmlError(toastCenter:ToastCenterContextType,props:ShowMayBeHtmlErrorProps) {
    if (props.e instanceof HtmlError) {
        const errmsg = `${props.errprefix}:${props.e.errmsg}`
        toastCenter.showError(errmsg, props.e.html ,0);
    } else {
        toastCenter.showError(`${props.errprefix}:${props.e}`,"");
    }
}

/*


* throw new HtmlError("Form could not be saved", "<b>Validation Error</b>");
try {
    ...
} catch (e) {
    if (e instanceof HtmlError) {
        console.log(e.errmsg);
        console.log(e.html);
    }
}

*
* */