import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

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
    this.db.ref(`${table}/${id}`).on('value', s => (callback(s.val())))
  }
  set = (table,values) => {
    this.db.ref(table).set(values)
  }



  loadTables = callback => (
    this.tables().on('value', s => (callback(s.val())))
  )
  loadDefs = callback => (
    this.tableDefs().on('value', s => (callback(s.val())))
  )
  loadTableDefs = callback => ( // DEPRECATED
    this.tableDefs().on('value', s => (callback(s.val())))
  )

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** tmp for testing ***
  
  get_db = () => this.db

  // *** Tables API ***
  
  tables = () => this.db.ref('tables');
  table = name => this.db.ref(`tables/${name}`);
  tableRow = (name, row) => this.db.ref(`tables/${name}/${row}`);

  tableDefs = () => this.db.ref('tableDefs');
  tableDefs2 = () => this.db.ref('tableDefs2');

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');
}

export default Firebase;
