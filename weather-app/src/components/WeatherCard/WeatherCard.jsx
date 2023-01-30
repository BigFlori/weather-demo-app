import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SpacerDot from "../UI/SpacerDot";
import classes from "./WeatherCard.module.css";
import { Collapse } from "react-collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowsRotate,
  faTrash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import useHttp from "../../hooks/use-http";
import ShowMore from "../UI/ShowMore";

const formatTime = (date) => {
  let time = "";
  //Az óránál mindig egyel többet ad vissza ezért a 0 óra = 23 órával
  if (date.getHours() == 0) {
    time += "23";
  } else {
    time += date.getHours() - 1;
  }
  time += ":";
  time += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  return time;
};

const formatDate = (date) => {
  let dateStr = "";
  dateStr +=
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  dateStr += "/";
  dateStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return dateStr;
};

const WeatherCard = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [disappearing, setDisappearing] = useState(false);
  const [appearing, setAppearing] = useState(true);

  const { city, lat, lon } = props.cityData;

  const [weatherData, setWeatherData] = useState({
    temperature: 0.0,
    feels_like: 0.0,
    humidity: 0,
    wind_speed: 0.0,
    country: "",
    sunrise: 0,
    sunset: 0,
    dt: 0,
    timezone: 0,
    name: "",
  });

  const { isLoading, error, sendRequest: fetchWeather } = useHttp();

  useEffect(() => {
    fetchWeather(
      {
        // url: `http://localhost:8000/weather?lat=${lat}&lon=${lon}`,
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_KEY}&lang=hu`,
      },
      (data) => {
        // console.log(data);
        const weather = {
          temperature: Math.round(data.main.temp - 272.15), //Kelvinből celsiusba
          feels_like: Math.round(data.main.feels_like - 272.15),
          humidity: data.main.humidity,
          wind_speed: data.wind.speed,
          country: data.sys.country,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          dt: data.dt,
          timezone: data.timezone,
          iconid: data.weather[0].icon,
          description: data.weather[0].description,
        };
        setWeatherData(weather);
      }
    );
  }, [city, lat, lon]);

  let date = new Date((weatherData.dt + weatherData.timezone) * 1000);
  let sunriseDate = new Date(
    (weatherData.sunrise + weatherData.timezone) * 1000
  );
  let sunsetDate = new Date((weatherData.sunset + weatherData.timezone) * 1000);

  const collapseHandler = () => {
    if (props.collapsible) setCollapsed((prevState) => !prevState);
  };
  useEffect(() => {
    setTimeout(() => {
      setAppearing(false);
    }, 500);
  }, [appearing]);

  const removeCityHandler = () => {
    setDisappearing(true);
    setTimeout(() => {
      setDisappearing(false);
      props.onRemoveCity(city);
    }, 500);
  };

  return (
    <div className={`${!props.saved && "mx-auto"} ${classes.container}`}>
      <div
        className={`px-4 pt-4 pb-2 ${classes.card} ${
          disappearing && classes.disappear
        } ${appearing && classes.appear}`}
      >
        <div id='card-content' className='d-flex justify-content-between'>
          <section>
            <div className='d-flex gap-2 mb-2'>
              <img
                src={`https://flagsapi.com/${weatherData.country}/flat/32.png`}
                alt={`${weatherData.country} ország zászlaja`}
              />
              <h5>{city}</h5>
            </div>
            <h6>
              {formatTime(date)}
              <SpacerDot />
              {formatDate(date)}
            </h6>
            <h2>{weatherData.temperature}&deg;C</h2>
          </section>
          <section>
            <div className='d-flex gap-1 justify-content-end'>
              {!props.saved ? (
                <button
                  onClick={props.onSaveCity}
                  className={classes.control_btn}
                >
                  <FontAwesomeIcon icon={faPlus} size='lg' />
                </button>
              ) : (
                <button
                  className={classes.control_btn}
                  onClick={removeCityHandler}
                >
                  <FontAwesomeIcon icon={faTrash} size='lg' />
                </button>
              )}
              <button
                className={classes.control_btn}
                onClick={() => fetchWeather()}
              >
                <FontAwesomeIcon
                  icon={faArrowsRotate}
                  size='lg'
                  spin={isLoading}
                />
              </button>
            </div>
            <div className='d-flex flex-column mb-2'>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.iconid}@2x.png`}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
              <span className='text-center'>{weatherData.description}</span>
            </div>
          </section>
        </div>
        <Collapse isOpened={collapsed || !props.collapsible}>
          <section className='m-2'>
            <div className='d-flex justify-content-between'>
              <span>Hőérzet:</span>
              <span>{weatherData.feels_like}&deg;C</span>
            </div>
            <div className='d-flex justify-content-between'>
              <span>Páratartalom:</span>
              <span>{weatherData.humidity}%</span>
            </div>
            <div className='d-flex justify-content-between'>
              <span>Szélerősség:</span>
              <span>{weatherData.wind_speed}m/s</span>
            </div>
            <div className='d-flex justify-content-between'>
              <span>Napkelte:</span>
              <span>{formatTime(sunriseDate)}</span>
            </div>
            <div className='d-flex justify-content-between'>
              <span>Napnyugta:</span>
              <span>{formatTime(sunsetDate)}</span>
            </div>
          </section>
        </Collapse>
        {props.collapsible && (
          <div className='d-flex justify-content-center'>
            <ShowMore collapsed={collapsed} onCollapse={collapseHandler} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
