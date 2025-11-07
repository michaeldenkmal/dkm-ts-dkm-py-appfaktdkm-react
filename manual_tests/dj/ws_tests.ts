import {ensureCsrfToken} from "../../src/dkm_django/dkm_django_ws";
import * as rech_form_ws from "../../src/ws/rech_form_ws"
import {initIDbConf} from "@at.dkm/dkm-ts-lib-websrvc/lib/IDbConf";
import Decimal from "decimal.js";

const DKMFAKT_APPDKMFAKT_CONTEXT = "dkmfakt/appdkmfakt"

const django_root_url = "http://localhost:8080/dkmfakt";

function do_assert(checkfn: () => boolean, msg: string) {
    if (checkfn()) {
        appendout(`${msg}: ok`)
    } else {
        appendout(`${msg} NICHT OK`)
    }
}

function appendout(out:string) {
    const outdiv =document.getElementById("out");
    const old_html = outdiv.innerHTML;
    outdiv.innerHTML = old_html +"<p>" +  out;
}

async function main() {
    const csrftokem = await ensureCsrfToken("http://localhost:8000/dkmfakt")
    initIDbConf(document.location.href, "", {
        [DKMFAKT_APPDKMFAKT_CONTEXT]: "http://localhost:8000"
        // "wa_ga_gastv":"http://localhost:8084",
        // "wa_ga_anwlst":"http://localhost:8084",
        // "dkmMVC":"http://localhost:8084",
        // "wa_ga_grpvw23":"http://localhost:8084"
    })
    const rows = await rech_form_ws.rech_form_get_by_vnr(246);
    if (rows.rech_row) {
        do_assert(() => (rows.rech_row.verrechnet_am instanceof Date),
            "verrechnet==Date")
        const gesamtpreis= rows.rech_row.gesamtpreis ||null
        // @ts-ignore
        do_assert(() => (gesamtpreis instanceof Decimal),
            "gesamtpreis==Decimal")

    } else {
        console.error("keine Rechungszeile zurückgeliefert")
    }
    appendout(JSON.stringify(rows, null, 2))
}

main();

