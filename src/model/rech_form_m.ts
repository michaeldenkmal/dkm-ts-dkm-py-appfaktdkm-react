import type { MayBeDate, MayBeDecimal, MayBeFloat, MayBeInteger, MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m.ts";

export interface RechFormRow {
    //     #vnr -> Pk
    vnr?:MayBeInteger
    // vnr=forms.FloatField(required=False,
    //                      widget=forms.HiddenInput())
    // #rechnungsnr
    rechnungsnr?:MayBeString
    // rechnungsnr=forms.CharField(max_length=RechnungenConsts.rechnungsnr_fl,required=False)
    // #firma
    // firma1 = forms.ModelChoiceField(
    //     queryset=Kundenhonorar.objects.all()
    // )
    f_nr?:MayBeFloat
    //
    //
    //
    // #verrechnet am
    // verrechnet_am=forms.DateField(required=False)
    verrechnet_am?:MayBeDate
    // #notizen
    // zwischensumme=create_2_digit_calced_field(data_attr='zwischensumme')
    zwischensumme?:MayBeDecimal
    // mwst=create_2_digit_calced_field(data_attr="mwst")
    mwst?:MayBeDecimal
    // gesamtpreis=create_2_digit_field(data_attr="gesamtpreis")
    gesamtpreis?:MayBeDecimal
    do_id?:MayBeInteger
}

export interface RechPosRow {
    // pos = models.FloatField(db_column='Pos', blank=True, null=True)  # Field name made lowercase.
    pos?:MayBeInteger
    // bezeichnung = models.CharField(max_length=ArtikelrechnungConst.bezeichnung_fl, db_collation='Latin1_General_CI_AS',
    //                                blank=True, null=True)
    bezeichnung?:MayBeString
    // rechnnr = models.IntegerField(blank=True, null=True)
    rechnnr?:MayBeInteger
    // menge = models.DecimalField(db_column='Menge',
    //                           blank=True, null=True,max_digits=19,decimal_places=2)  # Field name made lowercase.
    menge?:MayBeFloat
    // einzelpreis = models.DecimalField(db_column='Einzelpreis', max_digits=19, decimal_places=4, blank=True,
    //                                   null=True)  # Field name made lowercase.
    einzelpreis?:MayBeDecimal
    // gesamtpreis = models.DecimalField(db_column='Gesamtpreis', max_digits=19, decimal_places=4, blank=True,
    //                                   null=True)  # Field name made lowercase.
    gesamtpreis?:MayBeDecimal
    // rechnungsnr = models.CharField(db_column='Rechnungsnr', max_length=50, db_collation='Latin1_General_CI_AS',
    //                                blank=True, null=True)  # Field name made lowercase.
    rechnungsnr_c?:MayBeString
    // nr = models.AutoField(primary_key=True)
    nr?:MayBeInteger
}
export interface RechGuiData{
    rech_row:RechFormRow|null
    pos_rows:Array<RechPosRow>
}


function createNewRechRow():RechFormRow {
    return {
    }
}

function createNewRechPosRows():Array<RechPosRow> {
    const ret:Array<RechPosRow> =[];
    for (let i:number=0; i<3;i++) {
        ret.push(createNewRechPosRow(i+1));
    }
    return ret;
}


export function createNewRechPosRow(pos:number):RechPosRow {
    return {
        pos
    }
}

export function createNewRechGuiData():RechGuiData {
    return {
        rech_row: createNewRechRow(),
        pos_rows: createNewRechPosRows(),
    }
}

export interface RechFormRowErrs{
    f_nr?:MayBeString
}

export function anyErrors(errs:RechFormRowErrs):boolean {
    const len = Object.keys(errs).length
    return !!len;
}

export interface SaveRechDataRes{
    rech_data?: RechGuiData |null
    errors?: RechFormRowErrs|null
}

