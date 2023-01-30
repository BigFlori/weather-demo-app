import { useCallback, useEffect, useState, useId } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CityInput from "./components/CityInput/CityInput";
import Navigation from "./components/Navigation/Navigation";
import WeatherCard from "./components/WeatherCard/WeatherCard";

function App() {
  const [cityData, setCityData] = useState({
    lat: 47.4979937,
    lon: 19.0403594,
    city: "Budapest",
  });

  const [savedCities, setSavedCities] = useState([]);

  const cityDataChangeHandler = (city) => {
    setCityData(city);
  };

  const addCityHandler = () => {
    setSavedCities((prevState) => {
      if (
        prevState.some((item) => item.city === cityData.city) ||
        prevState.length >= 3
      ) {
        return [...prevState];
      } else {
        return [...prevState, cityData];
      }
    });
  };

  const removeCityHandler = (city) => {
    setSavedCities((prevState) => {
      let filteredArray = prevState.filter(
        (item) => item.city !== city
      );
      return filteredArray;
    });
  };

  return (
    <div className='App'>
      <Navigation />
      <CityInput onCityDataChange={cityDataChangeHandler} />
      <Container>
        <WeatherCard cityData={cityData} onSaveCity={addCityHandler} />
      </Container>
      <Container className='mt-5 pb-10'>
        {savedCities.length > 0 && (
          <h5 className='text-dark text-uppercase text-center mb-5'>
            Mentett helységek
          </h5>
        )}
        <Row className='justify-content-center gap-5'>
          {savedCities.map((item, index) => (
            <WeatherCard
              cityData={item}
              key={index}
              onRemoveCity={removeCityHandler}
              collapsible
              saved
            />
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;
