

function handle_replace_file($fp, $old_expr, $new_expr) {
    $content = Get-Content $fp -Raw
    $new = $content -replace $old_expr, $new_expr

    if ($new -ne $content) {
        Set-Content $_.FullName $new
        Write-Host "Geaendert: $($fp)"
    }
}

function sed($old_expr, $new_expr) {
    Get-ChildItem ".\src" -Recurse -Include *.ts? | ForEach-Object {
        handle_replace_file -fp $_.FullName -old_expr $old_expr -new_expr $new_expr
    }
}

# wichtig sind die einfachen Anführungs zeichen bei regexps
$regex = 'import type \{MayBeDate\} from "(@at\.dkm/dkm-ts-lib-django/lib/[^"]+?)\.(?:ts|tsx)"'
$replacement = 'import type {MayBeDate} from "$1"'
#$search ="@at.dkm/dkm-ts-lib-django/lib/dkm_django_m.ts"
#$search ="@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws.ts"
#$replace ="@at.dkm/dkm-ts-lib-django/lib/dkm_django_m"
#$replace ="@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws"


#sed -old_expr $search -new_expr $replace
