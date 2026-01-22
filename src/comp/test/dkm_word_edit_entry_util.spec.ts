import type {DatenabTestRow} from "../../model/work_rep_m.ts";
import {reCalc} from "../DkmWorkEditEntry_util.ts";
import { describe, it, expect } from "vitest";

const VON=new Date(2026,0,21,8);
const BIS=new Date(2026,0,21, 11);
const HONPROH=132;

function createTestRow():DatenabTestRow {
    return {
        DATUM: new Date(2026,0,21),
        KUNDE: 123,
        EXTRAVER: undefined,
        GESAMTHONORAR: undefined,
        STUNDEN: undefined,
        ZEITBIS: undefined,
        ZEITVON: undefined,
        h_wart: null,
        HONORAR: HONPROH
    }
}

describe("dkmWorkEditEntry",()=> {
    describe("reCalc" ,()=> {
        // nichts unternehmen = Eingabe wird gleich zurückgegeben
        it("Nichts unternehmen, wenn von leer ist",()=> {
            const inp = createTestRow();
            const exp = createTestRow();
            const res = reCalc( {
                workRow: inp
            })
            expect (res).toEqual(exp)
        })
        // Nichts unternehmen, wenn bis leer ist => nicht automatisch ausfüllen sollte eher bei onBlur von von erledigt werden
        it("Nichts unternehmen von gesetzt, bis leer ist",()=> {
            const inp = createTestRow();
            inp.ZEITVON = VON;
            const exp = {
                ...inp
            }
            exp.h_wart=null;
            const res = reCalc( {
                workRow: inp
            })
            expect (res).toEqual(exp)
        })
        // von und bis eingegeben => ausgabe: { h = diff(von, bis), honproh , gesamt gesetzt, h_wart=null, extraverr=null}
        it("von und bis eingegeben",()=> {
            const inp = createTestRow();
            inp.ZEITVON = VON;
            inp.ZEITBIS = BIS;
            const exp = {
                ...inp
            }
            // h = diff(von, bis)
            exp.STUNDEN= 3;
            //honproh
            exp.HONORAR = HONPROH;
            // gesamt gesetzt
            exp.GESAMTHONORAR = exp.STUNDEN * exp.HONORAR;
            const res = reCalc( {
                workRow: inp
            })
            expect (res).toEqual(exp)
        })
        // von und bis und extraverrech sind eingegeben => ausgabe: { h = extraverrech , honproh , gesamt gesetzt(aber berechnet von extraver), h_wart=null}
        it("von und bis und extraverrech sind eingegeben",()=> {
            const inp = createTestRow();
            inp.ZEITVON = VON;
            inp.ZEITBIS = BIS;
            // extraverrech sind eingegeben
            inp.EXTRAVER = 2;
            const exp = {
                ...inp
            }
            // h = extraverrech
            exp.STUNDEN= 3;
            //honproh
            exp.HONORAR = HONPROH;

            // gesamt gesetzt(aber berechnet von extraver)
            exp.GESAMTHONORAR = (exp.EXTRAVER||0) * exp.HONORAR;
            exp.h_wart = null;
            const res = reCalc( {
                workRow: inp
            })
            expect (res).toEqual(exp)
        })
        // von und bis und h_wart sind eingegeben => ausgabe: { h = diff(von,bis)-h_wart , honproh , gesamt gesetzt(h), h_wart=h_wart, extraverrech=h - h_wart}
        it("von und bis und h_wart sind eingegeben",()=> {
            const inp = createTestRow();
            inp.ZEITVON = VON;
            inp.ZEITBIS = BIS;
            // extraverrech sind eingegeben
            inp.h_wart=1.5;
            const exp = {
                ...inp
            }
            // h = extraverrech
            exp.STUNDEN= 3;
            //honproh
            exp.HONORAR = HONPROH;

            // gesamt gesetzt(aber berechnet von extraver)
            exp.GESAMTHONORAR = exp.HONORAR * inp.h_wart;
            exp.STUNDEN = 3;
            exp.h_wart = inp.h_wart;
            const res = reCalc( {
                workRow: inp
            })
            expect (res).toEqual(exp)
        })
    })
})