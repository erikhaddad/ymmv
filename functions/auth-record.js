'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.createUserRecord = functions.auth.user().onCreate(event => {
    const user = event.data; // The Firebase user.

    console.log('user data', user);

    const newUser = {
        'id': user.uid,
        'name': user.displayName,
        'email': user.email,
        'avatar': user.photoURL,
        'created': ''+user.metadata.createdAt
    };

    return admin.database().ref(`/users/${user.uid}`).update(newUser);
});
