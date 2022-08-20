import React, { useEffect, useState } from "react"
import { Table } from 'react-bootstrap'
import "bootstrap/dist/css/bootstrap.min.css"
import Navigation from "../components/Navigation";
import Polygon from '../assets/img/polygon.png'
import { API } from "../config/api";
import rupiahFormat from 'rupiah-format';
import { useQuery, useMutation } from "react-query";

const ListFilm = () => {

    const [transactions, setTransactions] = useState([])

    let { data: transaction, refetch } = useQuery("transactionCache", async () => {
        const response = await API.get("/transactions");
        console.log(response);
    });

    

    const getTransactions = async () => {
        try {
            const response = await API.get('/transactions')
            setTransactions(response.data.data.transactions);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTransactions();
    }, [transactions]);

    const handleUpdate = async (id) => {
        try {
            const config = {
                headers:{
                    'Content-type': "application/json",
                },status:"Approved"
            }
            const response = await API.patch(`/update-status/${id}`, config)
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const config = {
                headers:{
                    'Content-type': "application/json",
                }
            }
            const response = await API.delete(`/delete-transaction/${id}`, config)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Navigation />
            <div className="list-product">
                <div className="table-name">
                    <h2>Incoming Transfers</h2>
                    <br />
                </div>
                <Table hover>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Users</th>
                            <th>Id Transactions</th>
                            <th>Film</th>
                            <th>Price</th>
                            <th>Status Payment</th>
                            <th>Action</th>
                        </tr>
                        {transactions?.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.buyer.fullname}</td>
                                    <td>{item?.id}</td>
                                    <td>{item?.film.title}</td>
                                    <td>{rupiahFormat.convert(item?.price)}</td>
                                    {item.status === "Approved" ? <>
                                    <td className='text-success'>{item?.status}</td>
                                    </> :
                                    <td className='text-warning'>{item?.status}</td> 
                                    }
                                    <td className="drpdwn"><img src={Polygon} alt="Polygon" />
                                        <ul>
                                            <li onClick={() => {
                                                handleUpdate(item.id);
                                            }} className='text-success'>Approve</li>
                                            <li onClick={() => handleDelete(item.id)} className='text-danger'>Cancel</li>
                                        </ul>
                                    </td>
                                </tr>
                            )
                        })}
                    </thead>
                </Table>
            </div >
        </div>
    );
};
export default ListFilm;