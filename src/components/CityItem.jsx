import { useContext } from "react";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { CitiesContext } from "../Contexts/CitiesContext";
function CityItem({ city }) {
  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      // weekday: "long",
    }).format(new Date(date));

  const { date, emoji, cityName, id, position } = city;
  const context = useContext(CitiesContext);
  const { currentCity,deleteCity } = context;

  function handelDelete(e){
    e.preventDefault()
    deleteCity(id)
    
  }
  // console.log(currentCity);
  return (
    <li>
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <p className={styles.name}>{cityName}</p>
        <span className={styles.date}>({formatDate(date)})</span>
        <button className={styles.deleteBtn} onClick={handelDelete}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;
