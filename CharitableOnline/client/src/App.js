import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import Register from "./pages/Register"
import Login from "./pages/Login"
import Single from "./pages/Single"
import Write from "./pages/Write"
import Home from "./pages/Home"
import WriteCategory from "./pages/WriteCategory"
import Categories from "./pages/Categories"
import CategoriesSingle from "./pages/CategoriesSingle"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./style.scss"






const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path:"/",
        element:<Home/> 
      },
      {
        path:"/post/:id",
        element:<Single/> 
      },
      {
        path:"/write",
        element:<Write/> 
      },
      {
        path:"/writecategory",
        element:<WriteCategory/> 
      },
      {
        path:"/categories",
        element:<Categories /> 
      },
      {
        path:"/categories/:id",
        element:<CategoriesSingle /> 
      },
    
    ]
  },
  {
    path:"/login",
    element:<Login/> 
  },
  {
    path:"/register",
    element:<Register/> 
  },
  

]);


function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
};


export default App;
