"use client";
import React from "react";
import { MapContainer,TileLayer,Marker,Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import eventsData from "../historyEvents";
import { useState } from "react";
import FlyToMarker from "./FlyToMarker";
import Filter from "./Filter";

const defaultPosition:[number,number] = [51.505,-0.09];

const emptyStar = <i className="fa-regular fa-star"></i>
const fullStar = (<i className="fa-solid fa-star" style={{
    color: "#fdc401",
}}></i>)

export interface HistoricalEvent{
    id:number;
    title:string;
    description:string;
    position:[number,number];
    category:string;
}

function MapsApp() {

    const icon:Icon = new Icon({
        iconUrl:"marker.svg",
        iconSize:[25,41],
        iconAnchor:[12,41],
    })

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [activeEvent, setActiveEvent] = useState<HistoricalEvent | null>(null);

    const [favourites,setFavourites] = useState<number[]>(() => {
        const savedFavourites = localStorage.getItem('favourites');

        return savedFavourites ? JSON.parse(savedFavourites) : [];
    });

   const handleFavouritesClick = (eventId: number) =>{
    let updatedFavourites = favourites.filter((id)=> id !==eventId);
    if(!favourites.includes(eventId)){
        updatedFavourites = [eventId,...updatedFavourites];
   }
   setFavourites(updatedFavourites);
   localStorage.setItem("favourites",JSON.stringify(updatedFavourites));
}

const handleListItemClick = (eventId:number)=>{
    //find by id
    const event = eventsData.find((event)=> event.id === eventId);
    if(event){
        //set the active to open the popup
        setActiveEvent(event);
    }
}


  return (
    <div className="content">
      <div className="map-content flex flex-col gap-6  h-full">
        <Filter setSelectedCategory={setSelectedCategory} />
        <div className="map-container leaflet-container leaflet-touch leaflet-fade-anim leaflet-grab leaflet-touch-drag leaflet-touch-zoom">
        <MapContainer
        center={defaultPosition} 
        zoom={13} 
        className="map-container" >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        
        
        
        {
            eventsData.filter((event)=>!selectedCategory || event.category === selectedCategory).map((event) => {
                return(
                    <Marker key={event.id} position={event.position} icon={icon} eventHandlers={{
                        click: () => {
                            setActiveEvent(event);
                        },
                    }}/>
            );
        })} 

          {activeEvent && (
                <Popup position={activeEvent.position}>
                <div className="popup-inner">
                    <h2 className="popup-inner_title">
                        {activeEvent.title}
                    </h2>
                    <p className="popup-innner_desciption">
                        {activeEvent.description}
                    </p>
                    <button className="popup-inner_button"
                    onClick={()=> handleFavouritesClick(activeEvent.id)}
                    >
                        {
                            favourites.includes(activeEvent.id) ? <span>{fullStar} Unfavourite</span> : 
                            (
                                <span>{emptyStar}Favourite</span>
                            )
                        }
                        </button>
                </div>
              </Popup>
          )}

          {
            activeEvent && ( <FlyToMarker position = {activeEvent.position} zoomLevel={15}/>
            )}
        </MapContainer></div>
      </div>
      <div className="liked-events">
        <h2 className="liked-events_title">
            <i className="fa-solid fa-star"></i> Favourite Events
        </h2>
        <ul>
            {
                favourites.map((id)=>{
                    return eventsData.find((event)=>event.id === id);
                })
                .map((event)=>{
                    return(
                        <li className="liked-events_event" key={event?.id} onClick={()=>{
                            handleListItemClick(event.id);
                        }}>
                        <h3>{event?.title}</h3>
                        </li>
                );
                })
            }
        </ul>
      </div>
    </div>
  )
}

export default MapsApp