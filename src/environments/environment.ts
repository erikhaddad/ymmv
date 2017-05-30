// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    google: {
        apiKey: 'AIzaSyAHpuuN-oTpIVi9chdAI01SRCzcrxTFsHc',
        messaging: 'AAAAXEWvP5E:APA91bGIpagExWOIMBF_Z6sQA2ktz_Y3qVOd_JuYP4fIxYIIC95tDO7pINbiFbWYprXik-' +
                    'QowhDwjhwXWlXg72AM87BSiiCLvh8_zp8anqNp5GXwsIGvf9EGICVn9N9GXE6PSpRRYv-S'
    },
    firebase: {
        apiKey: 'AIzaSyAHpuuN-oTpIVi9chdAI01SRCzcrxTFsHc',
        authDomain: 'ymmv-ac94d.firebaseapp.com',
        databaseURL: 'https://ymmv-ac94d.firebaseio.com',
        projectId: 'ymmv-ac94d',
        storageBucket: 'ymmv-ac94d.appspot.com',
        messagingSenderId: '396306104209'
    }
};
