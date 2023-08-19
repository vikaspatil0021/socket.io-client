import React, { FC, useEffect } from 'react';
import "./ChatList.css";

import io from "socket.io-client";



export const ChatList: FC = () => {

    useEffect(()=>{

        
        var roomId = prompt("Enter roomId");

    if(roomId){

        const socket = io("http://localhost:5000/");
        
        socket.emit("join room", { roomId });
        
        socket.on("success", (data) => {
            console.log(data);
        })
    }
},[])


    return (
        <div className='cl-container'>
            <div className='cl-chat-card'>
                vikas patil
            </div>
            <div className='cl-chat-card'>
                vikas patil
            </div>
        </div>
    )
}
