# PowerShell `sed` & Regex Chat-Zusammenfassung

## 🔹 sed in PowerShell
PowerShell hat kein eigenes `sed`, aber ähnliche Funktionen über `-replace`, `Get-Content` und `Set-Content`.

### Einfacher Text-Ersatz
```powershell
(Get-Content file.txt) -replace 'alt', 'neu' | Set-Content file.txt
```

### Rekursiv über ein Verzeichnis mit bestimmten Endungen
```powershell
Get-ChildItem \"C:\\pfad\" -Recurse -Include *.txt, *.log |
    ForEach-Object {
        (Get-Content $_.FullName) -replace 'alt', 'neu' | Set-Content $_.FullName
    }
```

### Nur neu schreiben, wenn etwas geändert wurde
```powershell
Get-ChildItem \"C:\\pfad\" -Recurse -Include *.txt, *.log | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $new = $content -replace 'alt', 'neu'

    if ($new -ne $content) {
        Set-Content $_.FullName $new
        Write-Host \"Geändert: $($_.FullName)\"
    }
}
```

---

## 🔹 Regular Expressions in PowerShell
PowerShell nutzt vollwertige .NET-Regex.

### Beispiel
```powershell
\"abc123\" -match \"\\d+\"   # True
$Matches[0]               # \"123\"
```

### Regex mit Gruppen
```powershell
\"abc123\" -match \"([a-z]+)(\\d+)\"
$Matches[1]   # abc
$Matches[2]   # 123
```

### Regex-Ersetzung
```powershell
\"abc123\" -replace \"\\d+\", \"###\"  # abc###
```

---

## 🔹 Anforderung: `MayBeDate`-Imports anpassen

### Ziel
Zeilen wie:
```ts
import type {MayBeDate} from \"@at.dkm/dkm-ts-lib-django/lib/foo/bar.ts\"
```
sollen werden zu:
```ts
import type {MayBeDate} from \"@at.dkm/dkm-ts-lib-django/lib/foo/bar\"
```

### Regex & Ersatz
```powershell
'import type \\{MayBeDate\\} from \"(@at\\.dkm/dkm-ts-lib-django/lib/[^\"]+?)\\.(?:ts|tsx)\"',
'import type {MayBeDate} from \"$1\"'
```

### Erklärung
- `import type \\{MayBeDate\\} from \"` → matcht nur diese Imports
- `(@at\\.dkm/dkm-ts-lib-django/lib/[^\"]+?)` → fängt Pfad ohne Extension ein
- `\\.(?:ts|tsx)` → matcht `.ts` oder `.tsx`
- Ersetzung: `'import type {MayBeDate} from \"$1\"'` → entfernt Endung

### Komplettes Skript
```powershell
Get-ChildItem \"C:\\projekt\" -Recurse -Include *.ts, *.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $new = $content -replace 'import type \\{MayBeDate\\} from \"(@at\\.dkm/dkm-ts-lib-django/lib/[^\"]+?)\\.(?:ts|tsx)\"', 'import type {MayBeDate} from \"$1\"'

    if ($new -ne $content) {
        Set-Content $_.FullName $new
        Write-Host \"Geändert: $($_.FullName)\"
    }
}
```

---

## 🔹 Regex in Variablen speichern
```powershell
$regex = 'import type \\{MayBeDate\\} from \"(@at\\.dkm/dkm-ts-lib-django/lib/[^\"]+?)\\.(?:ts|tsx)\"'
$replacement = 'import type {MayBeDate} from \"$1\"'

$content = Get-Content file.ts -Raw
$new = $content -replace $regex, $replacement
```

💡 **Tipp:** Immer `'...'` (Single Quotes) für Regex verwenden, damit keine PowerShell-Escapes (`$`, `\
`, etc.) aktiv werden.