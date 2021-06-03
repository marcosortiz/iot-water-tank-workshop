# #!/bin/bash

mydir="${0%/*}"

echo ----- Deploying Backend ---
cd "$mydir"/../backend && ./bin/deploy.sh
cd ..