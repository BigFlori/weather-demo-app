import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import useHttp from "../../hooks/use-http";
import classes from "./CityInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const ENDPOINT = "https://geocode.maps.co/search?q=";

const CityInput = (props) => {
  const [city, setCity] = useState("");
  const [validation, setValidation] = useState({ isValid: true, errorMsg: "" });
  const { isLoading, error, sendRequest: fetchCityCoordinates } = useHttp();

  const searchHandler = useCallback(() => {
    if (city.trim() === "") {
      setValidation({ isValid: false, errorMsg: "Add meg a helység nevét." });
      return;
    }

    fetchCityCoordinates({ url: ENDPOINT + city }, (data) => {
      if (data.length > 1) {
        //Város koordináta
        let displayName = data[0].display_name;
        let actualCityName = displayName.slice(0, displayName.indexOf(","));
        props.onCityDataChange({
          lat: data[0].lat,
          lon: data[0].lon,
          city: actualCityName,
        });
      } else {
        //Nem található város
        setValidation({
          isValid: false,
          errorMsg: "Nem található ez a helység.",
        });
      }
    });
  }, [city, fetchCityCoordinates, ENDPOINT]);

  const cityChangeHandler = (event) => {
    if (city.trim() !== "" && !validation.isValid) {
      setValidation({ isValid: true, errorMsg: "" });
    }
    setCity(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchHandler();
    }
  };

  return (
    <Container className='my-5'>
      <Row>
        <Col xs={12} className={`mx-auto ${classes.container}`}>
          <InputGroup size='md' hasValidation>
            <Form.Control
              required
              isInvalid={!validation.isValid}
              type='text'
              placeholder='Helység'
              aria-label='Large'
              aria-describedby='inputGroup-sizing-sm'
              className='shadow-none'
              value={city}
              onChange={cityChangeHandler}
              onKeyDown={handleKeyPress}
            />
            <Button size='md' onClick={searchHandler} className='px-3'>
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              )}
            </Button>
            <Form.Control.Feedback type='invalid'>
              {validation.errorMsg}
            </Form.Control.Feedback>
          </InputGroup>
          <div className={`d-flex justify-content-end text-muted h8`}>
            <a href='https://www.openstreetmap.org/copyright' target='_blank'>
              powered by OpenStreetMap
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CityInput;
