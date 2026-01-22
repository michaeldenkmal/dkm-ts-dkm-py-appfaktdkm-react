rem call npx vitest run dkm_word_edit_entry_util.spec.ts
rem debugger
rem set VITEST_MAX_WORKERS=1
rem set vitest=./node_modules/vitest/vitest.mjs run
rem node --inspect-brk %vitest% dkm_word_edit_entry_util.spec.ts
rem call npx vitest run %1
rem node --inspect-brk .\node_modules\vitest\vitest.mjs run --no-file-parallelism --maxWorkers=1 --no-isolate src/.../dkm_word_edit_entry_util.spec.ts
rem chrome://inspect mit chroms debuggen
set dbg_prefix=--inspect-brk
set dbg_postfix=--no-file-parallelism --maxWorkers=1 --no-isolate
node %dbg_prefix% .\node_modules\vitest\vitest.mjs run %dbg_postfix% dkm_word_edit_entry_util.spec.ts
rem node .\node_modules\vitest\vitest.mjs run dkm_word_edit_entry_util.spec.ts
