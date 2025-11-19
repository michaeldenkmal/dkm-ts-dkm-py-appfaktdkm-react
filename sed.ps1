

function handle_replace_file($fp, $old_expr, $new_expr) {
    $content = Get-Content $fp -Raw
    $new = $content -replace $old_expr, $new_expr

    if ($new -ne $content) {
        Set-Content $_.FullName $new
        Write-Host "Geaendert: $($fp)"
    }
}

function sed($old_expr, $new_expr) {
    Get-ChildItem ".\src" -Recurse -Include *.ts, *tsx | ForEach-Object {
        handle_replace_file -fp $_.FullName -old_expr $old_expr -new_expr $new_expr
    }
}

# wichtig sind die einfachen Anführungs zeichen bei regexps
$search_regex = ' from "(@at\.dkm/dkm-ts-lib-django/lib/[^"]+?)\.(?:ts|tsx)"'
$repl_regex = ' from "$1"'

sed -old_expr $search_regex -new_expr $repl_regex
