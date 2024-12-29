import React, { useEffect, useRef, useState } from 'react'
import {
    AdvancedMarker,
    APIProvider,
    ControlPosition,
    Map,
    MapCameraChangedEvent,
    MapControl,
    useAdvancedMarkerRef,
    useApiLoadingStatus,
    useMap,
    useMapsLibrary,
    APILoadingStatus
} from '@vis.gl/react-google-maps';
import { MdErrorOutline } from 'react-icons/md';

interface MapHandlerProps {
    place: google.maps.places.PlaceResult | null;
    marker: google.maps.marker.AdvancedMarkerElement | null;
}

interface PlaceAutocompleteProps {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void,
    locationInValid: boolean,
    setLocationInValid: React.Dispatch<React.SetStateAction<boolean | undefined>>
}

const GoogleMaps = ({ locationInValid, setLocationInValid, selectedPlace, setSelectedPlace }: {
    locationInValid: boolean | undefined,
    setLocationInValid: React.Dispatch<React.SetStateAction<boolean | undefined>>,
    selectedPlace: google.maps.places.PlaceResult | null,
    setSelectedPlace: React.Dispatch<React.SetStateAction<google.maps.places.PlaceResult | null>>
}) => {


    const status = useApiLoadingStatus();

    const center = { lat: 28.649835, lng: 77.124298 };

    const [markerRef, marker] = useAdvancedMarkerRef();

    // console.log('status', status);
    return status === APILoadingStatus.LOADED ? (

        <div className='flex flex-col'>

            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} locationInValid={locationInValid} setLocationInValid={setLocationInValid} />
            <Map
                defaultZoom={13}
                defaultCenter={center}
                // onCameraChanged={(ev: MapCameraChangedEvent) =>
                //     console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                // }
                style={{ width: '300px', height: '200px' }}
                mapTypeControlOptions={{
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.BOTTOM_LEFT,
                    mapTypeIds: [

                    ]
                }} // here´s the array of controls
                disableDefaultUI={true} // a way to quickly hide all controls
                mapTypeControl={true}
                scaleControl={true}
                zoomControl={true}
                mapId={"74951705c9e448c3"}
            >
                <AdvancedMarker position={null} ref={markerRef} />
            </Map>
            <MapControl position={ControlPosition.BLOCK_START_INLINE_CENTER}>
                <div className="autocomplete-control">
                </div>
            </MapControl>
            <MapHandler place={selectedPlace} marker={marker} />
        </div >

    )
        : "Loading"
}

const MapHandler = ({ place, marker }: MapHandlerProps) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !place || !marker) return;

        if (place.geometry?.viewport) {
            map.fitBounds(place.geometry?.viewport);
        }
        marker.position = place.geometry?.location;
    }, [map, place, marker]);

    return null;
};

const PlaceAutocomplete = ({ onPlaceSelect, locationInValid, setLocationInValid }: PlaceAutocompleteProps) => {

    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');

    const [addressInputClicked, setAddressInputClicked] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('' as string | undefined);
    // const[locationInValid, setLocationInValid]  = useState(undefined as boolean | undefined);

    useEffect(() => {
        if (!places || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address']
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener('place_changed', () => {
            onPlaceSelect(placeAutocomplete.getPlace());
            console.log('place select', placeAutocomplete.getPlace())
            setSelectedAddress(placeAutocomplete?.getPlace()?.formatted_address)
        });
    }, [onPlaceSelect, placeAutocomplete]);

    const handleBlur = () => {
        console.log( inputRef.current?.value);
        setAddressInputClicked(false);
        if (!selectedAddress) {
            setLocationInValid(true);
        } else {
            setLocationInValid(false);
        }
    }

    return (
        <div
            className='mb-1 w-[300px] relative'
            onClick={() => setAddressInputClicked(true)}            //onChange and onBlur is dummy and only being used to trigger reload of value of inputRef.
            onBlur={handleBlur}            // inputRef.length decied whether the label for address be in full space or on top when address is present
        >
            <input
                ref={inputRef}
                id='address'
                placeholder=''
                onChange={() => { setLocationInValid(true); setSelectedAddress(undefined) }}
                className="peer w-full border text-lg border-gray-300 rounded-lg px-2 pt-4 pb-[6px] focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none"
            />
            {/* Placeholder */}
            <label
                htmlFor='address'
                className={` absolute left-2 top-4 text-gray-500 transition-all  font-roboto
                    peer-focus-within:top-[2px] peer-focus-within:text-gray-700 peer-focus-within:text-xs peer-focus-within:text-bold 
                    ${inputRef.current?.value?.length > 0 ? 'top-[2px] text-gray-700 text-xs text-bold' : ''}`}

            >
                Address
            </label>
            {locationInValid &&
                <div className='flex my-2 gap-3 w-full items-center'>
                    <MdErrorOutline className='text-red-400 text-xl' />
                    <p className='text-xs font-semibold text-red-400 '>
                        Please select a location from the suggestions!!
                    </p>
                </div>
                // <p className='text-red-800 text-xs text-nowrap'>Please select a location from the suggestions!!</p>
            }
        </div>
    );
};


export default GoogleMaps