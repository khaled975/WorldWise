import { useContext } from "react";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
import { CitiesContext } from "../Contexts/CitiesContext";

// let arr = ["apple", "mango", "apple", "orange", "mango", "mango"];

// function removeDuplicates(arr) {
//   return arr.filter((item, index) => console.log(arr.indexOf(item) === index));
// }
// console.log(removeDuplicates(arr));

function CountryList() {
  const context = useContext(CitiesContext);
  const { cities, loading } = context;
  if (loading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Start your trips by clicking on cities in the map" />
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  console.log(countries);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
