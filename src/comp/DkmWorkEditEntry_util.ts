import {type DatenabTestRow} from "../model/work_rep_m.ts";
import {calcDateDiffOfHours} from "@at.dkm/dkm-ts-lib-gen/lib/dateDiff";
import {dateAddDay, dateAddHour} from "@at.dkm/dkm-ts-lib-gen/lib/dateUtil";

interface RecalcParams {
    workRow: DatenabTestRow
    bIgnoreExtraVerr: boolean
    bisTouched:boolean
}

function buildDateFromDayDateAndTimeDate(dayDate:Date, timeDate:Date ):Date {
    return new Date(
        dayDate.getFullYear() ,
        dayDate.getMonth() ,
        dayDate.getDate(),
        timeDate.getHours(),
        timeDate.getMinutes()
    )
}

export function reCalc(pars: RecalcParams): DatenabTestRow {
    // Ausgangsdaten, von , bis, honorar pro h, extraverr
    // Ergebnisdaten : h, gesamthonorar
    //var von, bis, honorarProH, extraVerRech, dVon, dBis;
    //var h, gesamt;


    const ret:DatenabTestRow = {
        ...pars.workRow
    }
    if (!pars.workRow.ZEITVON || !pars.workRow.DATUM ) {
        return ret;
    }



    if ( (!pars.bisTouched)&& (!ret.ZEITBIS) &&(ret.ZEITVON)) {
        const bisnew =dateAddHour(ret.ZEITVON,1);
        ret.ZEITBIS = bisnew;
    }
    //dataObj.getValuesFromEdits(dataObj);


    const extraverrech = ret.EXTRAVER;
    let dVon: Date;
    let dBis: Date;
    let h: number=0;

    //noinspection JSCheckFunctionSignatures
    if ( ((!extraverrech) || isNaN(extraverrech) || (pars.bIgnoreExtraVerr))
            && (ret.DATUM) && (ret.ZEITVON) && (ret.ZEITBIS)
        ){
        dVon = buildDateFromDayDateAndTimeDate(ret.DATUM,ret.ZEITVON);
        dBis = buildDateFromDayDateAndTimeDate(ret.DATUM,ret.ZEITBIS);

        // wenn von > bis, dann bei bis +1 Tag zb 23:30 bis 2:30
        if (dVon.getTime() > dBis.getTime()) {
            dBis = dateAddDay(dBis,1)
        }
        ret.ZEITVON = dVon
        ret.ZEITBIS = dBis
        //h = TDkmjsDateUtil.DATEDIFF(TDATE_ADD_DATEPART.HOUR(), dVon, dBis);
        h = calcDateDiffOfHours(dVon, dBis);

        if (h < 0) {
            h = 24 - (h * -1)
        }
        ret.STUNDEN = h;
        if (((!ret.EXTRAVER) || (isNaN(ret.EXTRAVER))) && (ret.h_wart)) {
            ret.EXTRAVER = h - ret.h_wart;
        }
        // nicht autmatisch speichern sonst kann später nichts mehr eingegeben werden
    } else {
        if (ret.EXTRAVER) {
            h = ret.EXTRAVER;
        }
    }
    /*if (isNaN(ret.EXTRAVER)) {
        ret.EXTRAVER = null;
    }*/

    if (ret.HONORAR && h) {
        ret.STUNDEN = h;
        const honorarProH = ret.HONORAR;
        const gesamt = honorarProH * h;
        ret.GESAMTHONORAR = gesamt;
    }

    console.log(`in:${JSON.stringify(pars.workRow)}, out:${JSON.stringify(ret)}`);
    return ret;
}

export function isSaveValid(row: DatenabTestRow): boolean {
    // Benötige Felder: am,von,bis, Tätigkeit
    if ((!row.DATUM)
        || (!row.ZEITVON)
        || (!row.ZEITBIS)
        || (!row.TAETIGKEIT)) {
        return false;
    }
    return true;
}