// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useContext, useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import Message from "./Message";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useUrlLocation } from "../hooks/useUrlLocation";
import DatePicker from "react-datepicker";
// CSS FOR DATE_PICKER PACKAGE
import "react-datepicker/dist/react-datepicker.css";
import { CitiesContext } from "../Contexts/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client?";
function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [error, setError] = useState("");
  // GET QUERY DATA FROM URL
  const [lat, lng] = useUrlLocation();
  const navigate = useNavigate();

  const context = useContext(CitiesContext);
  const { createCity } = context;

  useEffect(() => {
    async function getSelectedCityData() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`${BASE_URL}latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode)
          throw new Error(
            "That doesn't seem to be city, please click somewhere else "
          );
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getSelectedCityData();
  }, [lat, lng]);

  async function handelSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      date,
      notes,
      emoji,
      position: { lat, lng },
    };
    console.log(newCity);
    await createCity(newCity);
    navigate("/app/cities");
  }

  // ALL CONDITIONS
  // ====>> 1 >> IF USER GO TO FORM DIRECTLY
  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;

  // ====>> 2 >> IF THERE NO COUNTRY FOUND
  if (error) return <Message message={error} />;

  // ====>> 3 >> loading
  if (isLoading) return <Spinner />;

  return (
    <form className={styles.form} onSubmit={handelSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          onChange={(date) => setDate(date)}
          selected={date}
          id="date"
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
