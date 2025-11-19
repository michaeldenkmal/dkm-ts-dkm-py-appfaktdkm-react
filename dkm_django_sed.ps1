#$search ="@at.dkm/dkm-ts-lib-django/lib/dkm_django_m.ts"
$search ="@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws.ts"
#$replace ="@at.dkm/dkm-ts-lib-django/lib/dkm_django_m"
$replace ="@at.dkm/dkm-ts-lib-django/lib/dkm_django_ws"


function edit_content($content) {

}

function sed($old_expr, $new_expr) {
    Get-ChildItem ".\src" -Recurse -Include *.ts? | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $new = $content -replace $old_expr, $new_expr

        if ($new -ne $content) {
            Set-Content $_.FullName $new
            Write-Host "Geändert: $($_.FullName)"
        }
    }
}


sed -old_expr $search -new_expr $replace
