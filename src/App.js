import { useEffect, useState } from "react";
import Auth from "./components/Auth/Auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

export default function App() {
  const [movies, setMovies] = useState([]);

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState(0);
  const [newMovieHaveOscar, setNewMovieHaveOscar] = useState(false);

  const [updatedTitle, setUpdateTitle] = useState("");

  const [imageUpload, setImageUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovies = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovies(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMovies();
    } catch (error) {
      console.error(error);
    }
  };

  const updateMovieTitle = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: updatedTitle });
      getMovies();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMovies();
    // eslint-disable-next-line
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        realeseDate: newMovieReleaseDate,
        receivedAnOscar: newMovieHaveOscar,
        userId: auth?.currentUser?.uid,
      });
      getMovies();
    } catch (error) {
      console.error(error);
    }
  };

  const fileUpload = async () => {
    try {
      if (!imageUpload) return;
      const fileFolderRef = ref(storage, `/projectFolder/${imageUpload.name}`);
      await uploadBytes(fileFolderRef, imageUpload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Auth />
      <div>
        <input
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release date..."
          type="number"
          onChange={(e) => setNewMovieReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={newMovieHaveOscar}
          onChange={(e) => setNewMovieHaveOscar(e.target.checked)}
        />
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit movie</button>
      </div>

      <div>
        {movies.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {" "}
              {movie.title}{" "}
            </h1>
            <p> Date: {movie.realeseDate} </p>
            <button onClick={() => deleteMovie(movie.id)}>Delete movie</button>

            <input
              placeholder="New movie title..."
              onChange={(e) => setUpdateTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update title
            </button>
          </div>
        ))}
        <div>
          <input
            type="file"
            onChange={(e) => setImageUpload(e.target.files[0])}
            onClick={fileUpload}
          />
        </div>
      </div>
    </div>
  );
}
