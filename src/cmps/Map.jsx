import React, { useState } from 'react'
import GoogleMapReact from 'google-map-react'
// import logoUrl from '../assets/img/toys-favicon.png'

function Marker() {
  return (
    <div className="marker-img">
      <img src="https://res.cloudinary.com/dv2brrhll/image/upload/v1740000974/homebnb_vbpitn.svg" />
    </div>
  )
}

const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API

export function Map({loc}) {
  const [coordinates, setCoordinates] = useState(
    loc ? { lat: loc.lan, lng: loc.lat } : { lat: 40.782388, lng: -73.957528 }
  )
  const [zoom, setZoom] = useState(13)

  function handleClick({ lat, lng }) {
    setCoordinates({ lat, lng })
  }
  const branches = [
    {
      city: 'Haifa',
      id: 101,
      position: {
        lat: 50.816348,
        lng: 22.532209,
      },
    }
  ]

  return (
    <div className="map-container">
      <h1 className="map-header">Where you’ll be</h1>
      <div className="map" style={{ height: '50vh', width: '100%', borderRadius: '20px' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: API_KEY }}
          center={coordinates}
          zoom={zoom}
          onClick={handleClick}
        >
          <Marker
            lat={coordinates.lat}
            lng={coordinates.lng}
            key={branches[0].id}
          />
        </GoogleMapReact>
      </div>
    </div>
  )
}
