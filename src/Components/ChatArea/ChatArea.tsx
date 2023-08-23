import React, { FC, useEffect, useState } from 'react';
import io from "socket.io-client";

// const socket = io("ws://localhost:5000", {
    const socket = io("wss://rambunctious-chivalrous-truffle.glitch.me/", {

    transports: ['websocket', 'polling'],
    extraHeaders: {
        "user-agent": "mozilla"
    }
});

export const ChatArea: FC = () => {
    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState('');
    const [userName, setUserName] = useState('');


    socket.io.on("error", (error) => {
        console.log(error)
    });


    useEffect(() => {

        const username = prompt("enter your username");
        if (username) {
            setUserName(username);
            socket.emit("join room", username);
            console.log('ji')
        }
        socket.on('new user', newUsername => {
            userupdate(newUsername, "JUST JOINED");
            console.log('new user')
    
        });
        socket.on('user left', username => {
            userupdate(username, "LEFT THE CHAT");
            console.log('user left')
    
        });
    
        socket.on('newMessage', data => {
            userupdate(data.userName, data.msg);
    
        });
        socket.on('update users', data => {
            setUsers(data);
        });
    }, [])


    // function to return html
    const userupdate = (newUsername: string, status: string) => {

        const chatsDiv: any = document.querySelector("#chatsDiv");
        const div = document.createElement("div");
        div.classList.add("newChat");
        div.innerHTML = `${newUsername} -----> ${status}`;
        chatsDiv?.appendChild(div);
    }



    // on sumbit send message handler
    const sendMessage = (e: any) => {
        e.preventDefault();
        if (msg != '') socket.emit("user message", { userName, msg });
        setMsg('')
    }

    return (
        <div style={{
            display: "flex",
            position: 'relative'
        }}>
            <div style={{
                width: "25vw",
                backgroundColor: "#222",
                height: "calc(100vh - 30px)",
                padding: "15px",
                overflow: "auto"
            }}>
                {users.map(each => {
                    return (
                        <div style={{
                            padding: "10px 15px",
                            borderRadius: "10px",
                            backgroundColor: "#555",
                            margin: "0 0 10px 0",
                            color: "#f2f2f2",
                            fontWeight: "bold"
                        }}>
                            {each}
                        </div>
                    )
                })}
            </div>










            {/* part2 chatting page */}
            <div id='chatsDiv' style={{
                width: "75vw",
                height: "calc(100vh - 40px)",
                padding: "20px",
                position: "relative"
            }}>
                <h2 style={{
                    padding: "0",
                    margin: "0 0 10px 0"
                }}>Welcome to the vedham chatroom</h2>
                <div id='inputDiv'>
                    <form onSubmit={sendMessage}>

                        <input type='text' onChange={(e) => {
                            setMsg(e.target.value)
                        }} value={msg} />
                    </form>
                </div>
            </div>
        </div>
    )
}
