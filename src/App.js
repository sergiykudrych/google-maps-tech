import React, { useEffect, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { remove, ref, database } from './firebaseConfig';
import { getBrowserLocation } from './utils/geo';
// components
import Map from './components/Map/Map';

// styles
import './App.css';

// variables
const API_KEY = process.env.REACT_APP_API_KEY;
const libraries = ['places'];
const defaultCenter = {
  lat: -1.745,
  lng: -38.523,
};

const App = () => {
  const [count, setCount] = useState(0);
  const [center, setCenter] = useState(defaultCenter);
  const [markers, setMarkers] = useState([]);
  const message = useRef();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: libraries,
  });

  // Функція видалення маркерів з Firebase
  const clear = () => {
    setMarkers([]);
    setCount(0);
    clearDatabase();
  };
  const clearDatabase = () => {
    const questsRef = ref(database, 'quests');
    remove(questsRef)
      .then(() => {
        message.current.textContent = 'Всі маркери з Firebase видалені';
        message.current.className += ` active`;
        setTimeout(() => {
          message.current.className = 'message';
        }, 1500);
      })
      .catch((error) => {
        message.current.textContent = 'Помилка при видалені маркерів з Firebase';
        message.current.className += ` active`;
        setTimeout(() => {
          message.current.className = 'message';
        }, 1500);
        console.error('Помилка при видалені маркерів з Firebase:', error);
      });
  };

  // При завантаженні сторінки виконується функція яка отримує місцезнаходження користувача та показує на мапі
  useEffect(() => {
    getBrowserLocation()
      .then((location) => {
        setCenter({ lat: location.lat, lng: location.lng });
      })
      .catch((defaultCenter) => {
        setCenter(defaultCenter);
      });
  }, []);

  return (
    <div className="App">
      <button onClick={clear} className="clearButton">
        Clear markers
      </button>
      <p ref={message} className="message"></p>
      {!isLoaded ? (
        <div>Loading...</div>
      ) : (
        <Map center={center} markers={markers} setCount={setCount} count={count} setMarkers={setMarkers} message={message} />
      )}
    </div>
  );
};

export default App;
