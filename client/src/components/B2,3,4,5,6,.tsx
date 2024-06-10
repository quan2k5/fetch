import React, { useEffect, useState } from 'react'
type Product={
    name:string,
    id:number,
    price:number,
    quantity:number,
    image:string,
    created_at:string,
}
export default function B2() {
    const [productList,setProductList]=useState<Product[]>([]);
    const [typeSubmit,setTypeSubmit]=useState<string>('add');
    const [product,setProduct]=useState<Product>({
            id:0,
            name:'',
            price:0,
            quantity:0,
            image:'',
            created_at:'',
    });
    const [searchInput,setSearchInput]=useState<string>('');
    const getData=()=>{
        fetch("http://localhost:8000/products")
        .then((response:Response)=>response.json())
        .then((data:Product[])=>setProductList(data))
        .catch((err)=>console.log(err))
    }
    useEffect(()=>{
        getData();
    },[])
    const handleDelete=(id:number)=>{
        fetch(`http://localhost:8000/products/${id}`,{
            method:"DELETE"
        }).then((data:Response)=>getData())
        .catch((error)=>console.log(error))
    }
    const handleSearch=(name:string)=>{
        fetch(`http://localhost:8000/products?name=${name}`,{
            method:"GET"
        }).then((data:Response)=>console.log(data))
        .catch((error)=>console.log(error))
    }
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const{name}=e.target;
        const {value}=e.target;
        let temp;
        if(name=='price'||name=='quantity'){
            temp=Number(value)
        }
        temp=value;
        setProduct({...product,[name]:temp});
    }
    const handleForm=(e:React.FormEvent)=>{
        e.preventDefault();
        if(typeSubmit==='add'){
            fetch('http://localhost:8000/products',{
                method:"POST",
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify(product),
            })
            .then((response:Response)=>{
                getData();
                console.log('sdfbg');
                
                reSet();
            })
            .catch((err)=>console.log(err))
        }else{
            fetch(`http://localhost:8000/products/${product.id}`,{
                method:'PUT',
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify(product)
            })
            .then((response:Response)=>{
                if(response.ok){
                    reSet();
                    getData();
                    setTypeSubmit('add');
                }
            })
            .catch((error)=>console.log(error))
        }
    }
    const reSet=()=>{
        setProduct({
            id:Math.ceil(Math.random()*10000000),
            name:'',
            price:0,
            quantity:0,
            image:'',
            created_at:'',
        })
    }
    const handleUpdateProduct=(id:number)=>{
    setTypeSubmit('update');
     fetch(`http://localhost:8000/products/${id}`)
        .then((response:Response)=>response.json())
        .then((data:Product)=>setProduct(data))
        .catch((err)=>console.log(err))
    }
  return (
    <div>
        <div style={{marginBottom:"20px"}}>
            <label htmlFor="" style={{marginRight:"10px"}}>Tìm kiếm</label>
            <input type="text" onChange={(e)=>{setSearchInput(e.target.value)}}  />
            <button onClick={()=>{handleSearch(searchInput)}}>search</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>name</th>
                    <th>image</th>
                    <th>price</th>
                    <th>quantity</th>
                    <th>Ngày nhập</th>
                </tr>
            </thead>
            <tbody>
                {productList.map((e:Product)=>{
                    return  <tr>
                                <td>{e.id}</td>
                                <td>{e.name}</td>
                                <td><img src={e.image} style={{width:"150px", height:"100px"}} alt="" /></td>
                                <td>{e.price}</td>
                                <td>{e.quantity}</td>
                                <td>{e.created_at}</td>
                                <td>
                                    <button onClick={()=>{handleUpdateProduct(e.id)}}>Sửa</button>
                                    <button onClick={()=>{handleDelete(e.id)}}>Xóa</button>
                                </td>
                            </tr>
                })}
            </tbody>
        </table>
        <form action="" onSubmit={handleForm}>
            <div>
                <label htmlFor="">Name</label>
                <br />
                <input type="text"value={product.name} onChange={handleChange} name='name' />
            </div>
            <div>
                <label htmlFor="">Image</label>
                <br />
                <input value={product.image} type="text" onChange={handleChange} name='image' />
            </div>
            <div>
                <label htmlFor="">Quantity</label>
                <br />
                <input value={product.quantity} type="number" onChange={handleChange} name='quantity' />
            </div>
            <div>
      -          <label htmlFor="">Price</label>
                <br />
                <input value={product.price} type="number" onChange={handleChange} name='price' />
            </div>
            <div>
                <label htmlFor="">NSX</label>
                <br />
                <input value={product.created_at} type="text" onChange={handleChange} name='created_at' />
            </div>
            <div>
                <button>SUBMIT</button>
            </div>
        </form>
    </div>
  )
}