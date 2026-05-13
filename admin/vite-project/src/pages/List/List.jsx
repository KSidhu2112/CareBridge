import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({url}) => {

  const [list, setList] = useState([]);
  

    const GetListOfItems=async()=>{
      const res=await axios.get(`${url}/api/donation/getAll`);
      console.log(res.data);
      if(res.data.success){
        setList(res.data.data);
      }
      else{
        toast.error("Error while fetching list of items");
      }
    }

    const removeDonation=async(id)=>{
      const res=await axios.delete(`${url}/api/donation/delete/${id}`); 
      if(res.data.success){
        toast.success(res.data.message);
        GetListOfItems();
      }
      else{
        toast.error("Error while deleting the item");
      }
    }

    useEffect(()=>{
      GetListOfItems();
    },[])

    return(
      <div className="list">
          <p>All Food List</p>
          <div className="list-container">
            <div className="left-group">
              <b>Image</b>
              <b>Name</b>
            </div>
            <div className="right-group">
              <b>Category</b>
              <b>Price</b>
              <b>Action</b>
            </div>
        </div>

        {list.map((item, index) => (
          <div key={index} className="list-container">
            <div className="left-group">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
            </div>
            <div className="right-group">
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p onClick={()=>removeDonation(item._id)}>X</p>
            </div>
          </div>
        ))}

      </div>
    )
}

export default List
