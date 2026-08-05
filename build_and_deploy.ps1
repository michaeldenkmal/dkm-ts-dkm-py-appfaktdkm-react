vite build
# :robocopy .\dist N:\denkmalaccdb\dkmfaktfe *.* /MIR
# :copy .\web.config N:\denkmalaccdb\dkmfaktfe
scp -r .\dist\* dkmfakt@ubtdkmfakt.denkmal.intern:/var/www/dkmfakt-frontend/dkmfaktfe/