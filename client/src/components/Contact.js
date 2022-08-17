import React, { useEffect } from "react";

export default function Contact({ dataContact, clickContact, contact, messages }) {

    useEffect(()=> {
        
    },[messages])

    return (
        <>
            {dataContact.length > 0 && (
                <>
                    {dataContact.map((data) => (
                        <div key={data.id} className={`chat-wrapper ${contact?.id === data?.id && "contact-active"}`} onClick={() => { clickContact(data) }}>
                            <div className="container">
                                <div className="right">
                                    <div className="name">
                                        <b>@{data.fullname}</b>
                                    </div>
                                    <div className="message">
                                        <p>{data.messages}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}