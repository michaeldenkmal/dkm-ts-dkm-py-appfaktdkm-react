import {calcRealClassName} from "./native_ctrl_util.ts";
import type {MayBeString} from "../dkm_django/dkm_django_m.ts";

export interface RadioOption {
    label: string;
    value: string;
}

interface Props {
    value: MayBeString;
    options: RadioOption[];
    onChange: (value: MayBeString) => void;
    className?: string;
    additionalClassName?: string;
    name: string; // required to group radio buttons
    disabled?: boolean;
    required?: boolean;
}

export function NativeRadioGroup(props: Props) {
    const className = calcRealClassName("inline-flex items-center space-x-2 mr-4 w-full", props.className, props.additionalClassName);

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(evt.target.value);
    }

    return (
        <div className={className}>
            {props.options.map((opt) => (
                <label key={opt.value} >
                    <input
                        type="radio"
                        name={props.name}
                        value={opt.value}
                        checked={props.value === opt.value}
                        onChange={handleChange}
                        disabled={props.disabled}
                        required={props.required}
                    />
                    <span>{opt.label}</span>
                </label>
            ))}
        </div>
    );
}
