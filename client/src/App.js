import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Detail from './pages/Detail';
import Profile from './pages/Profile'
import ListFilm from './pages/ListFilm';
import AddFilm from './pages/AddFilm';
import { useDispatch } from 'react-redux'
import { isLogin, LOGIN, LOGOUT } from './redux/userSlice'
import { useSelector } from 'react-redux';
import { API, setAuthToken } from './config/api';
import MyFilm from './pages/MyFilm';

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

function App() {

  const dispatch = useDispatch()

  const status = useSelector(isLogin)


  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth')
      if (response.status === 400) {
        return dispatch(LOGOUT())
      }
      let payload = response.data.data.user
      // // Get token from local storage
      payload.token = localStorage.token;
      dispatch(LOGIN(payload))
    } catch (error) {
    }
  }

  useEffect(() => {
    checkUser()
  }, [])


  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/detail/:id" element={<Detail />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/list-film" element={<ListFilm />} />
        <Route exact path="/add-film" element={<AddFilm />} />
        <Route exact path="/my-film" element={<MyFilm />} />
      </Routes>
    </Router>
  );
}

export default App;
