import {describe, expect,test} from "vitest";
import * as hon_form_data_reducer from "../hon_form_data_reducer.ts";
import type {HonGuiData} from "../../model/hon_form_m.ts";

export function makeTestHonGuiData(): HonGuiData {
    return {
        hon_row: {
            nr: 1,
            anwen: "GA",
            honorarnr: "HON001",
            gesamtpreis: 1234.50,
            weggeschickt: false,
            do_id: 42.0
        },
        work_rep_rows: [
            {
                work_rep_float_nr: 1.0,
                work_date: new Date(2025, 0, 2),           // 02.01.2025
                von:        new Date(2025, 0, 2,  8, 0),   // 08:00
                bis:        new Date(2025, 0, 2, 16, 0),   // 16:00
                taetigkeit: "Planung",
                gesamthonorar: 350.00,
                honorarnr: "HON001"
            },
            {
                work_rep_float_nr: 2.0,
                work_date: new Date(2025, 0, 3),           // 03.01.2025
                von:        new Date(2025, 0, 3,  8, 0),
                bis:        new Date(2025, 0, 3, 12, 0),
                taetigkeit: "Messung",
                gesamthonorar: 200.00,
                honorarnr: "HON001"
            },
            {
                work_rep_float_nr: 3.0,
                work_date: new Date(2025, 0, 5),           // 05.01.2025
                von:        new Date(2025, 0, 5, 10, 0),
                bis:        new Date(2025, 0, 5, 17, 0),
                taetigkeit: "Auswertung",
                gesamthonorar: 400.00,
                honorarnr: "HON001"
            }
        ],
        hon_row_changed: false,
        work_rep_rows_changed: []
    };
}


describe("hon_form_data_reducer", ()=> {
    test("getLastResettleDate",()=> {
        const expected = new Date(2025,0,5);
        const res = hon_form_data_reducer.getLastResettleDate(makeTestHonGuiData(),"HON001");
        expect(res?.toString()).toBe(expected.toString());
    })
})