"use client"

export default function Notifications(){
    function urlBase64ToUnit8Array(base64String:any){
        const padding="=".repeat(
            (4-(base64String.length%4))%4
        );

        const base64=(base64String+padding).replace(/-/g,"+").replace(/_/g,"/");
        const rawData=window.atob(base64);

        return Uint8Array.from(
            [...rawData].map((char)=>{
                return char.charCodeAt(0)
            })
        )
    }
    async  function enableNotifications(){
        const permission=await Notification.requestPermission();

        console.log("permission: ",permission)
        if(permission!=="granted"){
            return
        }
        const registration=navigator.serviceWorker.register("/sw.js")

        const publickey=process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        const subscription=(await registration).pushManager.subscribe({
            userVisibleOnly:true,
            applicationServerKey:urlBase64ToUnit8Array(publickey)
        })
        await fetch("/api/push/subscribe",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify((await subscription).toJSON())
        })
        console.log((await subscription).toJSON().keys)
    }
    async function  test() {
        await fetch("/api/push/test",{
            method:"POST",
            body:JSON.stringify({
  "title": "Test notification",
  "message": "Your Web Push setup is working!"
})
        })
    }

    return (
        <>
                <button onClick={enableNotifications}>enable notifications</button><br/>
                <button onClick={test}>test</button>
        </>
        
    )

}