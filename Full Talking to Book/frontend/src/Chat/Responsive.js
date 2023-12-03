// import React, { useState, useEffect } from 'react';

// export default function Responsive() {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleSendMessage = () => {
//     if (inputValue.trim() !== '') {
//       setMessages([...messages, { user: true, text: inputValue }]);
//       setInputValue('');
//       // You can add logic here to send the user's message to GPT and update the messages state with the GPT response.
//     }
//   };

//   useEffect(() => {
//     // Check screen size on mount and resize
//     const checkScreenSize = () => {
//       setIsSmallScreen(window.innerWidth <= 640); // Adjust the breakpoint as needed
//       // Close sidebar on small screens
//       if (isSmallScreen) {
//         setSidebarOpen(false);
//       }
//     };

//     checkScreenSize();

//     window.addEventListener('resize', checkScreenSize);

//     return () => {
//       window.removeEventListener('resize', checkScreenSize);
//     };
//   }, [isSmallScreen]);

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar - Display on large screens */}
//       {!isSmallScreen && (
//         <div className={`bg-gray-800 text-white h-full w-64 fixed top-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ease-in-out duration-300`}>
//           {/* Sidebar content goes here */}
//           <button onClick={toggleSidebar} className="p-4">Close Sidebar</button>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className={`flex-1 flex flex-col overflow-hidden ${isSidebarOpen && isSmallScreen ? 'ml-0' : 'ml-64'}`}>
//         {/* Navigation Bar - Display on small screens */}
//         {isSmallScreen && (
//           <header className="bg-gray-800 text-white p-4">
//             <button onClick={toggleSidebar} className="text-xl">&#9776; Open Sidebar</button>
//           </header>
//         )}

//         {/* Chat Interface */}
//         <div className="flex-1 flex flex-col bg-gray-200 p-4 overflow-y-auto">
//           {messages.map((message, index) => (
//             <div key={index} className={`mb-2 ${message.user ? 'self-end' : 'self-start'}`}>
//               <div className={`p-2 rounded-md ${message.user ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
//                 {message.text}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input Box */}
//         <div className="p-4 bg-gray-300">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={handleInputChange}
//             placeholder="Type your message..."
//             className="w-full p-2 border rounded-md"
//           />
//           <button onClick={handleSendMessage} className="mt-2 p-2 bg-blue-500 text-white rounded-md">Send</button>
//         </div>
//       </div>

//       {/* Sidebar - Display on small screens */}
//       {isSmallScreen && (
//         <div className={`bg-gray-800 text-white h-full w-64 fixed top-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ease-in-out duration-300`}>
//           {/* Sidebar content goes here */}
//           <button onClick={toggleSidebar} className="p-4">Close Sidebar</button>
//         </div>
//       )}
//     </div>
//   );
// }

// ChatGPTComponent.js

// import React, { useState } from 'react';

// const Responsive = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   const handleSendMessage = () => {
//     if (inputValue.trim() === '') return;

//     // Add the user message to the chat
//     setMessages([...messages, { text: inputValue, type: 'user' }]);
//     setInputValue('');

//     // Simulate GPT response (in a real scenario, you'd interact with an API)
//     setTimeout(() => {
//       setMessages([...messages, { text: 'GPT response...', type: 'bot' }]);
//     }, 500);
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-gray-800 text-white p-4">
//         <div className="text-3xl font-bold mb-4">ChatGPT</div>
//         {/* Add additional sidebar content here */}
//       </div>

//       {/* Chat area */}
//       <div className="flex-1 flex flex-col bg-gray-200">
//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`mb-4 ${
//                 message.type === 'user' ? 'text-right' : 'text-left'
//               }`}
//             >
//               <div
//                 className={`p-3 rounded-lg ${
//                   message.type === 'user'
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-300 text-gray-800'
//                 }`}
//               >
//                 {message.text}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input area */}
//         <div className="p-4 bg-white">
//           <div className="flex">
//             <input
//               type="text"
//               className="flex-1 border rounded-l p-3"
//               placeholder="Type a message..."
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//             />
//             <button
//               className="bg-blue-500 text-white px-6 rounded-r"
//               onClick={handleSendMessage}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Responsive;


// ChatGPTComponent.js responiv

// import React, { useState } from 'react';

// const Responsive = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   const handleSendMessage = () => {
//     if (inputValue.trim() === '') return;

//     // Add the user message to the chat
//     setMessages([...messages, { text: inputValue, type: 'user' }]);
//     setInputValue('');

//     // Simulate GPT response (in a real scenario, you'd interact with an API)
//     setTimeout(() => {
//       setMessages([...messages, { text: 'GPT response...', type: 'bot' }]);
//     }, 500);
//   };

//   return (
//     <div className="flex flex-col h-screen md:flex-row">
//       {/* Sidebar */}
//       <div className="md:w-1/4 bg-gray-800 text-white p-4">
//         <div className="text-3xl font-bold mb-4">ChatGPT</div>
//         {/* Add additional sidebar content here */}
//       </div>

