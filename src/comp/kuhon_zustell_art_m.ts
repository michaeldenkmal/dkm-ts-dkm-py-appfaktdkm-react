import type {MayBeString} from "@at.dkm/dkm-ts-lib-django/lib/dkm_django_m.ts";

export type KuHoZustellArtType = "Post"|"Email"|null|undefined|"";

export const KuHoZustellArtSet = new Set<KuHoZustellArtType>(["Post","Email"])

export function strToKuHoZustellArtType(str:MayBeString):KuHoZustellArtType {
    if (!str) {
        return null;
    }
    if (!KuHoZustellArtSet.has(str as KuHoZustellArtType)) {
        throw `${str} ist not a valid KuHoZustellArtType `
    }
    return str as KuHoZustellArtType;
}
