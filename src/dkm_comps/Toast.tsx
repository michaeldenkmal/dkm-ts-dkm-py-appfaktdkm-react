import HtmlViewer from "./HtmlViewerComp.tsx";

export type ToastKind = "error" | "success" | "info";

export type ToastProps = {
  kind: ToastKind;
  message: string;
  html?:string;
  onClose?: () => void;
};

function kindStyles(kind: ToastKind) {
  // wir liefern Tailwind-Klassen abhängig vom Typ
  switch (kind) {
    case "error":
      return {
        outer: "border-red-300 bg-red-50 text-red-800",
        icon: "text-red-600",
        label: "Fehler",
      };
    case "success":
      return {
        outer: "border-green-300 bg-green-50 text-green-800",
        icon: "text-green-600",
        label: "Erfolg",
      };
    case "info":
    default:
      return {
        outer: "border-blue-300 bg-blue-50 text-blue-800",
        icon: "text-blue-600",
        label: "Info",
      };
  }
}

export default function Toast(props: ToastProps) {
  const { kind, message, onClose } = props;
  const styles = kindStyles(kind);

  function renderHtmlViewer() {
      if (props.html) {
          return <HtmlViewer html={props.html}/>
      }
  }
  return (
    <div
      className={
        "flex w-full items-start gap-1 rounded-md border px-1 py-1 text-sm shadow-sm overflow-hidden" +
        styles.outer
      }
      role="alert"
    >
      {/* Icon / Label */}
      <div className={"font-bold text-xs leading-5 overflow-hidden" + styles.icon}>
        {styles.label}
      </div>

      {/* Text */}
      <div className="flex-1 text-sm overflow-hidden py-3">
            {message}
          {renderHtmlViewer()}
      </div>
      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-medium opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
