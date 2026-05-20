import React, { useEffect } from 'react'
import "./Home.css"
import Hero from '../../components/Hero/Hero'
import About from '../../components/About/About'
import DonationSection from '../../components/DonationSection/DonationSection'

const Home = ({setShowModel,setShop, setIsLogin}) => {

  useEffect(() => {
    setShop(false);
  }, [setShop]);
    
    useEffect(()=>{
                setShowModel(true);
            },[setShowModel])
  return (
    <div>
        <Hero setShop={setShop} setIsLogin={setIsLogin}/>
        <About/>
        {/* <DonationSection/> */}
    </div>
  )
}

export default Home
