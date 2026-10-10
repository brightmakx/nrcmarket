"use client"
import "./service-form.css"
import { useState } from "react"

export function Form(){
    const [image,setImage]=useState<File|undefined|any>()
    const [serviceId, setServiceId]=useState<string>("")
    const [file,setFile]=useState<"image"|"video">("image")
    const [video,setVideo]=useState<File|undefined>()
    const [btn,setBtn]=useState<"continue"|"previous">("continue")

    const addImage=(e:any)=>{
        const f=e.target.files[0]
        setImage(f)
    }
    const addVideo=(e:any)=>{
        const f=e.target.files[0]
        setVideo(f)
    }
    const send=async(e:any)=>{
        e.preventDefault()
            const formdata=new FormData(e.currentTarget)
            if(file=="video"){
                formdata.append("image",image)
            }
            await fetch("/api/services",{
                method:"PUT",
                body:formdata
            })
        }
    return(
        <form id="fm" onSubmit={send} className="mx-auto">
            <p  className="service-form-p">serviceId<br/><input type="text" name="serviceId" onChange={(e)=>{
                setServiceId(e.target.value)
            }} value={serviceId}></input></p>
            {file=="image"&&<ImageInput addImage={addImage}/>}
            {file=="video"&&<VideoInput addVideo={addVideo}/>}
            <p className="file-name service-form-p">{image&&image.name||video&&video.name}</p>
            {(image||video)&&<p className="service-form-p">{((image&&image.size/1024)||(video&&video.size/1024))?.toFixed(2) +"kb"}</p>}
            <p className="service-form-p"><input type="submit" className="submit" value="submit"></input></p>
            
            {<p className="service-form-p"><button className="continue-btn" onClick={(e)=>{
                e.preventDefault();
                if(file=="image"){
                    setFile("video")
                    setBtn("previous")
                }else{
                    setFile("image")
                    setBtn("continue")
                }
            }}>{btn}</button></p>}
        </form> 
    )
}

function ImageInput({addImage}:{addImage:any}){
    return (
        <p className="service-form-p">image<br/><input type="file" name="image" accept="image/*" onChange={(e)=>{
                addImage(e)
            }}></input></p>
    )
}

function VideoInput({addVideo}:{addVideo:any}){
    return(
        <p className="service-form-p">video<br/><input type="file" name="video" accept="video/*" onChange={(e)=>{
                addVideo(e)
            }}></input></p>
    )
}