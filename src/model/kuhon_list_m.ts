//nr	Kundenname	Gp_id	Email Stunden honorar
import type { MayBeFloat, MayBeString} from "../dkm_django/dkm_django_m.ts";

export interface KuHonViewRow {
    nr:MayBeFloat
    kundenName:MayBeString
    gp_id:MayBeFloat
    email:MayBeString
    stundenhon:MayBeFloat
}

