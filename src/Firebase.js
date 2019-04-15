import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
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
    }
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
