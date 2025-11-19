import type {MayBeFloat} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m.ts";

export interface HonListSearchData {
    honorarnr:string
    firma:string
    weggeschickt?:boolean | null // unterscheidung zwischen ja/nein nicht ausgewählt
}

// Honorar-Nr	Verrechnet am	Kundenname	Betrag	abgerechnet	ist Weggeschickt
export interface HonListViewModel {
    hon_float_nr:number
    honorarnr:string
    verrechnet_am:Date
    firma1:string
    gesamtpreis:MayBeFloat
    ist_verrechnet:boolean
    ist_weggeschickt:boolean
}

export function createEmptyHonListSearchData():HonListSearchData {
    return {
        honorarnr:"",firma:"", weggeschickt:null
    }
}