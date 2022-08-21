import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Navigation from '../components/Navigation'
import { API } from "../config/api";
import Deadpool from '../assets/img/jumbotron.png'

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
        <div style={{ marginLeft: "80px" }} className="top">
          <img src={Deadpool} alt="img" />
        </div>
        <div className="board-text">
          <div className="title">
            <h2><span style={{ color: "white" }}>Cinema</span> Online</h2>
          </div>
          <div className="desc"><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit iusto velit non veniam doloribus, odit eius laborum vel modi harum voluptatem ipsam quidem assumenda dolor perspiciatis quaerat est repudiandae qui eligendi quia amet aperiam, aliquam eos consectetur. Voluptate ratione provident molestiae totam eius velit optio eaque nesciunt ea incidunt rerum neque consequatur laborum, voluptatibus odio eum inventore, eos quos nostrum corporis iure libero! Sed iure magni odio perferendis, modi nihil soluta quos velit ipsam asperiores impedit. Asperiores voluptatibus nobis non?</p></div>
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