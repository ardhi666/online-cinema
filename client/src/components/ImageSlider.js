import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap'
import { API } from '../config/api'
import Deadpool from '../assets/img/jumbotron.png'

const ImageSlider = () => {

    const [films, setFilms] = useState([])

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const getFilms = async () => {
        try {
            const response = await API.get('/films')
            setFilms(response.data.data.book)
        } catch (error) {
            console.log(error);
        }
    }

    console.log(films);

    useEffect(() => {
        getFilms();
    }, []);

    return (
        <div>
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={Deadpool}
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>Cinema Online</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default ImageSlider