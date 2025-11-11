// https://chatgpt.com/c/69006821-cb60-8327-9aff-25c4b5146790
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import Toast, {type ToastKind } from "./Toast";

export type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
  timeoutMs?: number;
};

export type ToastCenterContextType = {
  showError: (msg: string, html:string,timeoutMs?: number) => void;
  showSuccess: (msg: string, timeoutMs?: number) => void;
  showInfo: (msg: string, timeoutMs?: number) => void;
  clearToast: (id: number) => void;
};

const ToastCenterContext = createContext<ToastCenterContextType>({
  showError: function () {},
  showSuccess: function () {},
  showInfo: function () {},
  clearToast: function () {},
});

let nextId = 1;

export function ToastCenterProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [s_html, s_setHtml] = useState<string>("");

  function pushToast(kind: ToastKind, message: string, timeoutMs?: number) {
    const id = nextId++;
    const item: ToastItem = { id, kind, message, timeoutMs };
    setToasts(function (prev) {
      return [...prev, item];
    });
  }

  const showError = useCallback(function (msg: string,html:string, timeoutMs?: number) {
    // Default bei Fehler: bleibt länger stehen
      s_setHtml(html);
      pushToast("error", msg, timeoutMs ?? 8000);
  }, []);

  const showSuccess = useCallback(function (msg: string, timeoutMs?: number) {
    // Erfolg kann schneller wieder weg
    pushToast("success", msg, timeoutMs ?? 3000);
  }, []);

  const showInfo = useCallback(function (msg: string, timeoutMs?: number) {
    // Info mittlere Dauer
    pushToast("info", msg, timeoutMs ?? 5000);
  }, []);

  const clearToast = useCallback(function (id: number) {
    setToasts(function (prev) {
      return prev.filter(function (t) {
        return t.id !== id;
      });
    });
  }, []);

  // Auto-Remove via Timeout
  useEffect(
    function () {
      if (toasts.length === 0) {
        return;
      }

      // für jeden Toast mit timeoutMs einen Timer setzen
      const timers = toasts.map(function (toast) {
        if (!toast.timeoutMs) {
          return undefined;
        }
        const timerId = window.setTimeout(function () {
          clearToast(toast.id);
        }, toast.timeoutMs);
        return timerId;
      });

      return function cleanup() {
        timers.forEach(function (tid) {
          if (tid !== undefined) {
            clearTimeout(tid);
          }
        });
      };
    },
    [toasts, clearToast]
  );

  return (
    <ToastCenterContext.Provider
      value={{ showError, showSuccess, showInfo, clearToast }}
    >
      {/* Toast-Container: fixed oben, stacked */}
      <div className="pointer-events-none fixed top-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map(function (toast) {
          return (
            <div
              key={toast.id}
              className="pointer-events-auto w-full max-w-lg"
            >
              <Toast
                kind={toast.kind}
                message={toast.message}
                onClose={function () {
                    s_setHtml("");
                    clearToast(toast.id);
                }}
                html={s_html}
              />
            </div>
          );
        })}
      </div>

      {children}
    </ToastCenterContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToastCenter(): ToastCenterContextType {
  return useContext(ToastCenterContext);
}

