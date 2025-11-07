import { useEffect } from "react";

export function useTitle(title: string) {
    useEffect(function () {
        document.title = title;
    }, [title]);
}
