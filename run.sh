#!/bin/bash
PATH=$PATH:$(npm bin)
set -x

# Production build
ng build --prod

# Generate a new index.html with an app shell
./node_modules/.bin/ngu-app-shell --module src/app/app.module.ts \
                                  --url /loading \
                                  --insert-module src/app/loading/loading.module.ts \
                                  --out dist/index.html

# Generate a SW manifest from our app
#./node_modules/.bin/ngu-sw-manifest --module src/app/app.module.ts \
#                                    --out dist/ngsw-manifest.json

./node_modules/.bin/ngu-sw-manifest --in src/ngsw-manifest.json \
                                    --out dist/ngsw-manifest.json

# Copy prebuilt worker into our site
cp node_modules/@angular/service-worker/bundles/worker-basic.min.js dist/

# Copy manifest.json to dist
#cp src/manifest.json dist/

# Serve
cd dist
angular-http-server