// BaseMenuBar.tsx
import React from "react";
import {useLocation} from "wouter";


export type BaseMenuItem = {
    label: string;
    path?: string;
    children?: BaseMenuItem[];
    disabled?: boolean;
    onNavigate?: () => void;
};

export type BaseMenuBarProps = {
    items: BaseMenuItem[];
    currentCapt?: string;

    currentPath?: string;                 // z.B. von Router
    onNavigate?: (path: string) => void;  // Navigation delegieren (Router/History)
    brand?: React.ReactNode;
};

export default function BaseMenuBar(props: BaseMenuBarProps) {
    const { items, currentPath, onNavigate, brand } = props;
    const [openIdx, setOpenIdx] = React.useState<number | null>(null);
    const [, navigate] = useLocation();

    function isActive(path?: string): boolean {
        if (!path || !currentPath) return false;
        return currentPath === path || currentPath.startsWith(path + "/");
    }

    function handleItemClick(item: BaseMenuItem, idx: number) {
        if (item.disabled) return;
        if (item.children && item.children.length) {
            setOpenIdx(openIdx === idx ? null : idx);
            return;
        }
        //if (item.path && onNavigate) onNavigate(item.path);
        if (item.path) {
            if (!onNavigate) {
                navigate(item.path);
            } else {
                onNavigate(item.path);
            }
        }
        if (item.onNavigate) {
            item.onNavigate()
        }
        setOpenIdx(null);
    }

    function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
        // schließt Dropdowns, wenn der Fokus den Menübalken verlässt
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenIdx(null);
    }

    return (
        <div onBlur={handleBlur} className="w-full border-b bg-white">
            <nav className="mx-auto max-w-7xl px-3">
                <div className="flex h-12 items-center justify-between">
                    <div className="font-semibold">{  brand ?? props.currentCapt  ?? "Dkm Fakturierung"}</div>
                    <ul className="flex items-stretch gap-1">
                        {items.map(function (item, idx) {
                            const active = isActive(item.path);
                            const open = openIdx === idx && !!item.children?.length;
                            return (
                                <li key={idx} className="relative">
                                    <button
                                        type="button"
                                        className={
                                            "px-3 py-2 rounded-md text-sm " +
                                            (item.disabled ? "opacity-50 cursor-not-allowed " : "hover:bg-gray-50 ") +
                                            (active ? "bg-gray-100 " : "")
                                        }
                                        aria-haspopup={item.children?.length ? "menu" : undefined}
                                        aria-expanded={item.children?.length ? open : undefined}
                                        onClick={function () { handleItemClick(item, idx); }}
                                    >
                                        {item.label}
                                    </button>

                                    {open && (
                                        <div
                                            role="menu"
                                            className="absolute left-0 mt-2 min-w-44 rounded-md border bg-white shadow-md z-20"
                                        >
                                            {item.children!.map(function (sub, sidx) {
                                                const subActive = isActive(sub.path);
                                                return (
                                                    <button
                                                        key={sidx}
                                                        type="button"
                                                        role="menuitem"
                                                        disabled={sub.disabled}
                                                        className={
                                                            "block w-full text-left px-3 py-2 text-sm rounded-md " +
                                                            (sub.disabled ? "opacity-50 cursor-not-allowed " : "hover:bg-gray-50 ") +
                                                            (subActive ? "bg-gray-100 " : "")
                                                        }
                                                        onClick={function () {
                                                            if (!sub.disabled && sub.path && onNavigate) onNavigate(sub.path);
                                                            setOpenIdx(null);
                                                        }}
                                                    >
                                                        {sub.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </div>
    );
}
