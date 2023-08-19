import React, { FC, useEffect, useState } from 'react';
import io from "socket.io-client";


export const ChatArea: FC = () => {
    const [users, setUsers] = useState([]);
    const socket = io("https://socket-io-server-gilt.vercel.app/",{
        transports: ['websocket',  'polling'],

    });
    useEffect(() => {

        const username = prompt("enter your username");
        if (username) {

            socket.emit("join room", username);
        }
    }, [])
    socket.on('update users', data => {
        setUsers(data);
    });


    // function to return html
    const userupdate = (newUsername:string,status:string) =>{

        const chatsDiv:any = document.querySelector("#chatsDiv");
        const div = document.createElement("div");
        div.classList.add("newChat");
        div.innerHTML = `${newUsername} -----> ${status}`;
        chatsDiv?.appendChild(div);
    }
    
    socket.on('new user', newUsername => {
        userupdate(newUsername,"JUST JOINED");
    });
    socket.on('user left', username => {
        userupdate(username,"LEFT THE CHAT");
    });

    return (
        <div style={{
            display: "flex"
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
                height: "100vh",
                padding:"20px"
            }}>
                <h2 style={{
                    padding:"0",
                    margin:"0 0 10px 0"
                }}>Welcome to the vedham chatroom</h2>
            </div>
        </div>
    )
}
