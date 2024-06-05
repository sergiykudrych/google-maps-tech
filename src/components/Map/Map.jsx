import React, { useCallback, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { database, ref, set, update } from '../../firebaseConfig';

// styles
import s from './Map.module.css';
const containerStyle = {
  width: '100%',
  height: '100%',
};

const Map = ({ center, markers, setCount, count, setMarkers, message }) => {
  // Ініціалізація мапи
  const mapRef = useRef(undefined);
  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    mapRef.current = undefined;
  }, []);
  // Функція додавання маркера та запису даних в Firebase
  const onClick = (loc) => {
    const lat = loc.latLng.lat();
    const lng = loc.latLng.lng();
    const time = new Date().toLocaleTimeString();
    const markerId = `Quest${count + 1}`;
    const questData = {
      name: markerId,
      location: { lat, lng },
      timestamp: time,
    };
    set(ref(database, `quests/${markerId}`), questData)
      .then(() => {
        setMarkers((prevMarkers) => [...prevMarkers, { id: markerId, lat, lng, number: count + 1 }]);
        setCount(count + 1);
        message.current.textContent = `Quest ${count + 1} доданий до Firebase з ${markerId}.`;
        message.current.className += ` active`;
        setTimeout(() => {
          message.current.className = 'message';
        }, 1500);
      })
      .catch((error) => {
        message.current.textContent = `Помилка при додавання маркера ${markerId} до Firebase.`;
        message.current.className += ` active`;
        setTimeout(() => {
          message.current.className = 'message';
        }, 1500);
        console.error(`Помилка при додавання маркера ${markerId} до Firebase.`, error);
      });
  };

  // Функція для переміщення маркера та зміни його даних в Firebase
  const onDragEnd = useCallback(
    (event, index) => {
      const newMarkers = markers.map((marker, i) => {
        if (i === index) {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          // Обновление данных в Firebase
          const markerRef = ref(database, `quests/${marker.id}`);
          const time = new Date().toLocaleTimeString();
          update(markerRef, {
            location: { lat: newLat, lng: newLng },
            timestamp: time,
          })
            .then(() => {
              message.current.textContent = `Маркер ${marker.id}  оновлений у Firebase.`;
              message.current.className += ` active`;
              setTimeout(() => {
                message.current.className = 'message';
              }, 1500);
            })
            .catch((error) => {
              message.current.textContent = `Помилка при оновленні маркера ${marker.id}`;
              message.current.className += ` active`;
              setTimeout(() => {
                message.current.className = 'message';
              }, 1500);
              console.error('Error updating marker in Firebase:', error);
            });
          return {
            ...marker,
            lat: newLat,
            lng: newLng,
          };
        }
        return marker;
      });
      setMarkers(newMarkers);
    },
    [markers, setMarkers, message]
  );
  return (
    <div className={s.container}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={onLoad} onUnmount={onUnmount} onClick={onClick}>
        <Marker position={center} label={{ text: 'Ви тут', color: 'white' }} />
        {markers.map((info, index) => (
          <Marker
            key={info.id}
            position={{ lat: info.lat, lng: info.lng }}
            label={info.number.toString()}
            draggable={true}
            onDragEnd={(event) => onDragEnd(event, index)}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
