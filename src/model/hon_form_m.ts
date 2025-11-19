import type {Float, MayBeBool, MayBeFloat, MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";



export interface HonorarRow {
    nr:number;
    anwen:string;
    honorarnr:string;
    gesamtpreis:number;
    weggeschickt:MayBeBool;
    do_id:MayBeFloat
}

export interface WorkRepRow {
    work_rep_float_nr:Float;
    work_date:Date;
    von:Date;
    bis:Date;
    taetigkeit:string;
    gesamthonorar:Float;
    honorarnr?:MayBeString   ;
}
export interface HonGuiData{
    hon_row: HonorarRow
    work_rep_rows:Array<WorkRepRow>
    hon_row_changed?:boolean
    work_rep_rows_changed?:Array<Float>
}


