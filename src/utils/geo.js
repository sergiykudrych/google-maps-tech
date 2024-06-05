const defaultCenter = {
  lat: -1.745,
  lng: -38.523,
};

export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => reject(defaultCenter)
      );
    } else {
      reject(defaultCenter);
    }
  });
};
