import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";



const Categories = () => {

  const { currentUser } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()
  const cat = useLocation().search



useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`/categories${cat}`);
      const searchValue = searchParams.get("search") 
      
      if (searchValue){
       const result = res.data.filter(c => c.name.toLowerCase().includes(searchValue.toLowerCase()))
       setCategories(result);
       
      }else{
        setCategories(res.data);
      }
      
       
      }catch (err) {
      console.log(err);
    }
  };
  fetchData();
}, [cat]);
  

const handleDelete = async (categoryId)=>{

  try {
    await axios.delete(`/categories/${categoryId}`);
    window. location. reload();
  } catch (err) {
    console.log(err);
  }
}



  


  return (
    <div className="category-page">
      <div className="categories">
        {categories.map((category) => (
          <div className="category" key={category.id}>
            <div className="content">
            <Link className="link" to={`/categories/${category.id}`}>
                <h1>{category.name}</h1> {/* Change categories.name to category.name */}
            </Link>
            {(currentUser && currentUser.id === category?.Cuser_id) && (
            <div className="edit">
              <Link to={`/writeCategory?edit=2`} state={category}>
                <img src={Edit} alt="" />
              </Link>
              
                <img onClick={() => handleDelete(category.id)} src={Delete} />
               {/* <button onClick={handleDelete(category.id)} src={Delete} alt="" ></button>  */}
            </div>
          )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
