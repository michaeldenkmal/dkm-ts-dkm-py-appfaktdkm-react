import type {MayBeString} from "../dkm_django/dkm_django_m.ts";
import {calcRealClassName} from "../dkm_comps/native_ctrl_util.ts";
import NativeErrInfo from "../dkm_comps/NativeErrInfo.tsx";

export interface Props {
    label: string
    field:string
    shouldRenderError:boolean
    errors?: MayBeString
    children: React.ReactNode
    required?:boolean
    additionalClassName?:string
}

export default function DkmRespFormCell(props:Props) {

    const {   additionalClassName, label, field, children,required,
        shouldRenderError, errors} = props;

    const className =  calcRealClassName("flex flex-col gap-1 items-start","",additionalClassName)
    return (
        <div className={className}>
            <label  htmlFor={field}>
                {label}
                {required && "*"}
            </label>
            {children}
            {shouldRenderError &&
                <NativeErrInfo error={errors}/>}
        </div>
    );

}

