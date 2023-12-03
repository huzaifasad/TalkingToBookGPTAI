import React, { useEffect, useId, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState
import { auth } from '../firebase';

import { Link, NavLink,  json, useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, getDocs, query, where ,updateDoc} from 'firebase/firestore'
export default function Success() {
  const [userId, setUserId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [users, loading] = useAuthState(auth); // Use useAuthState hook to get the user
  const navigate=useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      if (users) {
        const uid = users.uid;
        // setUserId(uid); // Set userId with the user's uid
        const db = getFirestore();
        const userExistsQuery = query(collection(db, 'users'), where('uid', '==', uid));
        alert(uid)
        const existingUserDocs = await getDocs(userExistsQuery);
  
        if (existingUserDocs.docs.length > 0) {
          const existingUserData = existingUserDocs.docs[0].data();
          const sessionID = existingUserData.subscription?.sessionID;
          const uxid = existingUserData.uxid; // Add this line to get the uxid
          setUserId(uxid)
          alert('this is  the uxid'+uxid)
          if (sessionID) {
            console.log('SessionID:', sessionID);
            setSessionId(sessionID);
            alert(sessionID);
          } else {
            console.log('SessionID not found in user data');
          }
        } else {
          console.log('User with the specified UID does not exist');
        }
      }
    };
  
    fetchData();
  }, [users]); // Remove userId and sessionId from the dependency array
  


  const handlePaymentSuccess = () => {
    fetch('http://localhost:529/api/v1/payment-success', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId: sessionId, uid: userId }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then((data) => {
        console.log(data.message);
        // Remove the sessionId from the state
        setSessionId('');
        // Navigate to the home page
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  
  // const handlePaymentSuccess = () => {
  //   fetch('http://localhost:529/api/v1/payment-success', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ sessionId: sessionId, firebaseID: userId }),
  //   })
  //     .then((res) => {
  //       if (res.ok) return res.json();
  //       return res.json().then((json) => Promise.reject(json));
  //     })
  //     .then((data) => {
  //       console.log(data.message);
  //       navigate('/');
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };
  

  return (
    <div>
      <>
        {/* component */}
        <div className="bg-gray-100 h-screen">
          <div className="bg-white p-6  md:mx-auto">
            <svg
              viewBox="0 0 24 24"
              className="text-green-600 w-16 h-16 mx-auto my-6"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              ></path>
            </svg>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                Payment Done!
              </h3>
              <p className="text-gray-600 my-2">
                Thank you for completing your secure online payment.
              </p>
              <p> Have a great day!</p>
              <div className="py-10 text-center">
              <button
  onClick={handlePaymentSuccess}
  className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
>
  Proceed
</button>

              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
