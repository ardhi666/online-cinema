import React, { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import { API } from '../config/api'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const MyFilm = () => {

    const [myFilm, setmyFilm] = useState([])
    // const film = useSelector(selectFilm)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    let navigate = useNavigate()

    const getMyFilm = async () => {
        try {
            const response = await API.get('/my-transactions')
            setmyFilm(response.data.data.transactions);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMyFilm();
    }, [myFilm]);

    const onclickFilm = (item) => {
        if (item.status === 'Approved') {
            navigate(`/detail/${item.idFilm}`)
        }else{
            setShow(true)
        }
    }

    return (
        <div>
            <Navigation />
            <div className="my-film">
                <div className="container">
                    <div className="title">
                        <h2>My List Film</h2>
                    </div>
                    <div className="wrapper">
                        {myFilm?.map((item, index) => {
                            return (
                                <div key={index} className="card" >
                                    <div onClick={() => {
                                        onclickFilm(item);
                                    }} className="img"> <img src={`http://localhost:5000/uploads/${item.film.thumbnail}`} alt="Spiderman" /></div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Modal style={{ position: "absolute", paddingTop: "300px" }} show={show} onHide={handleClose}>
            <Modal.Body style={{ color: "#469F74", textAlign: "center", fontSize: '18px' }}>Thank you for buying this film, please wait 1x24 hours because your transaction is in process</Modal.Body>
            </Modal>
            </div>
        </div>
    )
}

export default MyFilm