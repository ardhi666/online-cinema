import React, { useState } from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import C from '../assets/img/C.png'
import Roll from '../assets/img/film-roll 1.png'
import CO from '../assets/img/CO.png'
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import Zayn from '../assets/img/Zayn.png'
import userIcon from '../assets/img/usericon.png'
import filmIcon from '../assets/img/filmicon.png'
import logoutIcon from '../assets/img/logouticon.png'
import { useMutation } from "react-query";
import axios from 'axios'
import { API } from '../config/api';
import Admin from '../assets/img/admin.jpeg'
import { useDispatch } from 'react-redux'
import { isLogin, LOGIN, LOGOUT, selectUser } from '../redux/userSlice'
import { useSelector } from 'react-redux';
import AdminChat from '../assets/img/chat.png'
import UserChat from '../assets/img/user-chat.png'
import ChatAdmin from '../pages/ChatAdmin';
import ChatUser from '../pages/ChatUser'
import logotrsc from '../assets/img/online-payment.png'

const Navigation = () => {

  let navigate = useNavigate()

  const dispatch = useDispatch()

  const user = useSelector(selectUser)

  const status = useSelector(isLogin)

  const [modalLogin, setModalLogin] = useState(false);

  const [modalRegister, setModalRegister] = useState(false);

  const [Adminchat, setAdminchat] = useState(false);

  const [Userchat, setUserchat] = useState(false)

  const onClickRegister = () => {
    setModalLogin(false)
    setModalRegister(true)
  }

  const onClickLogin = () => {
    setModalRegister(false)
    setModalLogin(true)
  }

  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const { fullname, email, password } = form;
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitRegis = useMutation(async (e) => {
    try {
      e.preventDefault();
      // Configuration Content-type
      const config = {
        headers: {
          'Content-type': "application/json",
        }
      }
      const body = JSON.stringify(form)
      // Insert data user to database
      const response = await API.post('/register', body, config)
      // Notification
      if (response.status === 200) {
        const alert = (
          <Alert variant="success" className="py-1">
            {'Registration Successful'}
          </Alert>
        );
        setMessage(alert);
        setForm({
          email: "",
          password: "",
          fullname: ""
        });
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            {response.error.message}
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          {error.response.data.error.message}
        </Alert>
      );
      setMessage(alert);
    }
  });


  const handleSubmitLogin = useMutation(async (e) => {
    try {
      e.preventDefault();

      axios.post('http://localhost:5000/api/v1/login', {
        email: form.email,
        password: form.password
      }).then((response) => {
        localStorage.setItem("token", response.data.data.users.token);
        dispatch(LOGIN(response.data.data.users))

      })
        .catch(error => {
          console.log(error);
          const alert = (
            <Alert variant="danger" className="py-1">
              {error.response.data.message}
            </Alert>
          );
          setMessage(alert);
        });

    } catch (error) {
      console.log(error);
    }
  });

  const handleLogout = () => {
    dispatch(LOGOUT())
    localStorage.removeItem("token");
    navigate('/')
    setModalLogin(true)
    setForm({
      email: "",
      password: "",
      fullname: ""
    });
  }


  return (

    <Navbar className='navbar'>
      <Container fluid>
        <Link to={'/'}><Navbar.Brand className='title'><img src={C} alt="C" /><img src={Roll} alt="Roll" /><img style={{ marginLeft: "10px" }} src={CO} alt="CO" /></Navbar.Brand></Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {status === false ? <>
            <div className="btn-login">
              <Button onClick={() => setModalLogin(true)} variant="primary">Login</Button>
            </div>
            <div className="btn-register">
              <Button onClick={() => setModalRegister(true)} variant="primary">Register</Button>
            </div>
            <Modal
              show={modalLogin}
              onHide={() => setModalLogin(false)}
              aria-labelledby="contained-modal-title-vcenter" centered>
              <Modal.Body style={{ backgroundColor: "black" }}>
                <div className="register">
                  <div className="form">
                    <div className="register-page">
                      <h2>Login</h2>
                      {message && message}
                    </div>
                    <Form onSubmit={(e) => handleSubmitLogin.mutate(e)}>
                      <Form.Group className="label" controlId="formBasicEmail">
                        <Form.Control onChange={handleChange} value={email} type="email" placeholder="Email" name='email' />
                      </Form.Group>
                      <Form.Group className="label" controlId="formBasicPassword">
                        <Form.Control onChange={handleChange} value={password} type="password" placeholder="Password" name='password' />
                      </Form.Group>
                      <Button className='btn-login' variant="primary" type="submit">
                        Login
                      </Button>
                      <p>Don't have an account ? <b style={{ cursor: "pointer" }} onClick={() => onClickRegister()}>Click Here</b></p>
                    </Form>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            <Modal
              show={modalRegister}
              onHide={() => setModalRegister(false)}
              aria-labelledby="contained-modal-title-vcenter" centered>
              <Modal.Body style={{ backgroundColor: "black" }}>
                <div className="register">
                  <div className="form">
                    <div className="register-page">
                      <h2>Register</h2>
                      {message && message}
                    </div>
                    <Form onSubmit={(e) => handleSubmitRegis.mutate(e)}>
                      <Form.Group className="label" controlId="formBasicPassword">
                        <Form.Control onChange={handleChange} value={fullname} type="text" placeholder="Full Name" name="fullname" />
                      </Form.Group>
                      <Form.Group className="label" controlId="formBasicEmail">
                        <Form.Control onChange={handleChange} value={email} type="email" placeholder="Email" name="email" />
                      </Form.Group>
                      <Form.Group className="label" controlId="formBasicPassword">
                        <Form.Control onChange={handleChange} value={password} type="password" placeholder="Password" name="password" />
                      </Form.Group>
                      <Button className="btn-register" variant="primary" type="submit">
                        Register
                      </Button>
                      <p>Already have an account ? <b style={{ cursor: "pointer" }} onClick={() => onClickLogin()}>Click Here</b></p>
                    </Form>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </> :
            <div className="dropdown">
              <ul>
                <div className="sub-menu-1">
                  <ul>
                    <li onClick={handleLogout}><img onClick={handleLogout} src={logoutIcon} alt="CL" />Log Out</li>
                  </ul>
                </div>
              </ul>
            </div>
          }
          {status === true && user.status === "user" && <>
            <div className="dropdown">
              <ul>
                <li className="profile-img"><img src={Zayn} alt="PP" />
                  <div className="sub-menu-1">
                    <ul>
                      <Link to={'/profile'}><li><img src={userIcon} alt="PP" />Profile</li></Link>
                      <Link to={'/my-film'}><li><img src={filmIcon} alt="PP" />My Film</li></Link>
                      <li onClick={handleLogout}><img onClick={handleLogout} src={logoutIcon} alt="CL" />Log Out</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </>}
          {status === true && user.status === "admin" && <>
            <div className="dropdown">
              <ul>
                <li className="profile-img"><img src={Admin} alt="PP" />
                  <div className="sub-menu-1">
                    <ul>
                      <Link to={'/add-film'}><li><img src={filmIcon} alt="PP" />Add Film</li></Link>
                      <Link to={'/list-film'}><li><img src={logotrsc} alt="PP" />Transaction</li></Link>
                      <li onClick={handleLogout}><img onClick={handleLogout} src={logoutIcon} alt="CL" />Log Out</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation