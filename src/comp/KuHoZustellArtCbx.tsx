import {NativeRadioGroup, type RadioOption} from "../dkm_comps/NativeRadioGroup.tsx";
import type {MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";
import type {KuHoZustellArtType} from "./kuhon_zustell_art_m.ts";


interface Props {
    className?:string
    value:KuHoZustellArtType
    onChange: (value: KuHoZustellArtType) => void
    additionalClassName?:string
}

function buildOpts():RadioOption[] {
    return [
        {value:"Post", label:"Post"},
        {value:"Email", label:"Email"}
    ]
}

export default function KuHoZustellArtCbx(props: Props) {
    function handleChange(value:MayBeString) {
        props.onChange(value as KuHoZustellArtType);
    }

    return <NativeRadioGroup value={props.value} options={buildOpts()}
                             className={props.className}
                             onChange={handleChange} name={"zustellart"}
                             additionalClassName={props.additionalClassName}
    />
}
