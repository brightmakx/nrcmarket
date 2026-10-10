'use client'
import { useState } from "react"


import "@/app/components/styles/createProduct.css"

export default function Page(){
    const [list,setState]=useState([])
    return(
        <div className="main">
            <h1>add products</h1>
            <div className="details">
                <p>
                    <label htmlFor='name'>name</label><br/>
                    <input id="name" placeholder="Name of the Category"></input>
                </p>
                <p>
                    <label htmlFor="image">Category Image</label><br></br>
                    <input id="image" type="file"></input>
                </p>
                <p><button id="addToList">addToList</button><button id="send">send</button></p>
            </div>
        </div>
    )
}