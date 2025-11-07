import {useCallback, useRef} from "react";


export type RowScrollerKeyTyp = string |number

interface UseRowScrollerRes {
    registerRowRef: (rowKey: RowScrollerKeyTyp) => (el: HTMLTableRowElement | null)=>void;
    scrollToRow :(rowKey: RowScrollerKeyTyp)=>void;
}

export function useRowScroller():UseRowScrollerRes {
    const rowRefs = useRef<Record<RowScrollerKeyTyp, HTMLTableRowElement | null>>({});

    const registerRowRef = useCallback(
        (rowKey: RowScrollerKeyTyp) => (el: HTMLTableRowElement | null) => {
            if (el) {
                rowRefs.current[rowKey] = el;
            }
        },
        []
    );

    const scrollToRow = (rowKey: RowScrollerKeyTyp) => {
        const row = rowRefs.current[rowKey];
        if (row) {
            row.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            console.warn(`Row with key ${rowKey} not found.`);
        }
    };

    return {
        registerRowRef,
        scrollToRow,
    };
}