//       {/* Chat area */}
//       <div className="md:flex-1 flex flex-col bg-gray-200">
//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`mb-4 ${
//                 message.type === 'user' ? 'text-right' : 'text-left'
//               }`}
//             >
//               <div
//                 className={`p-3 rounded-lg ${
//                   message.type === 'user'
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-300 text-gray-800'
//                 }`}
//               >
//                 {message.text}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input area */}
//         <div className="p-4 bg-white">
//           <div className="flex">
//             <input
//               type="text"
//               className="flex-1 border rounded-l p-3"
//               placeholder="Type a message..."
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//             />
//             <button
//               className="bg-blue-500 text-white px-6 rounded-r"
//               onClick={handleSendMessage}
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Responsive;



// Responsive.js

// import React, { useState, useEffect } from 'react';

// export default function Responsive() {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleSendMessage = () => {
//     if (inputValue.trim() !== '') {
//       setMessages([...messages, { user: true, text: inputValue }]);
//       setInputValue('');
//       // You can add logic here to send the user's message to GPT and update the messages state with the GPT response.
//     }
//   };

//   const handleNewChat = () => {
//     // Implement logic to start a new chat
//     alert('Starting a new chat!');
//   };

//   useEffect(() => {
//     // Check screen size on mount and resize
//     const checkScreenSize = () => {
//       setIsSmallScreen(window.innerWidth <= 640); // Adjust the breakpoint as needed
//       // Close sidebar on small screens
//       if (isSmallScreen) {
//         setSidebarOpen(false);
//       }
//     };

//     checkScreenSize();

//     window.addEventListener('resize', checkScreenSize);

//     return () => {
//       window.removeEventListener('resize', checkScreenSize);
//     };
//   }, [isSmallScreen]);

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar - Display on large screens */}
//       {!isSmallScreen && (
//         <div className={`bg-gray-800 text-white h-full w-64 fixed top-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ease-in-out duration-300`}>
//           {/* Sidebar content goes here */}
//           <button onClick={toggleSidebar} className="p-4">Close Sidebar</button>
//           <button onClick={handleNewChat} className="p-4 mt-4">New Chat</button>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className={`flex-1 flex flex-col overflow-hidden ${isSidebarOpen && isSmallScreen ? 'ml-0' : 'ml-64'}`}>
//         {/* Navigation Bar - Display on small screens */}
//         {isSmallScreen && (
//           <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
//             <button onClick={toggleSidebar} className="text-xl">&#9776; Open Sidebar</button>
//             <button onClick={handleNewChat} className="text-xl">New Chat</button>
//           </header>
//         )}

//         {/* Chat Interface */}
//         <div className="flex-1 flex flex-col bg-gray-200 p-4 overflow-y-auto h-full">
//           {messages.map((message, index) => (
//             <div key={index} className={`mb-2 ${message.user ? 'self-end' : 'self-start'}`}>
//               <div className={`p-2 rounded-md ${message.user ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
//                 {message.text}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input Box */}
//         <div className="p-4 bg-gray-300">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={handleInputChange}
//             placeholder="Type your message..."
//             className="w-full p-2 border rounded-md"
//           />
//           <button onClick={handleSendMessage} className="mt-2 p-2 bg-blue-500 text-white rounded-md">Send</button>
//         </div>
//       </div>

//       {/* Sidebar - Display on small screens */}
//       {isSmallScreen && (
//         <div className={`bg-gray-800 text-white h-full w-64 fixed top-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform ease-in-out duration-300`}>
//           {/* Sidebar content goes here */}
//           <button onClick={toggleSidebar} className="p-4">Close Sidebar</button>
//           <button onClick={handleNewChat} className="p-4 mt-4">New Chat</button>
//         </div>
//       )}
//     </div>
//   );
// }




///another



// ChatGPTComponent.js

import React, { useState } from 'react';

const Responsive = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    setMessages([...messages, { text: inputValue, type: 'user' }]);
    setInputValue('');

    setTimeout(() => {
      setMessages([...messages, { text: 'GPT response...', type: 'bot' }]);
    }, 500);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-gray-800 text-white p-4 ${
          isSidebarOpen ? 'block' : 'lg:w-[20%] hidden'
        }`}
      >
        <div className="flex justify-between">
          {/* Cross button to close the sidebar */}
          <button className="lg:hidden text-white" onClick={toggleSidebar}>
            Cross
          </button>

          <div className="text-3xl font-bold mb-4">ChatGPT</div>
        </div>
        {/* Add additional sidebar content here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-200 h-full w-[70%]">
        {/* Navbar */}
        <div className="bg-gray-800 text-white h-10 p-4 md:hidden">
          <button className="text-gray-300 text-xl" onClick={toggleSidebar}>
            {isSidebarOpen ? 'Close' : 'Open'} Sidebar
          </button>
        </div>

        {/* Chat area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 bg-white">
          <div className="flex">
            <input
              type="text"
              className="flex-1 border rounded-l p-3"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-6 rounded-r"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Responsive;



// https://chat.openai.com/share/5983df9b-4c92-4547-b599-8ead3f06ebf9