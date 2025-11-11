


interface AddToArrPropIfNotExistsProps<T,E>{
    container_object:Partial<Record<keyof T, any>>
    arr_prop:keyof T
    elem:E
    fnElemExists?:(e:E) => boolean
}
/***
 erzeut ein Array oder
 T = Type of Object
 E = Type of elem
 */
export function addToArrPropIfNotExists<T,E>(props:AddToArrPropIfNotExistsProps<T,E>):void {
    let arr = props.container_object[props.arr_prop] as Array<E>;
    if (!arr) {
        arr = [];
        arr.push(props.elem);
        props.container_object[props.arr_prop] = arr;
    } else {
        if (!Array.isArray(arr)) {
            throw new Error("Expected an array to be an array:" + JSON.stringify(props));
        }
        if (!props.fnElemExists) {
            if (arr.indexOf(props.elem) === -1) {
                arr.push(props.elem);
            }
        } else {
            if (!props.fnElemExists(props.elem)) {
                arr.push(props.elem);
            }
        }
    }

}