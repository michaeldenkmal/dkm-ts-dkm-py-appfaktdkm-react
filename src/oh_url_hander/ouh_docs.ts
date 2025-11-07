import {loadUrlWithOutWindow} from "@at.dkm/dkm-ts-lib-browser-gen/lib/browserUtil";

export function gotoDoc(do_id:number) {
    const  url = `offhlp://docs/opendoc?id=${do_id}`;
    loadUrlWithOutWindow(url);
}