import React, { useEffect } from "react";

export default function Chat({ contact, user, messages, sendMessage }) {

    useEffect(()=> {
        
    },[messages])

    return (
        <>
            {contact ? (
                <>
                    <div id="chat-messages" style={{ height: "86%" }} className="chat-container overflow-auto">
                        {messages.map((data, index) => (
                            <div key={index}>
                                <div className={`bubble d-flex ${data.idSender === user.id ? "justify-content-end" : "justify-content-start"}`}>
                                    
                                    <div
                                        className={`chat-history {data.idSender === user.id ? "chat-me" : "chat-other"}`}>{data.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="send-chat">
                        <input placeholder="Send Message" className="input-message" onKeyPress={sendMessage} />
                    </div>
                </>
            ) : (
                <div
                    style={{ height: "89.5vh" }}
                    className="h4 d-flex justify-content-center align-items-center"
                >
                    <h2 style={{ color: "black" }}>No Message</h2>
                </div>
            )}
        </>
    );
}