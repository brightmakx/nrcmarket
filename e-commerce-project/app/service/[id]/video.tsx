"use client"

import { useState } from "react"

export default function Video({url}:{url:string}){
    const [videoUrl,setUrl]=useState<string>(url)
    //console.log("video url "+videoUrl)
    return(
        <source src={videoUrl} type="video/mp4"/>
    )
}