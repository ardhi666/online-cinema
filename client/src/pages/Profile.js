import React, { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'
import Zayn from '../assets/img/Zayn.png'
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice'
import { API } from '../config/api';
import rupiahFormat from 'rupiah-format';
import moment from 'moment'

const Profile = () => {

    const user = useSelector(selectUser)

    const [myTransactions, setmyTransactions] = useState([])

    const getMyTransactions = async () => {
        try {
            const response = await API.get('/my-transactions')
            console.log(response.data.data.transactions);
            setmyTransactions(response.data.data.transactions);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMyTransactions();
    }, [myTransactions]);

    return (
        <div>
            <Navigation />
            <div className="profile">
                <div className="wrapper">
                    <div className="left">
                        <h2>My Profile</h2>
                        <div className="profile-container">
                            <div className="image">
                                <img src={Zayn} alt="User" />
                            </div>
                            <div className="profile-user">
                                <h3>FULL NAME</h3>
                                <p>{user?.fullname}</p>
                                <h3>Email</h3>
                                <p>{user?.email}</p>
                                <h3>Phone</h3>
                                <p>-</p>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h2>History Transaction</h2>
                        <div className="transaction">
                            {myTransactions?.map((data, index) => {
                                return (
                                    <div key={index} className="card">
                                        <div className="filmImg">
                                            <img style={{ width: "100px" }} src={`http://localhost:5000/uploads/${data?.film?.thumbnail}`} alt="Image" />
                                        </div>
                                        <div className="left">
                                            <h3>{data?.film?.title}</h3>
                                            <p>{moment(data?.createdAt).format('LLL')}</p>
                                            <p style={{ fontSize: "17px" }}><b>Total : {rupiahFormat.convert(data?.price)}</b></p>
                                        </div>
                                        <div className="right">
                                            <div className="status">
                                                {data?.status === 'Pending' ?
                                                    <div className="wrapper">
                                                        <h3 className='text-warning'>{data?.status}</h3>
                                                    </div> :
                                                    <div className="wrapper">
                                                        <h3 style={{ color: "green" }} className='text-success'>{data?.status}</h3>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile