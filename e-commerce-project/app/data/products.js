export const products=[
    {
        name:"ram-ddr4",
        imageUrl:"ram.png",
        rating:4.5,
        price:50,
        id:1,
        category:"Electronics"
    },
    {
        name:"samusung",
        imageUrl:"phone.png",
        rating:4,
        price:70,
        id:2,
        category:"Electronics"
    },
    {
        name:"shirt",
        imageUrl:"shirt.png",
        rating:3,
        price:90,
        id:3,
        category:"Fashion"
    },
    {
        name:"necklace",
        imageUrl:"neck.jpg",
        rating:4,
        price:500,
        id:59,
        category:"Fashion"
    }
]
export const categories=[
    {
        name:"Electronics",
        id:1,
        imageUrl:"Ram.png",
        productCount:2,
        description:"Electronic devices and accessories"
},
{
    name:"fashion",
    imageUrl:"shirt.png",
    id:2,
    productCount:5
},
{
    name:"Home & Kitchen",
    imageUrl:"pot.jpeg",
},
{
    name:"Shoes",
    imageUrl:"shoes.jpeg"
},
{
    name:"Books",
    imageUrl:"books.jpeg"
},
{
    name:"Toys & Games",
    imageUrl:"toys.jpeg"
},
{
    name:"Beauty",
    imageUrl:"oil2.jpg"
},
{
    name:"Sports",
    imageUrl:"ball.jpeg"
}
]


export function getAllProducts(){
    return products;
}
export function getAllCategories(){
    return categories;
} 