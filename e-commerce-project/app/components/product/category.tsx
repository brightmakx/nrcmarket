import Link from "next/link";
export default function Product({name, image}: {name: string, image: string}){
    return(
        <div className='category' style={{ '--bg-image': `url("../../${image}")` } as React.CSSProperties}>
            <h4>{name}</h4>
            <p className="shop-now"><Link href={`../../all?category=${name}`}>Shop &gt;</Link></p>
        </div>
    )
}