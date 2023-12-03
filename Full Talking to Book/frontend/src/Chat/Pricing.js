import React, { useState } from 'react'
import { Link, json } from 'react-router-dom'
import { auth } from '../firebase'
import { IoIosArrowBack } from "react-icons/io";
import { Switch } from "@material-tailwind/react";
import { FaCheckCircle } from "react-icons/fa";

export default function Pricing() {
  const [duration, setDuration] = useState('monthly');
    const user = auth.currentUser;
    const userId = user.uid; 
    const handleSwitchChange = () => {
      setDuration((prevDuration) => (prevDuration === 'monthly' ? 'annually' : 'monthly'));
    };
const payments=[
    {
        id:1,
        price:1,
        aprice:100,
        title:'Free',
        question:'20 questiobs',
        books:'3 books',
        language:'30+ languages',
        ChatGPT: 'ChatGPT 3.5'

      }, {
        id:2,
        price:16.99,
        aprice:1699,
        title:'Plus',
        question:'200 questions/month',
        books:'5 books',
        language:'30+ languages',
        ChatGPT: 'ChatGPT 3.5'

      }, {
        id:3,
        price:19.99,
        aprice:1999,
        title:'Premium',
        question:'Unlimited Question',
        books:'Unlimited',
        ChatGPT: 'ChatGPT 3.5',
        language:'30+ languages',


      },  {
        id:4,
        price:99.99,
        
        aprice:9999,
        title:'Genius',
        question:'Unlimited Question',
        books:'Unlimited',
        ChatGPT: 'ChatGPT 3.5 and GPT 4',
        language:'30+ languages',


      },

]


 
    // const getdata=(id,plan,price)=>{
      
    //     fetch('http://localhost:529/api/v1/create-subscription-checkout-session',{
    //         method:'POST',
    //         headers:{
    //             "Content-Type":"application/json",
    //         },
    //         mode:'cors',
    //         body:JSON.stringify({plan:price,customerID:userId})
    //     })
    //     .then((res)=>{
    //         if (res.ok)  {
    //             return res.json();
    //         }
    //         console.log(res)
    //         return res.json().then((json)=>Promise.reject(json));
    //     })
    //     .then(({session})=>{
    //         window.location=sesssio.url;
    //     })
    //     .catch((e)=>{
    //         console.log(e.error)
    //     })
     
    // }
    const getdata = ( pricex) => {
      // Alert to indicate the function is being called
      // alert('click on this');
      const price = pricex;
      //  alert(price)
      
      // Fetch the subscription checkout session URL from the API
      fetch('http://localhost:529/api/v1/create-subscription-checkout-session', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ plan: price, customerID: userId })
      })
      .then((res) => {
        // console.log(res);
        if (res.ok) {
          return res.json();
        }
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ checkoutSessionData }) => {
        // alert('Before redirection');
        const session = checkoutSessionData;
        window.location = session.url;
        // alert('After redirection');
      })
      
        .catch((error) => {
          console.error('Error fetching checkout session URL:', error);
        });
    };
    
  
  return (
   <>
   
   
      <div className='bg-[#262626] w-screen h-screen'>
        {/* link to back */}
        <Link to={`/`}>
            <div className='h-[10%] text-white flex items-center ml-10'>
            <IoIosArrowBack className='w-8 h-8 mr-5'/>
   <h1 className='text-2xl mb-2'>Back</h1>
              </div> 
              </Link>
              {/* link end to back */}
            <div className='h-[10%] flex justify-center items-center'>
              <h1 className='mr-5   text-2xl text-white'>Billed monthly</h1>
              <Switch
      id="custom-switch-component"
      ripple={false}
      className="h-full w-full checked:bg-[#ff165d]"
      containerProps={{
        className: "w-11 h-6",
      }}
      circleProps={{
        className: "before:hidden left-0.5 border-none",
      }}
      onChange={handleSwitchChange}
      checked={duration === 'annually'}
    />
            <h1 className='ml-5   text-2xl text-white'>Billed annually</h1>
         </div> 
            <div className='h-[78%] px-10'>
              
            <ul className="grid w-[96%] list-none gap-6 md:grid-cols-2 lg:gap-4 xl:grid-cols-4 h-[90%] px-10">
  <>
    <link
      href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;1,600&display=swap"
      rel="stylesheet"
    />
    <style
      dangerouslySetInnerHTML={{
        __html: "\n  * {\n  font-family: 'Source Sans Pro';\n  }\n"
      }}
    />

    {payments.map((item,index)=>( 
       <div className={`mt-10 p w-62 rounded-lg ${item.title === 'Premium' ? 'border border-solid border-blue-500 bg-[#3c3c3c]' : ''} text-white py-8  pl-3 "  `} key={index}>
      <div className="text-center">
        <p className="font-bold text-left text-white text-xl">{item.title}</p>

        <p className="text-2xl font-bold text-left mt-8">${item.price}</p>
        <button className="mt-4 w-[90%] rounded-lg px-8 py-2 bg-[#ff165d] font-semibold text-white tracking-wide" onClick={() => getdata( item.aprice)}>
          <h1 className="font-mono text-sm ">Subscribe</h1>
        </button>
      </div>
      <h1 className="mt-2 ml-6 text-sm">This includes</h1>
      <ul className="mt-4 space-y-2 font-semibold text-sm">
        <li className="flex items-center space-x-4 ">
          <FaCheckCircle />
          <h1 className='tracking-wide'>{item.question}</h1>
        </li>
        <li className="flex items-center space-x-4 ">
          <FaCheckCircle />
          <h1 className='tracking-wide'>{item.books}</h1>
        </li>
        <li className="flex items-center space-x-4 ">
          <FaCheckCircle />
          <h1 className='tracking-wide'>{item.language}</h1>
        </li>
        <li className="flex items-center space-x-4 ">
          <FaCheckCircle />
          <h1 className='tracking-wide'>{item.ChatGPT}</h1>
        </li>
      </ul>
    </div>))}
  
  </>
</ul>

              
              
              </div> 

      </div>

   
   
   </>
  )
}
