import React, { useEffect, useState } from 'react'
import { selectUser } from '../redux/userSlice'
import { useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap'
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
import Contact from '../components/Contact'
import Chat from '../components/Chat'


let socket

export default function ChatUser() {

    const style = {
        container: {
            height: "55vh"
        },
        row: {
            height: "55vh"
        }
    }

    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])

    const user = useSelector(selectUser)

    const loadContact = () => {
        // emit event load admin contact
        socket.emit("load admin contact")
        // listen event to get admin contact
        socket.on("admin contact", (data) => {
            console.log(data);
            // manipulate data to add message property with the newest message
            // code here
            let dataContact = {
                ...data,
                message: messages.length > 0 ? messages[messages.length - 1].messages : "start message"
            }
            setContacts([dataContact])
        })
    }
    const loadMessages = (value) => {

        socket.on("messages", async (data) => {
            if (data.length > 0) {
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                setMessages(dataMessages)
            }
        })
    }

    const onClickContact = (data) => {
        setContact(data)
        socket.emit("load messages", data.id)
    }

    const onSendMessage = (e) => {
        if (e.key === 'Enter') {
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }
            socket.emit("send messages", data)
            e.target.value = ""
        }
    }

    useEffect(() => {
        socket = io('http://localhost:5000', {
            auth: {
                token: localStorage.getItem("token")
            },
            // code here
            query: {
                id: user.id
            }
        })

        socket.on("new message", () => {
            socket.emit("load messages", contact?.id)
        })

        socket.on("connect_error", (err) => {
            console.error(err.message); // not authorized
        });

        loadMessages()
        loadContact()
        return () => {
            socket.disconnect()
        }
    }, [messages])

    return (
        <>
            <Container fluid style={style.container}>
                <Row>
                    <Col md={4} style={style.row} className="px-3 border-end border-dark overflow-auto">
                        <Contact dataContact={contacts} clickContact={onClickContact} contact={contact} />
                    </Col>
                    <Col md={8} style={style.row} className="px-0">
                        <Chat contact={contact} messages={messages} user={user} sendMessage={onSendMessage} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}