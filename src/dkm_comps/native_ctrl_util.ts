export function calcRealClassName(defaultClassName:string, propsClassName:string|undefined, additionalClassName:string|undefined):string {
    if (propsClassName) {
        if (additionalClassName) {
            return `${propsClassName} ${additionalClassName}`;
        } else {
            return propsClassName
        }
    } else {
        if (additionalClassName) {
            return `${defaultClassName} ${additionalClassName}`;
        }
        return defaultClassName;
    }

}