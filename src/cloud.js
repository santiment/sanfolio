import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyCgj-DuTmzKEvGUKMnceF38htGUcSGA850',
  authDomain: 'cryptofolio-15d92.firebaseapp.com',
  databaseURL: 'https://cryptofolio-15d92.firebaseio.com',
  projectId: 'cryptofolio-15d92',
  storageBucket: '',
  messagingSenderId: '538647365407'
}

firebase.initializeApp(config)
export const cloud = firebase
export const db = firebase.database()
export default firebase
