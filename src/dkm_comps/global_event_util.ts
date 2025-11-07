export const DKM_ERROR_EVENT = "DKM_ERROR_EVENT";

export type DkmErrorEvtInfo= {
    msg:string
}

export function dispatchErrorEvt(data:DkmErrorEvtInfo) {
    dispatchGlobalEvt(DKM_ERROR_EVENT,data)
}

export function dispatchGlobalEvt(evtName:string, data:any) {
    window.dispatchEvent(
        new CustomEvent(evtName, {
            detail: data
        })
    );
}
