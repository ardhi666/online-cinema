import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Navigation from '../components/Navigation'
import { API } from "../config/api";
import Deadpool from '../assets/img/jumbotron.png'
import ImageSlider from '../components/ImageSlider';

const Home = () => {

  const [films, setFilms] = useState([])

  const getFilms = async () => {
    try {
      const response = await API.get('/films')
      setFilms(response.data.data.book)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFilms();
  }, []);

  return (
    <div>
      <Navigation />
      <div className="container">
        <div style={{marginLeft:"80px"}} className="top">
        <ImageSlider/>
        </div>
        <div className="bot">
          <div className="title">
            <h2>List Film</h2>
          </div>
          <div className="list-film">
            {films?.map((item, index) => {
              return (
                <div key={index} className="card" >
                  <Link to={'/detail/' + item?.id}><div className="img"> <img src={item?.thumbnail} alt="Spiderman" /></div></Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home