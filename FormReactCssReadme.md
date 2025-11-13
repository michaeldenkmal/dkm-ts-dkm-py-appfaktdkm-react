# grund aufbau css

## Wrapper für gesamtes Formular

````html
<DkmRespForm addtionalClasses={"w-full lg:w-5/6 dkm-form"}>
````

### w-full

die Gesamt Breite soll beansprucht werden 

### lg:w-5/6

5/6 der Bildschirm soll bei einem Large Bildschirm verwendet werden als Breite

### dkm-form

definiert Styling für Formular - Labels - und Inputs
siehte in index.css

````css
    .dkm-form input,textarea,select {
        @apply  max-w-full w-full
    }
    .dkm-form input:disabled,textarea:disabled,select:disabled {
        @apply  bg-gray-100 text-gray-500 cursor-not-allowed opacity-70
    }

````

## Wrapper für Formularzeile

```typescript jsx
interface FormRowProps {
    children: any
}

function FormRow(props: FormRowProps) {
    return <div className={"flex flex-row flex-wrap w-full"}>
        {props.children}
    </div>
}

```

### flex

definitert einen flex

### flex-row

aufteilung soll horizontal erfolgen

### flex-wrap

aufteilung soll in eine neue Zeile erfolgen, falls
der Platz zugering ist.

### w-full

volle Breite im Container verwenden auf allen
Bildschirm größen


## Wrapper für jede Label/Control Kombination

````typescript jsx

export interface DkmFieldRowProps {
    label: string
    field:string
    shouldRenderError:boolean
    errors?: MayBeString
    children: React.ReactNode
    required?:boolean
    additionalClassName?:string
}

export default function DkmFieldRow(props:DkmFieldRowProps) {
    const {   additionalClassName, label, field, children,required,
        shouldRenderError, errors} = props;

    const className =  calcRealClassName("flex flex-col gap-1 items-start","",additionalClassName)
    return (
        <div className={className}>
            <label  htmlFor={field}>
                {label}
                {required && "*"}
            </label>
            {children}
            {shouldRenderError &&
                <NativeErrInfo error={errors}/>}
        </div>
    );

}

````
### flex

flex definiert, ohne diese Einstellung funktioniert der Rest nicht
### flex-col 

Label und Input Vertical aufteilen

### gap-1

abstand zwischen Label und Input

### items-start

links ausrichten, funktioniert nur in Verbindung mit flex


## breite definieren

```typescript jsx
function RenderField(opts: RenderFieldOpts) {
    const {label, field, required, shouldRenderError, error, colDivClass} = opts;

    return (
        <DkmFieldRow field={field} label={label}
                     shouldRenderError={shouldRenderError || false}
                     required={required}
                     errors={error}
                     additionalClassName={colDivClass}>
            {opts.children}
        </DkmFieldRow>
    )
}

```

definiert pro Feld eine Componente
die Breite wird über die ``colDivClass`` einstellen:

zb: 

 ``w-full lg:w-1/4``

### w-full
gibt an, dass bei einem kleineren Bildschirm als Large die komplette Breite verwendet wird

### lg:w-1/4

ob der Größe Large (Tailwind definition) wird ein 1/4 des verfügbaren platzes eingenommen

### Klassen in Controls

das funktioniert alles nur dann, wenn im Control ``w-full`` definiert ist.
ansonsten muss es auch dort definiert sein.

# Die Ganze Zeile verwenden

dazu muss in jedem Tag ``w-full`` angegeben werden
