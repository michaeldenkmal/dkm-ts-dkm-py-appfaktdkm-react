import { useEffect, useState } from "react";


export function useGlobalEvent(eventName: string) {
    const [data, setData] = useState<any | null>(null);

    useEffect(function () {
        function handler(ev: Event) {
            const ce = ev as CustomEvent;
            setData(ce.detail);        // <-- hier sind deine Daten
        }
        window.addEventListener(eventName, handler);
        return function () {
            window.removeEventListener(eventName, handler);
        };
    }, [eventName]);

    return data;
}
