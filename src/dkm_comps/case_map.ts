export type CaseMap<S, A extends { type: string }> = {
    [K in A["type"]]: (draft: S, action: Extract<A, { type: K }>) => S | void;
};
