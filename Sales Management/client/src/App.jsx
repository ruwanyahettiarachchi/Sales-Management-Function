import {BrowserRouter ,Routes,Route } from 'react-router-dom';

import About from './Pages/About';
import Signin from './Pages/Signin';
import SignUp from './Pages/SignUp';
import Profile from './Pages/Profile';
import Header from './components/header';
import PrivateRoutes from './components/PrivateRoutes';
import AddItem from './Pages/AddItem';
import ItemProfile from './Pages/ItemProfile';



import ManagerAllDetails from './Pages/AllDetails';
import AddDiscount from './discount Component/AddDiscount';
import UpdateItemDetails from './Pages/UpdateItem';
import ManagerDiscountDetails from './discount Component/AllDiscounts';
import UpdateDiscountDetails from './discount Component/UpdateDiscount';
import SingleItemView from './Pages/SingleItemView';






export default function App() {
  return <BrowserRouter>
<Header/>
  <Routes>
    <Route path="/" element={<ManagerAllDetails/>}></Route>
    <Route path="/about" element={<About/>}></Route>
    <Route path="/sign-in" element={<Signin/>}></Route>
    <Route path="/additem" element={<AddItem/>}></Route>
    <Route path="/sign-up" element={<SignUp/>}></Route>
   
    <Route path="/singleitemview/:id" element={<SingleItemView/>}></Route>
 
    <Route element={<PrivateRoutes/>}>
    <Route path="/profile" element={<Profile/>}></Route>
    <Route path="/items" element={<ItemProfile/>}></Route>
    <Route path="/update-items/:id" element={<UpdateItemDetails/>}></Route>

    <Route path="/addDiscount" element={<AddDiscount/>}></Route>
    <Route path="/allDiscount" element={<ManagerDiscountDetails/>}></Route>

    <Route path="/updatediscount/:id" element={<UpdateDiscountDetails/>}></Route>

    </Route>
 
    
  </Routes>
  
  </BrowserRouter>
  
}
