import type {BaseMenuItem} from "./dkm_comps/BaseMenuBar.tsx";
import {DkmFaktRouterConsts} from "./dkm_fakt_router.ts";

export const MITM_RECH_LIST : BaseMenuItem = {
    label: "Rechnungsliste",
    path: "/rech_list/start"
}

export const MITM_HON_LIST : BaseMenuItem = {
    label: "Honorarliste",
    path: "/hon_list/start"
}

export const MITM_KUHON_LIST : BaseMenuItem = {
    label: "Kundenhonorarliste",
    path: DkmFaktRouterConsts.getKuHonListUrl()
}
export const MITM_HON_ABRECH : BaseMenuItem = {
    label: "Honorarabrechnung",
    path: "/honorar/form"
}
export const MITM_RECH_NEW : BaseMenuItem = {
    label: "Neue Rechnung",
    path: DkmFaktRouterConsts.getNewRechUrl()
}

export const MITM_RECH_FORM : BaseMenuItem = {
    label: "Rechnungsbearbeitung",
    path: "/rech_list/start"
}

export const MITM_HON_FORM : BaseMenuItem = {
    label: "Honorar-Bearbeitung",
    path: "/hon_form/start"
}
// Kundenhonorar
// Honorarabrechnung
// Honorarliste


