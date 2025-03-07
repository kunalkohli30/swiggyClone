import React, { useEffect, useRef, useState } from "react";
import {
    AdvancedMarker,
    APIProvider,
    ControlPosition,
    Map,
    MapControl,
    useAdvancedMarkerRef,
    useApiLoadingStatus,
    useMap,
    useMapsLibrary,
    APILoadingStatus,
} from "@vis.gl/react-google-maps";
import { MdErrorOutline } from "react-icons/md";

type iProps = {
    selectedPosition: {
        lat: number;
        lng: number;
    },
    setSelectedPosition: React.Dispatch<React.SetStateAction<{
        lat: number;
        lng: number;
    }>>,
    userAdrString: string, 
    setUserAdrString: React.Dispatch<React.SetStateAction<string>>,
    locationInValid: boolean | undefined, 
    setLocationInValid: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

const GoogleMaps = ({ selectedPosition, setSelectedPosition, userAdrString, setUserAdrString, locationInValid, setLocationInValid }: iProps) => {
    const status = useApiLoadingStatus();
    const center = { lat: 28.649835, lng: 77.124298 };

    const [markerRef, marker] = useAdvancedMarkerRef();

    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

    const geocoder = useRef(null);

    // Load Google Maps geocoding service
    const maps = useMapsLibrary("places");

    useEffect(() => { getAddress(selectedPosition); }, [selectedPosition]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setSelectedPosition({ lat: latitude, lng: longitude });
            },
            (error) => {
                console.error("Error getting user location:", error);
            }
        )
        if (maps) {
            geocoder.current = new google.maps.Geocoder();
        }
    }, [maps]);

    // Function to handle map click
    const handleMapClick = async (event) => {
        const newPosition: { lat: number, lng: number } = {
            lat: event.detail.latLng.lat,
            lng: event.detail.latLng.lng,
        };

        setSelectedPosition(newPosition);
    };

    const getAddress = (newPosition: { lat: number, lng: number }) => {
        if (geocoder.current) {
            geocoder.current.geocode({ location: newPosition }, (results, status) => {
                if (status === "OK" && results[0]) {
                    // setSelectedPlace(results[0]); // ✅ Fix: Properly set the selectedPlace
                    setLocationInValid(false); // Mark location as valid
                    setUserAdrString(results[0]?.formatted_address);

                } else {
                    setLocationInValid(true);
                }
            });
        }
    }

    return status === APILoadingStatus.LOADED ? (
        <div className="flex flex-col">
            <PlaceAutocomplete
                onPlaceSelect={setSelectedPlace}
                locationInValid={locationInValid}
                setLocationInValid={setLocationInValid}
                userAdrString={userAdrString}
                setUserAdrString={setUserAdrString}
            />
            <Map
                defaultZoom={13}
                defaultCenter={center}
                style={{ width: "300px", height: "200px" }}
                disableDefaultUI={true}
                zoomControl={true}
                mapId="74951705c9e448c3"
                onClick={handleMapClick} // ✅ Fix: Ensure map click updates location
            >
                {selectedPosition && <AdvancedMarker position={selectedPosition} ref={markerRef} />}
            </Map>
            <MapControl position={ControlPosition.BLOCK_START_INLINE_CENTER}>
                <div className="autocomplete-control"></div>
            </MapControl>
            <MapHandler place={selectedPlace} marker={marker} />
        </div>
    ) : (
        "Loading"
    );
};

// Updates the map when a place is selected
const MapHandler = ({ place, marker }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !place || !marker) return;

        if (place.geometry?.viewport) {
            map.fitBounds(place.geometry.viewport);
        }
        marker.position = place.geometry?.location;
    }, [map, place, marker]);

    return null;
};

// Autocomplete input for searching addresses
const PlaceAutocomplete = ({ onPlaceSelect, locationInValid, setLocationInValid, userAdrString, setUserAdrString }) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const places = useMapsLibrary("places");

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ["geometry", "name", "formatted_address"],
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener("place_changed", () => {
            const place = placeAutocomplete.getPlace();
            onPlaceSelect(place);
            setLocationInValid(false); // Mark location as valid
        });
    }, [onPlaceSelect, placeAutocomplete]);


    return (
        <div className="mb-1 w-[300px] relative">
            <input
                ref={inputRef}
                value={userAdrString}
                id="address"
                placeholder="Search for an address..."
                onChange={e => setUserAdrString(e.target.value)}
                className="peer w-full border text-sm font-semibold font-cabin border-gray-300 rounded-lg px-2 py-3 focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none"
            />
            {locationInValid && (
                <div className="flex my-2 gap-3 w-full items-center">
                    <MdErrorOutline className="text-red-400 text-xl" />
                    <p className="text-xs font-semibold text-red-400">Please select a location from the suggestions!</p>
                </div>
            )}
        </div>
    );
};

export default GoogleMaps;
