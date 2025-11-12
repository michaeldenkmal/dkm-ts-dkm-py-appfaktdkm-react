import type {MayBeString} from "../dkm_django/dkm_django_m.ts";

interface Props{
    error:MayBeString
}
export default function NativeErrInfo(props:Props) {
    return (
        <p className="text-red-500 text-sm mt-1">
            { props.error}</p>
    )
}