import { createContext, useEffect, useReducer, useState } from "react";
const BASE_URL = "http://localhost:8000";

const CitiesContext = createContext();


const initialState={
  cities:[],
  loading:false,
  currentCity:{},
}
function Reducer (state,action){
  switch (action.type) {
    case 'loading':
      return{...state,loading:true}
    case 'cities/loaded':
      return{...state,loading:false,cities:action.payload}
    case 'city/created':
      return{...state,loading:false,cities:[...state.cities,action.payload]}
    case 'city/deleted':
      return {...state,loading:false,cities:state.cities.filter(city=>city.id !==action.payload)}
    case 'currentCity':
      return {...state,loading:false,currentCity:action.payload}
    case 'rejected':
      return{...state,loading:false,error:action.payload}
  default:
      throw new Error('UNKNOWN ACTION')
  }
}




function CitiesProvider({ children }) {
  // const [cities, setCities] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
 
 const [{cities,loading,currentCity},dispatch] = useReducer(Reducer,initialState)

  useEffect(() => {
    async function getCities() {
      try {
        dispatch({type:'loading'})
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({type:'cities/loaded',payload:data})
      } catch (error) {
        dispatch({type:'rejected',payload:error.message})
      } 
    }
    getCities();
  }, []);

  async function getCurrentCity(id) {
    try {
      dispatch({type:'loading'})
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({type:'currentCity',payload:data})
    } catch (error) {
      dispatch({type:'rejected',payload:error.message})
    } 
  }
  async function createCity(newCity) {
    try {
      dispatch({type:'loading'})
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      dispatch({type:'city/created',payload:data})
    } catch (error) {
      dispatch({type:'rejected',payload:error.message})    } 
  }
  async function deleteCity(id) {
    try {
      dispatch({type:'loading'})
       await fetch(`${BASE_URL}/cities/${id}`,{method:'DELETE'});
       dispatch({type:'city/deleted',payload:id})
    } catch (error) {
      dispatch({type:'rejected',payload:error.message})    } 
  }

  return (
    <CitiesContext.Provider
      value={{ cities, loading, getCurrentCity, currentCity, createCity,deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
