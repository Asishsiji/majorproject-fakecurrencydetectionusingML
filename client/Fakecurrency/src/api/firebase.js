import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

	apiKey: "AIzaSyCwpZAGJgBRdYpuYxD7OhhJr991uQcEEKc",
	authDomain: "database-9c6e7.firebaseapp.com",
	databaseURL: "https://database-9c6e7-default-rtdb.firebaseio.com",
	projectId: "database-9c6e7",
	storageBucket: "database-9c6e7.appspot.com",
	messagingSenderId: "611959586768",
	appId: "1:611959586768:web:9ea5419d0f065135a0c3d5",
	measurementId: "G-FV8W446VEK"


};


const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const storage = getStorage(app)

export { database, storage };
