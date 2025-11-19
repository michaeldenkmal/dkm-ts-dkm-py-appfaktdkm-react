$PY="c:\Python37\python"
$PYTHON_PATH="d:\projekte\python\dkmLib"
$white_list="d:\projekte\devTools\bash\git_util\std_white_list.lst"
$std_ignore_list="d:\projekte\devTools\bash\git_util\std_ignore_list.lst"
$ABS_PATH=$PWD.Path
$NOTEPADPP="C:\Program Files\Notepad++\notepad++.exe"
echo $ABS_PATH
#pause
$result_file="$($env:TEMP)/supergit.log"
& $PY "$($PYTHON_PATH)\super_git_util.py" $ABS_PATH $white_list $std_ignore_list > $result_file
#pause
& $NOTEPADPP $result_file

