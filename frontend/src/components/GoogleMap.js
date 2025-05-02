import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

console.log("Google Maps API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
const containerStyle = {
  width: '50%',
  height: '200px',
};

const center = {
  lat: 52.41806,  
  lng: -4.06576, 
};

function GoogleMapComponent() {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(GoogleMapComponent);
