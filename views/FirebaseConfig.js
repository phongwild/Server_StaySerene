import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js"
const firebaseConfig = {
    apiKey: "AIzaSyA86vacmGFN8Fg1CaMqshjgL1krNFjeaKk",
    authDomain: "stayserene-f36b5.firebaseapp.com",
    databaseURL: "https://stayserene-f36b5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stayserene-f36b5",
    storageBucket: "stayserene-f36b5.appspot.com",
    messagingSenderId: "1082178476167",
    appId: "1:1082178476167:web:c6aee2f3162c2aa3f90022"
};
const APP = initializeApp(firebaseConfig);
const STORAGE = getStorage(APP);
export { STORAGE, ref, uploadBytes, getDownloadURL };