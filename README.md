**Getting Started**

Update the CLI to latest version

```bash
sudo npm install -g @angular/cli
```

Change to parent directory and start dev server

```bash
ng new PROJECT_NAME --style=scss
cd PROJECT_NAME
ng serve --port 4200
```

Point browser to [http://localhost:4200](http://localhost:4200) to make sure **"app works!"**


**Install Basic and UI dependencies**

```bash
sudo npm install --save @angular/material hammerjs @angular/flex-layout rxjs @angular/animations \
                        @angular/service-worker ng-pwa-tools @angular/platform-server
```


**Install Firebase and AngularFire2 dependencies**

```bash
sudo npm install --save firebase angularfire2
```


**Enable service worker and push notifications**

_main.ts_

```javascript
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/worker-basic.min.js');
        }
    });
```

_app.module.ts_

```javascript
import {NgServiceWorker, ServiceWorkerModule} from '@angular/service-worker';

imports: [
    BrowserModule.withServerTransition({appId: 'app-name'}),
    RouterModule.forRoot([...]),
    ServiceWorkerModule,
    …
]

export class AppModule {
    constructor(sw: NgServiceWorker) {
        sw.registerForPush({
            applicationServerKey: '<YOUR-FCM-API-KEY>'
        }).subscribe(sub => {
            console.log(sub.toJSON());
        });
     
        sw.push.subscribe(msg => {
            console.log('got push message', msg);
        });
    }
}
```


**Gotcha - add module.id to your components and set your routes**

_(otherwise your manifest generation may FAIL)_

```javascript
moduleId: module.id
```


**Build the app**

```bash
ng build --prod
```


**Generate manifest**

```bashh
./node_modules/.bin/ngu-sw-manifest --module src/app/app.module.ts
```


**Create ngsw-manifest.json file in src folder**

_Note: change "freshness" to "performance" if your app doesn't need realtime_

```javascript
{
  "dynamic": {
    "group": [
      {
        "name": "firebase",
        "urls": {
          "<YOUR-FIREBASE-HOSTING-URL>": {
            "match": "prefix"
          }
        },
        "cache": {
          "optimizeFor": "freshness",
          "maxAgeMs": 3600000,
          "maxEntries": 20,
          "strategy": "lru"
        }
      }
    ]
  },
  "push": {
    "showNotifications": true
  }
}
```


**Generate Loading module**

```bash
ng g module Loading
```


**Generate static app shell loading route**

_Note: make sure your <router-outlet></router-outlet> exists in app.component.html_

```bash
./node_modules/.bin/ngu-app-shell --module src/app/app.module.ts --url /loading --insert-module src/app/loading/loading.module.ts
```


**Set up firebase HTTP/2 push**

```bash
./node_modules/.bin/ngu-firebase-push --module src/app/app.module.ts
```


**Full run.sh script**

_Note: you may need to add permission to the file: chmod +x run.sh_

```bash
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

./node_modules/.bin/ngu-sw-manifest --module src/app/app.module.ts \

                                    --out dist/ngsw-manifest.json

# Copy prebuilt worker into our site

cp node_modules/@angular/service-worker/bundles/worker-basic.min.js dist/

# Serve

cd dist

http-server
```


**Full deploy.sh script**

_Note: you may need to add permission to the file: chmod +x run.sh_

```bash
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

./node_modules/.bin/ngu-sw-manifest --module src/app/app.module.ts \

                                    --out dist/ngsw-manifest.json

# Copy prebuilt worker into our site

cp node_modules/@angular/service-worker/bundles/worker-basic.min.js dist/

# Deploy

firebase deploy
```


**Run PWA build script and server**

```
./run.sh
```


**Deploy your app**

```
./deploy.sh
```


**References** 

[Google I/O 2017 session](https://events.google.com/io/schedule/?section=may-18&sid=5bd70da9-c3b6-4b39-85c2-a8fbe140b7f2)

[Github: alxhub/io17](https://goo.gl/LuPq0r)

[Google Developers: Debugging Service Workers](https://goo.gl/i5HePC)

