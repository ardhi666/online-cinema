import React, { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import { Button, Modal } from 'react-bootstrap'
import { API } from "../config/api";
import { useNavigate, useParams } from 'react-router-dom';
import rupiahFormat from 'rupiah-format';
import Black from '../assets/img/black.jpg'
import Play from '../assets/img/play.png'
import { useMutation } from 'react-query';

const Detail = () => {
  

  let navigate = useNavigate()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  let { id } = useParams();
  const [film, setFilm] = useState([])
  const [category, setCategory] = useState()
  const [datas, setDatas] = useState()

  const getFilm = async () => {
    try {
      const response = await API.get('/film/' + id)
      // console.log(response.data.data.book.categories[0].name);
      setCategory(response.data.data.book.categories)
      setFilm(response.data.data.book)
    } catch (error) {
      console.log(error);
    }
  }

  const getMyFilm = async () => {
    try {
      const response = await API.get('/myFilm/' + id)
      console.log(response.data.films.film);
      setDatas(response.data.films.film);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(datas);

  useEffect(() => {
    getFilm();
    getMyFilm()
  }, []);

  const handleBuy = useMutation(async () => {
    try {
        // Get data from product
        const data = {
            idFilm: film?.id,
            idSeller: film?.idUser,
            price: film?.price,
        };
        
        // Insert transaction data
        const response = await API.post("/add-transaction",data);
        console.log(response);

        const token = response.data.payment.token;

        window.snap.pay(token, {
            onSuccess: function (result) {
                /* You may add your own implementation here */
                console.log(result);
                navigate("/profile");
            },
            onPending: function (result) {
                /* You may add your own implementation here */
                console.log(result);
                navigate("/profile");
            },
            onError: function (result) {
                /* You may add your own implementation here */
                console.log(result);
            },
            onClose: function () {
                /* You may add your own implementation here */
                alert("you closed the popup without finishing the payment");
            },
        });
    } catch (error) {
        console.log(error);
    }
});

useEffect(() => {
  //change this to the script source you want to load, for example this is snap.js sandbox env
  const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
  //change this according to your client-key
  const myMidtransClientKey = "SB-Mid-client-5WbzqPx2xRGE0VN3";

  let scriptTag = document.createElement("script");
  scriptTag.src = midtransScriptUrl;
  // optional if you want to set script attribute
  // for example snap.js have data-client-key attribute
  scriptTag.setAttribute("data-client-key", myMidtransClientKey);

  document.body.appendChild(scriptTag);
  return () => {
      document.body.removeChild(scriptTag);
  };
}, []);

  return (
    <div>
      <Navigation />
      <div className="detail">
        {datas ? <>
        <div className="container">
          <div className="left">
            <div className="image">
              <img src={`http://localhost:5000/uploads/${datas?.thumbnail}`} alt="tom" />
            </div>
          </div>
          <div className="right">
            <div className="wrapper">
              <div className="title">
                <div className="title-film">
                  <h2><b>{datas?.title}</b></h2>
                </div>
              </div>
              <div className="file">
                <iframe width="920" height="390"
                src={datas?.filmUrl}>
              </iframe>
              </div>
              <div className="categorys">
                {datas?.categories?.map((item, index) => {
                  return (
                    <div key={index} className="category">
                      <h2><b>{item?.name}</b></h2>
                    </div>
                  )
                })}
              </div>
              <div className="description">
                <p>{datas?.description}</p>
              </div>
            </div>
          </div>
        </div>
        </> :
        <div className="container">
        <div className="left">
          <div className="image">
            <img src={film?.thumbnail} alt="tom" />
          </div>
        </div>
        <div className="right">
          <div className="wrapper">
            <div className="title">
              <div className="title-film">
                <h2><b>{film?.title}</b></h2>
              </div>
              <div className="btn-buy">
                <Button onClick={() => handleBuy.mutate()} variant="primary">Buy Now</Button>
              </div>
            </div>
            <div className="file">
              <img onClick={() => setShow(true)} style={{ position: "absolute", paddingTop: "150px", paddingLeft: "425px", cursor: "pointer" }} src={Play} alt="Play" />
              <img style={{ border: "1px solid white" }} width="920" height="390" src={Black} alt="Film" />
            </div>
            <div className="categorys">
              {category?.map((item, index) => {
                return (
                  <div key={index} className="category">
                    <h2><b>{item?.name}</b></h2>
                  </div>
                )
              })}
            </div>
            <div className="price">
              <p>{rupiahFormat.convert(film?.price)}</p>
            </div>
            <div className="description">
              <p>{film?.description}</p>
            </div>
            <Modal style={{ position: "absolute", paddingTop: "300px" }} show={show} onHide={handleClose}>
              <Modal.Body style={{ color: "#469F74", textAlign: "center", fontSize: '18px' }}>Please buy this film if you want to watch</Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
        }
      </div>
    </div>
  )
}

export default Detail