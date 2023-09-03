import React, { FC, useEffect, useState } from 'react';
import io from "socket.io-client";

const socket = io("ws://localhost:5000", {
    // const socket = io("wss://rambunctious-chivalrous-truffle.glitch.me/", {

    transports: ['websocket', 'polling'],
    extraHeaders: {
        "user-agent": "mozilla"
    }
});

export const ChatArea: FC = () => {
    let userId0 = localStorage.getItem("userId")
    const [msg, setMsg] = useState('');
    const [userName, setUserName] = useState('');
    const [activeRoom, setActiveRoom] = useState("");
   
    


    socket.io.on("error", (error) => {
        console.log(error);
    });

    

    useEffect(() => {
        if (!userId0) {


            const username = prompt("enter your username");
            if (username) {
                setUserName(username);
                socket.emit("userAuth", { username });
            }
            socket.on("userAuth", (userId) => {
                console.log(userId);
                localStorage.setItem("userId", userId);
                window.location.reload();
            })

        }
        socket.on('Room detail',(data)=>{
            const allRoomsDiv  = document.querySelector(".allUsers");
            
            const div   = document.createElement("div");
            div.style.cssText = "margin:15px 0;cursor:pointer;";
            div.innerHTML = data._id;

            const lastActive = document.querySelector(".blue");
            lastActive?.classList.remove("blue");
            div.classList.add('blue');

            allRoomsDiv?.appendChild(div);
            setActiveRoom(data._id);
        });


        socket.on('newMessage',(message)=>{
            console.log(message)
            const mainDiv = document.querySelector('#chatsDiv');

            const div   = document.createElement("div");
            div.classList.add('newChat');

            div.innerHTML = message.userId + ' - ' + message.msg;

            mainDiv?.appendChild(div);
        })
       
    }, [])




    // on sumbit send message handler
    const sendMessage = (e: any) => {
        e.preventDefault();
        if (msg != '') socket.emit("new message", { userId0, msg ,activeRoom});
        setMsg('')
    }

    const newChatRoom = () => {
        const otherUsername = prompt('Enter the other persons username');
        socket.emit("create room", { otherUsername, userId0 })
    }


    const allDiv = document.querySelectorAll('.allUsers div');
    allDiv.forEach(each=>{
        each.addEventListener('click',(e)=>{
            setActiveRoom(each.innerHTML);
            const lastActive = document.querySelector(".blue");
            lastActive?.classList.remove("blue");

            each.classList.add('blue');
        })
    })

    return (
        <div style={{
            display: "flex",
            position: 'relative'
        }}>
            <div className='usersDiv'>
                <div className='newUserBtn' onClick={newChatRoom}>
                    + New
                </div>
                <div className='allUsers'>
                    
                </div>
            </div>










            {/* part2 chatting page */}
            <div id='chatsDiv'>
                <h2 style={{
                    padding: "0",
                    margin: "0 0 10px 0"
                }}>Welcome {userId0} to the vedham chatroom</h2>

            </div>
            <div id='inputDiv'>
                <form onSubmit={sendMessage}>

                    <input type='text' onChange={(e) => {
                        setMsg(e.target.value)
                    }} value={msg} />
                </form>
            </div>
        </div>
    )
}
