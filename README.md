# Git Sub repos



# Deployment

## Client builden

```cmd
 .\build_and_deploy.ps1
```

## Server 

auf ```dkmsrvc``` folgendes Skript ausfürhen: 
```"C:\inetpub\wwwroot\update_faktfe.bat"```

# Backend

https://github.com/michaeldenkmal/dkm-py-dkm-faktmssql.git

D:\projekte\dkm\dkm_py\dkm-py-dkm-faktmssql


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Reducer in Forms

## fast-deep-equal ====

https://chatgpt.com/c/69118f33-6b44-832e-9dcd-f7b7d01b7a92

```bash
yarn add  fast-deep-equal@3
```


```typescript

import equal from "fast-deep-equal/es6";

useEffect(function () {
    if (!equal(props.guiData, lastApplied.current)) {
        s_dispGuiData({type:"set_data_direct", newData: props.guiData});
        lastApplied.current = props.guiData;
    }
}, [props.guiData, s_dispGuiData]);
```
## immer

Library für immutable Editing

```bash 
yarn add use-immer immmer
```

```typescript
// in einer Funktion COmponent

const [s_guiData, s_dispGuiData] = useImmerReducer(honFormReducer, props.guiData);

// Reducer
type Action =
    | { type: "set_data_direct", newData:HonGuiData }
    | { type: "set_weggeschickt"; istWeggeschickt: MayBeBool }
    | { type: "chg_work_rep_honararnr";
    honorarnr: MayBeString;
    rowIdx: Integer }
    |{ type:"set_do_id";
    do_id:Float
};

const handlers: CaseMap<HonGuiData, Action> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set_data_direct:(data,act)=>{return {...act.newData}},
    set_weggeschickt:(data,act )=> {
        data.hon_row.weggeschickt = act.istWeggeschickt
        data.hon_row_changed = true
    },
    chg_work_rep_honararnr:(data, act)=> {
        const workrow = data.work_rep_rows[act.rowIdx];
        workrow.honorarnr = act.honorarnr
        addToArrPropIfNotExists<HonGuiData,Float>( {
            elem: workrow.work_rep_float_nr,
            arr_prop:"work_rep_rows_changed",
            container_object:data
        })

    },
    set_do_id:(data, act)=> {
        data.hon_row.do_id = act.do_id
        data.hon_row_changed = true
    }
}

export function honFormReducer(guidata: HonGuiData, action: Action): HonGuiData|void {
    const fn = handlers[action.type];
    return fn(guidata,action as any)
}


```

