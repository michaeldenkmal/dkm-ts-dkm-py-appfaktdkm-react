//nr	Kundenname	Gp_id	Email Stunden honorar
import type { MayBeFloat, MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m";

export interface KuHonViewRow {
    nr:MayBeFloat
    kundenName:MayBeString
    gp_id:MayBeFloat
    email:MayBeString
    stundenhon:MayBeFloat
}


