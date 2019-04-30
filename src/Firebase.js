import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import _ from 'lodash'

/* FIXME:
 * WARNING: Do not store any secrets (such as private API keys) in your React app!
Environment variables are embedded into the build, meaning anyone can view them by inspecting your app's files.
 */

const devConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
  projectId: process.env.REACT_APP_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
}
const prodConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const config =
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(config);

      this.auth = app.auth();
      this.db = app.database();
      this.storage = app.storage();
    }
  }
  // If any file already exist at the path, nothing happens
  // If no file already exist there, it is put
  stash = (rawPath,file) => {

    const thisDb = this

    // Create the file metadata
    //var metadata = {
    //  contentType: 'image/jpeg'
    //};
    
    // Upload file and metadata to the object 'images/mountains.jpg'
    const path = _.castArray(rawPath).join('/');
    const infoPath = 'storage/'+path;

    // Check if the file exists in the Real Time Database before uploading
    this.loadPath(infoPath, function(snapshot) {
      //if (snapshot && snapshot.exists()) return
      if (snapshot) {
        console.log('File is already stashed')
        return
      }
      //if (snapshot.exists()) return
   
      // save the state of upload before really uploading to avoid messed up state 
      thisDb.setPath(infoPath, 'uploading...', function(snapshot) {
        const uploadTask = thisDb.storage.ref().child(path).put(file)//.put(file, metadata);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
          function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, function(error) {
        
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
        case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break;
            case 'storage/canceled':
              // User canceled the upload
              break;
            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        }, function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            thisDb.setPath(infoPath, downloadURL)
            console.log('File available at', downloadURL);
          });
        });
      });
    });
  }
  loadPath = (path, callback) => {
    this.db.ref(_.castArray(path).join('/')).once('value', s => (callback(s.val())))
  }
  load = (table,callback) => (
    this.db.ref(table).on('value', s => (callback(s.val())))
  )
  loadRecord = (table,id,callback) => {
    return this.db.ref(`${table}/${id}`).on('value', s => (callback(s.val())))
  }
  set = (table,values,callback) => {
    return this.db.ref(table).set(values,callback)
  }
  setRecord = (table,id,values,callback) => {
    return this.db.ref(`${table}/${id}`).set(values,callback)
  }
  setAttr = (table,id,attr,values,callback) => {
    return this.db.ref(`${table}/${id}/${attr}`).set(values,callback)
  }
  setPath = (path,values,callback) => {
    return this.db.ref(_.castArray(path).join('/')).set(values,callback)
  }
  deleteRecord = (table,id) => {
    return this.db.ref(`${table}/${id}`).remove()
  }
  delete = (path) => {
    console.log(`Firebase: deleting path=${path}`);
    return this.db.ref(_.castArray(path).join('/')).remove()
  }
  update = (path, updates) => {
    return this.db.ref(_.castArray(path).join('/')).update(updates)
  }

  /*
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
  */
}

export default Firebase;
