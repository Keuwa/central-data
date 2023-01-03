import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials)
  // firebase
  //   .auth()
  //   .setPersistence(firebase.auth.Auth.Persistence.SESSION)

  if (process.env.NODE_ENV === 'development') {
    firebase.firestore().useEmulator('localhost', 8081)
    firebase.auth().useEmulator('http://localhost:9099')
    firebase.storage().useEmulator('localhost', 9199)
  }
}

export default firebase

export const firestore = firebase.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage()