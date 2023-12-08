import { useContext } from "react";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
import { CitiesContext } from "../Contexts/CitiesContext";

function CityList() {
  const context = useContext(CitiesContext);
  const { cities, loading } = context;
  console.log(context);

  if (loading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Start your trips by clicking on cities in the map" />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
