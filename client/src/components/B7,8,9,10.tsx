import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import Modal from './Modal';
type Product={
    id:number,
    product_name:string,
    image:string,
    price:number,
    quantity:number,
    created_at:string,
}
export default function GetAllProducts() {
    const [typeSubmit,setTypeSubmit]=useState<string>("add")
    const [products,setProducts]=useState<Product[]>([]);
    const [checked,setChecked]=useState<boolean>(false);
    const [product,setProduct]=useState<Product>({
        id:Math.floor(Math.random()*10000000),
        product_name:'',
        image:'',
        price:0,
        quantity:-1,
        created_at:'',
    })
    const reset=()=>{
        setProduct({
            id:Math.floor(Math.random()*10000000),
            product_name:'',
            image:'',
            price:0,
           quantity:-1,
            created_at:'',
        })
    }
    const openDelete=(id:number)=>{
        setProduct({...product,id:id});
        setChecked(true);
     }
     const closeDelete=()=>{
         reset();
         setChecked(false);
     }
    const loadData=()=>{
        fetch('http://localhost:8000/products')
        .then((response:Response)=>response.json())
        .then((data:Product[])=>setProducts(data))
        .catch((error)=>console.log(error))
    }
    useEffect(()=>{
        loadData();
    },[]);
    const getProductById=(id:number)=>{
        fetch(`http://localhost:8000/products/${id}`)
        .then((response:Response)=>response.json())
        .then((data)=>console.log(data))
        .catch((error)=>console.log(error))
    }
    const handleDeleteProduct=()=>{
        fetch(`http://localhost:8000/products/${product.id}`,{
            method:'DELETE'
        })
        .then((response:Response)=>{
            if(response.ok){
                loadData();
            }
        })
        .catch((error)=>console.log(error)
        )
        reset();
        setChecked(false);
    }
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const name=e.target.name;
        const value=e.target.value;
        setProduct({...product,[name]:value});
    }
    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault();
        if(typeSubmit==='add'){
            fetch('http://localhost:8000/products',{
                method:'POST',
                headers:{
                    "Content_type":"application/json"
                },
                body:JSON.stringify(product)
            })
            .then((response:Response)=>{
                if(response.ok){
                    loadData()
                }
                reset();
            })
            .catch((error)=>console.log(error)
            )
        }else{
            fetch(`http://localhost:8000/products/${product.id}`,{
                method:'PUT',
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify(product)
            })
            .then((reponse:Response)=>{
                if(reponse.ok){
                    reset();
                    loadData();
                    setTypeSubmit("add");
                }
            })
        }
    }
    const updateProduct=(id:number)=>{
        fetch(`http://localhost:8000/products/${id}`)
        .then((response:Response)=>{
            if(response.ok){
                return (response.json());            
            }
            throw new Error("No Founded")
        })
        .then((data)=>setProduct(data)
        )
        .catch((error)=>console.log(error.message)
        )
        setTypeSubmit("update")
    }
  return (
    <div>
        {checked && <Modal yes={handleDeleteProduct} no={closeDelete}/>}
        <form action="">
            <input  onChange={handleChange} name='name' type="text" placeholder='Name' value={product.product_name} />
            <input onChange={handleChange} name='img' type="text" placeholder='Image' value={product.image} />
            <input  onChange={handleChange} name='price' type="number" placeholder='Price' value={product.price}/>
            <input  onChange={handleChange} name='quantity' type="number" placeholder='Quantity' value={product.price}/>
            <input onChange={handleChange} name='create_at' type="date" placeholder='Create_at'value={product.created_at} />
            <Button onClick={handleSubmit}  type='submit'>Submit</Button>
        </form>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>STT</th>
          <th>Name</th>
          <th>Img</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Create_at</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product,index)=>(
            <tr>
                <td>{index+1}</td>
                <td>{product.product_name}</td>
                <td><img style={{width:'100px',height:'100px'}} src={product.image} alt="" /></td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.created_at}</td>
                <td>
                <Button onClick={()=>updateProduct(product.id) }  variant="warning">Edit</Button>{' '}
                <Button onClick={()=>openDelete(product.id)} variant="danger">Delete</Button>{' '}
                </td>
            </tr>
        ))}
      </tbody>
    </Table>
    </div>
  )
}