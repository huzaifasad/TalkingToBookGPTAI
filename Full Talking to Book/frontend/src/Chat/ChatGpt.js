import React, { useState, useRef, useEffect } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { CiUser } from "react-icons/ci";
import { useAuthState } from "react-firebase-hooks/auth"; // Import useAuthState
import { FaRobot } from "react-icons/fa";
import { auth, provider, signInWithPopup, signOut } from "../firebase"; // Update the path
import { Link } from "react-router-dom";
import { IoLogInOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import myImage from "../logo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdExpandCircleDown } from "react-icons/md";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Progress,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Select,
  Option,
} from "@material-tailwind/react";

export default function ChatGpt() {
  const [inputValue, setInputValue] = useState("");
  const [chat, setChat] = useState([]);
  const chatContainerRef = useRef();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [jsutcheck, setjustcheck] = useState([]);
  const [promptCount, setPromptCount] = useState(0); // Prompt count state
  const [promptLimit, setPromptLimit] = useState(10); // Set initial prompt limit
  const [user, setUser] = useState(null); // Add user state
  const [selectedBook, setSelectedBook] = useState(null); // New state for selected book
  const [users, loading] = useAuthState(auth); // Use useAuthState hook to get the user
  const [username, setusername] = useState(null);
  const [bname, setbname] = useState();
  const [aname, setaname] = useState();
  const [uplan, setuplan] = useState();
  const [bookCount, setbookcount] = useState();
  const [countquestion, setcountquestion] = useState();
  const [uplansdate, setuplansdate] = useState();
  const [uplanedate, setuplanedata] = useState();
  const [uplanballow, setuplanballow] = useState();
  const [uplanqallow, setuplanqallow] = useState();
  const [questionct, setquestionct] = useState(1);
  const [isResponseProcessing, setIsResponseProcessing] = useState(false);
  const [usernotlogecount, setusernotloecount] = useState(1);
  const [isSignUpDialogOpen, setIsSignUpDialogOpen] = useState(false);
  // const [uplan, setuplan] = useState();
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
    // alert(selectedValue)
  };
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // Default language set to English
  const handleLanguageChange = (event) => {
    if (event.target && event.target.value) {
      setSelectedLanguage(event.target.value);
      // alert(event.target.value
    }
  };

  const [product, setProduct] = useState([]);
  const [userdata, setuserdata] = useState([]);
  const [bimgurl, setbimgurl] = useState();
  const [xuserid, setxuserid] = useState();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  const updatequestionnumber = async () => {
    const data = {
      uid: xuserid,
    };
    try {
      const response = await fetch(" https://f90c-121-91-60-182.ngrok-free.app/add/question/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      readdata(xuserid);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addBookData = async () => {
    // alert(bookCount);
    // alert(uplanballow);
    // alert("title:", xuserid);
    // alert("author:", aname);
    // alert("imageUrl:", bname);

    if (bookCount <= uplanballow || uplanballow === "unlimited") {
      const data = {
        uid: xuserid,
        author: aname,
        imageUrl: bimgurl,
        title: bname,
      };

      try {
        const response = await fetch(" https://f90c-121-91-60-182.ngrok-free.app/add/book/info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        readdata(xuserid);
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("You Exceed the limit");
    }
  };

  // Call the function to send the data

  const [openX, setOpenX] = React.useState(false);
  const handleOpenX = () => setOpenX((cur) => !cur);
  const SignInDialog = ({ onSignIn }) => {
    return (
      showSignInDialog && (
        <div className="dialog">
          <p>Prompt limit exceeded. Please sign in for more discussions.</p>
          <button onClick={onSignIn}>Sign In with Google</button>
        </div>
      )
    );
  };
  const bookdata = [
    {
      title: "The Millionaire Next Door",
      Published: "1996",
      Genre: "Finance",
      author: "Thomas J. Stanley and William D. Danko",
    },
    {
      title: "Rich Dad Poor Dad",
      Published: "1997",
      Genre: "Personal Finance, Self-help",
      author: "Robert T. Kiyosaki",
      imgurl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbc5iREKtgv7S00EnrIUbsQs_9jq7uVkVPzA&usqp=CAU",
    },
  ];
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const signedInUser = result.user;
      setUser(signedInUser);

      // Get the user details
      const userId = signedInUser.uid;
      const userEmail = signedInUser.email;
      const userName = signedInUser.displayName;
      const userData = {
        uid: signedInUser.uid,
        email: signedInUser.email,
        displayName: signedInUser.displayName,
        // Add more fields as needed
      };
      const response = await fetch(" https://f90c-121-91-60-182.ngrok-free.app/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const resultData = await response.json();
        console.log(resultData); // Log the response from the server
        // Handle success on the client side if needed
        // alert("data inserted");

      } else {
        console.error("Failed to add document:", response.statusText);
        // Handle error on the client side if needed
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  const googleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);

      // Reset prompt limit when the user signs out
      setPromptLimit(10);

      // alert("User signed out");
    } catch (error) {
      console.error("Sign-Out Error:", error.message);
    }
  };

  const handlenouser = () => {
    if (!users && !localStorage.getItem("userLoggedIn")) {
      // User is not logged in and 'userLoggedIn' key is not present in LocalStorage
      alert("You are not logged in. Please sign in for more access.");
      localStorage.setItem("userLoggedIn", usernotlogecount);
    }
  };

  const handlesend = async () => {
    setIsResponseProcessing(true); // Disable input

    try {
      if (!users) {
        // User is not logged in
        const remainingQuestions =
          localStorage.getItem("remainingQuestions") || 2;

        if (remainingQuestions <= 0) {
          alert(
            "Question limit exceeded. Please sign in or upgrade for more prompts."
          );
          setIsButtonDisabled(false);
          handleOpen();
          return;
        }

        // If questions are remaining, decrement the count in local storage
        localStorage.setItem("remainingQuestions", remainingQuestions - 1);
      }

      if (users) {
        if (countquestion <= uplanqallow || uplanqallow === "unlimited") {
          // alert(questionct);
          // alert(uplanqallow);
          // alert(countquestion);
        } else {
          alert("you exceded the limid");
          return;
        }
      }
      if (inputValue.trim()) {
        setChat([...chat, { role: "user", content: inputValue }]);
      }

      setInputValue("");
      if (selectedBook) {
        setIsButtonDisabled(true); // Disable user input while waiting for the response
        const message = ` ${inputValue} Author of the selected book: ${selectedBook.author}  Title :${selectedBook.title} in the ${selectedValue} language`;

        const response = await fetch(" https://f90c-121-91-60-182.ngrok-free.app/api/chat", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
          }),
        });
        // const reader = response.body.getReader();
        // let messageBuffer = "";
        const readData = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let aiRes = '';
        while (true) {
          const { done, value } = await readData.read();
          if (done) {
            break;
          }
          aiRes += value;
          setChat([...chat, { role: 'user', content: inputValue }, { role: 'assistant', content: aiRes }]);
        }
        // while (true) {
        //   console.log("Before while loop");

        //   const { done, value } = await reader.read();

        //   if (done) {
        //     break;
        //   }

        //   const chunk = new TextDecoder().decode(value);
        //   messageBuffer += chunk;
        //   console.log(messageBuffer);

        //   setChat([
        //     ...chat,
        //     { role: "user", content: inputValue },
        //     { role: "assistant", content: messageBuffer },
        //   ]);

        //   const messageIndex = messageBuffer.indexOf("\n");
        //   if (messageIndex >= 0) {
        //     const completeMessage = messageBuffer.substring(0, messageIndex);
        //     messageBuffer = messageBuffer.substring(messageIndex + 1);

        //     console.log("Complete message:", completeMessage);

        //     if (completeMessage.trim() !== "") {
        //       setChat((prevChat) => [
        //         ...prevChat,
        //         { role: "assistant", content: completeMessage },
        //       ]);
        //     }
        //   }
        // }
      } else {
        const message = `Provide information on books related to ${inputValue} in just 40 words in the ${selectedValue} language`;
        setIsButtonDisabled(true); // Disable user input while waiting for the response

        const response = await fetch(" https://f90c-121-91-60-182.ngrok-free.app/api/chat", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
          }),
        });
        // const reader = response.body.getReader();
        // let messageBuffer = "";
        const readData = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let aiRes = '';
        while (true) {
          const { done, value } = await readData.read();
          if (done) {
            break;
          }
          aiRes += value;
          setChat([...chat, { role: 'user', content: inputValue }, { role: 'assistant', content: aiRes }]);
        }
        // while (true) {
        //   console.log("Before while loop");

        //   const { done, value } = await reader.read();

        //   if (done) {
        //     break;
        //   }

        //   const chunk = new TextDecoder().decode(value);
        //   messageBuffer += chunk;
        //   console.log(messageBuffer);

        //   setChat([
        //     ...chat,
        //     { role: "user", content: inputValue },
        //     { role: "assistant", content: messageBuffer },
        //   ]);

        //   const messageIndex = messageBuffer.indexOf("\n");
        //   if (messageIndex >= 0) {
        //     const completeMessage = messageBuffer.substring(0, messageIndex);
        //     messageBuffer = messageBuffer.substring(messageIndex + 1);

        //     console.log("Complete message:", completeMessage);

        //     if (completeMessage.trim() !== "") {
        //       setChat((prevChat) => [
        //         ...prevChat,
        //         { role: "assistant", content: completeMessage },
        //       ]);
        //     }
        //   }
        // }
      }
      setIsButtonDisabled(false); // Enable user input after receiving the response
      setPromptCount((prevCount) => prevCount + 1);
      //there
      setquestionct(questionct + 1);
      setusernotloecount(usernotlogecount + 1);
      // alert(usernotlogecount);
      if (users) {
        // alert("this run");
        updatequestionnumber();
      }
    } catch (error) {
      console.error("Error fetching chat response:", error);
    } finally {
      setIsResponseProcessing(false); // Enable input
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      handlesend();
    }
  };
  const handlebookdata = (title, author) => {
    handlesendbookdata(title, author);
  };
  const handlesendbookdata = async (title, author) => {
    // alert(title);
    setSelectedBook({
      title: title,
      author: author,
    });
    setIsResponseProcessing(true); // Disable input

    try {
      if (!users) {
        // User is not logged in
        const remainingQuestions =
          localStorage.getItem("remainingQuestions") || 2;

        if (remainingQuestions <= 0) {
          alert(
            "Question limit exceeded. Please sign in or upgrade for more prompts."
          );
          setIsButtonDisabled(false);
          handleOpen();
          return;
        }

        // If questions are remaining, decrement the count in local storage
        localStorage.setItem("remainingQuestions", remainingQuestions - 1);
      }

      if (users) {
        if (countquestion <= uplanqallow || uplanqallow === "unlimited") {
          // alert(questionct);
          // alert(uplanqallow);
          // alert(countquestion);
        } else {
          alert("you exceded the limid");
          return;
        }
      }

      setInputValue("");

      const message = `Provide information on books related by which author is  ${selectedBook.author} and title is ${selectedBook.title} in the ${selectedValue} language`;
      setIsButtonDisabled(true); // Disable user input while waiting for the response

      const response = await fetch(" https://f90c-121-91-60-182.ngrok-free.app/api/chat", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer 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",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        }),
      });
      const reader = response.body.getReader();
      let messageBuffer = "";

      while (true) {
        console.log("Before while loop");

        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = new TextDecoder().decode(value);
        messageBuffer += chunk;
        console.log(messageBuffer);

        setChat([
          ...chat,
          { role: "user", content: title },
          { role: "assistant", content: messageBuffer },
        ]);

        const messageIndex = messageBuffer.indexOf("\n");
        if (messageIndex >= 0) {
          const completeMessage = messageBuffer.substring(0, messageIndex);
          messageBuffer = messageBuffer.substring(messageIndex + 1);

          console.log("Complete message:", completeMessage);

          if (completeMessage.trim() !== "") {
            setChat((prevChat) => [
              ...prevChat,
              { role: "assistant", content: completeMessage },
            ]);
          }
        }
      }

      setIsButtonDisabled(false); // Enable user input after receiving the response
      setPromptCount((prevCount) => prevCount + 1);
      //there
      setquestionct(questionct + 1);
      setusernotloecount(usernotlogecount + 1);
      // alert(usernotlogecount);
      if (users) {
        // alert("this run");
        updatequestionnumber();
      }
    } catch (error) {
      console.error("Error fetching chat response:", error);
    } finally {
      setIsResponseProcessing(false); // Enable input
    }
    //working htere
  };

  const readdata = async (id) => {
    try {
      let result = await fetch(` https://f90c-121-91-60-182.ngrok-free.app/read/book/info/${id}`);
      result = await result.json();
      if (Array.isArray(result.books)) {
        setProduct(result.books);
      } else {
        console.error("Invalid response format:", result);
      }
      // console.log(result);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };
  const allreaddata = async (id) => {
    try {
      let result = await fetch(` https://f90c-121-91-60-182.ngrok-free.app/read/all/info/${id}`);
      result = await result.json();

      if (Array.isArray(result.books)) {
        // Update the state with books and additional properties
        setuserdata({
          books: result.books,
          plantype: result.plantype || "", // Default to empty string if undefined
          planid: result.planid || "", // Default to empty string if undefined
          planstartdate: result.planstartdate || "", // Default to empty string if undefined
          planEndDate: result.planEndDate || "", // Default to empty string if undefined
          questionsAllowed: result.questionsAllowed,
          questionCount: result.questionCount,
        });
        setuplan(result.plantype);
        setuplanballow(result.bookAllowed);
        setuplanedata(result.planEndDate);
        setuplansdate(result.planstartdate);
        setuplanqallow(result.questionsAllowed);
        setcountquestion(result.questionCount);
        setbookcount(result.bookCount);

        // console.log('Books:', uplan);
        console.log("Plan Type:  this from the states", uplan);
        console.log("Plan Start Date:", uplansdate);
        console.log("Plan End Date:", uplanedate);
        console.log("Books Allowed:", uplanballow);
        console.log("Questions Allowed", uplanqallow);
        console.log("How Many Questions now ", countquestion);
        console.log("How Many Books You Are Allowed", bookCount);
      } else {
        console.error("Invalid response format:", result);
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  const deletebooks = async (title) => {
    // alert("this run");
    // alert(title);
    // alert(xuserid);
    let result = await fetch(
      ` https://f90c-121-91-60-182.ngrok-free.app/delete/book/${xuserid}/${title}`,
      {
        method: "delete",
      }
    );
    result = await result.json();
    if (result) {
      // getProducts();
      readdata(xuserid);
    }
  };

  const renderAuthButton = () => {
    if (users) {
      return (
        // <div className="flex relative">
        //   <button
        //     onClick={googleSignOut}
        //     className="border w-[88%] m-2 mt-3 py-2 flex px-4 text-1xl rounded-md"
        //   >
        //     <IoLogInOutline className="text-2xl mr-2" />
        //     <h2>{username}</h2>
        //   </button>
        // </div>
        <div className="flex relative">
          <Menu>
            <MenuHandler>
              <Button className="flex w-[88%] justify-center items-center  ml-3 mt-3 bg-[#1a1f22] border">
                {" "}
                <IoLogInOutline className="text-2xl mr-5" />
                {username}{" "}
              </Button>
            </MenuHandler>
            <MenuList className="z-[1000000] w-64 mb-10 bg-[#1a1f22] text-white">
              <MenuItem onClick={googleSignOut}>Log Out</MenuItem>
              <MenuItem>Help</MenuItem>
            </MenuList>
          </Menu>
        </div>
      );
    } else {
      return (
        <div className="px-3">
          <button
            onClick={googleSignIn}
            className="border border-[#737474] w-full  mt-3 py-2 flex  text-1xl rounded-md"
          >
            <IoLogInOutline className="text-2xl mr-2" />
            <h1>Sign In </h1>
          </button>
        </div>
      );
    }
  };

  const examples = [];

  useEffect(() => {
    // Scroll to the bottom of the chat when the chat updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (users) {
      // alert(`Welcome, ${users.displayName || users.email}`);
      setusername(users.displayName || users.email);
      setxuserid(users.uid);
      readdata(users.uid); // Pass the user id to the readdata function
      allreaddata(users.uid);
      // console.log('All user plan'+userdata)
      console.log("Following are the Books Details");
    } else {
      console.error("User not found in Firestore");
    }

    console.log("Chat State in useEffect:", chat);
  }, [chat, users, promptCount,selectedLanguage]);
  const[sidebar,setsidebar]=useState(true)
  
  const toggleSidebar = () => {
    setsidebar(!sidebar);
  };
  return (
    <div className="h-screen w-screen bg-[#181a1d] flex relative">
<div className={`lg:w-[20%] bg-[#1d262d] h-screen text-yellow-50 `}>
      
        <div className="text-center h-[10%] border-b border-[#737474] w-full">
          <img
            src={`${myImage}`}
            alt=""
            className="w-[80%] h-full object-cover object-center mx-auto "
          />
        </div>

        <div className=" z-50 mb-5 h-[5%] pt-4">
          {/* <button className="w-full h-[50px] border  rounded-lg  bg-[#000000]">
            
          </button> start*/}

          {users ? (
            <>
              <div className="px-3">
                <button
                  onClick={handleOpenX}
                  variant="gradient"
                  className="mt-1 border-[#737474] w-full border rounded-md py-2 text-start px-3 text-xm font-hairline"
                >
                  + New Book
                </button>
              </div>
              <Dialog
                size="xs"
                open={openX}
                handler={handleOpenX}
                className="bg-transparent shadow-none"
              >
                <Card className="mx-auto w-full max-w-[24rem] bg-[#2b282899] text-white">
                  <CardBody className="flex flex-col gap-4">
                    <Typography variant="h4" color="blue-white">
                      Add Your Favoirite Book
                    </Typography>
                    <Typography
                      className="mb-3 font-normal"
                      variant="paragraph"
                      color="gray"
                    >
                      Enter Book Details
                    </Typography>
                    <Typography className="-mb-2" variant="h6">
                      Book Name
                    </Typography>
                    <Input
                      label="Book Name"
                      size="lg"
                      onChange={(e) => setbname(e.target.value)}
                    />
                    <Typography className="-mb-2" variant="h6">
                      Author Name
                    </Typography>
                    <Input
                      label="Name of Author"
                      size="lg"
                      onChange={(e) => setaname(e.target.value)}
                    />
                    <Typography className="-mb-2" variant="h6">
                      Link of Cover Photo
                    </Typography>
                    <Input
                      label="Cover of Book"
                      size="lg"
                      onChange={(e) => setbimgurl(e.target.value)}
                    />
                  </CardBody>
                  <CardFooter className="pt-0">
                    <Button
                      variant="gradient"
                      onClick={() => {
                        handleOpenX();
                        addBookData();
                      }}
                      fullWidth
                    >
                      Add Book
                    </Button>
                  </CardFooter>
                </Card>
              </Dialog>
            </>
          ) : (
            <>
              <div className="px-3">
                <button
                  onClick={handleOpen}
                  variant="gradient"
                  className="mt-1 border-[#737474] w-full border rounded-md py-2 text-start px-3 text-xm font-hairline"
                >
                  + New Book
                </button>
              </div>
              <Dialog
                open={open}
                handler={handleOpen}
                className=" bg-[#1d262d] text-white text-center h-56 border border-solid border-[#737474] "
                type
                size="sm"
              >
                <DialogHeader className="text-white flex items-center justify-center mb-10 mt-5 relative">
                  Sign in with Google
                </DialogHeader>
                {/* <DialogBody>
        Sign in with Google

        </DialogBody> */}
                <DialogFooter>
                  <Button
                    onClick={googleSignIn}
                    size="sm"
                    color="blue-gray"
                    className="flex items-center mx-auto  bg-white text-black gap-3 border-none"
                  >
                    <img
                      src="https://docs.material-tailwind.com/icons/google.svg"
                      alt="metamask"
                      className="h-6 w-6 mr-3"
                    />
                    Continue with Google
                  </Button>
                </DialogFooter>
              </Dialog>
            </>
          )}

          {/* new for the book adding  */}

          {/* openbookmenu */}

          {/* end */}
        </div>
        <div className="h-[70%]   py-5 text-center px-2 overflow-scroll hide-scroll-bar shadow-lg ">
          {users ? (
            <>
              {product.map((item, index) => (
                <>
                  <div key={index}>
                    <button
                      className="flex items-center justify-between py-3 w-full text-left pl-4 pr-2 hover:bg-[#0c191f] h-14 mb-2"
                      // onClick={() => handlebookdata(item.Author,item.Genre,item.Published,item.title)}
                    >
                      <div className="flex items-center">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbc5iREKtgv7S00EnrIUbsQs_9jq7uVkVPzA&usqp=CAU"
                          alt=""
                          className="p-1"
                          style={{
                            height: "100%",
                            width: "40px",
                            objectFit: "cover",
                            objectPosition: "left",
                          }}
                        />
                        <span
                          className="ml-4"
                          onClick={() =>
                            handlebookdata(item.title, item.author)
                          }
                        >
                          {item.title}
                        </span>
                      </div>
                      <button
                        className="ml-4 text-2xl text-white"
                        onClick={() => deletebooks(item.title)}
                      >
                        <MdDelete />
                      </button>
                    </button>

                    {/* {users && (
  <div
    className="border fixed w-64 ml-1 mr-1  h-32 bg-green-600 px-3 py-4"
    style={{
      zIndex: 10000,
      bottom: "80px",
      left: "3px",
      transform: "",
    }}
  >
    {uplan === "free" && (
      <>
        <h2>{promptCount}/30 Question </h2>
        <Progress value={(promptCount / 30) * 100} className=" text-white" />
        <Link
          to={`/pricing`}
          className="block bg-white text-green-600 rounded-md border p-2 mt-4"
        >
          Upgrade
        </Link>
      </>
    )}
    {uplan === "plus" && (
      <>
        <h2>{promptCount}/{uplanqallow} Questions </h2>
        <Progress value={(promptCount / uplanqallow) * 100} className=" text-white" />
        <Link
          to={`/pricing`}
          className="block bg-white text-green-600 rounded-md border p-2 mt-4"
        >
          Upgrade
        </Link>
      </>
    )}
    {uplan === "genius" || uplan === "premium" && (
      <>
        <h2>You have unlimited questions</h2>
      </>
    )}
  </div>
)} */}
                    <div
                      className=" fixed w-72 ml-1 mr-1 bg-green-600  mb-7 rounded-xl"
                      style={{
                        zIndex: 100,
                        bottom: "80px",
                        // left: "3px",
                        transform: "",
                      }}
                    >
                      {users && uplan ? (
                        <>
                          {uplan === "free" ? (
                            <>
                              <h2>{promptCount}/30 Question </h2>
                              <Progress
                                value={(promptCount / 30) * 100}
                                className="text-white"
                              />
                              <h1 className="block bg-white text-green-600 rounded-md border p-2 mt-4">
                                You Have Free Plan
                              </h1>
                            </>
                          ) : uplan === "plus" ? (
                            <>
                              <h2>
                                {countquestion}/{uplanqallow} Questions{" "}
                              </h2>
                              <Progress
                                value={(countquestion / uplanqallow) * 100}
                                className="text-white"
                              />
                              <h1 className="block bg-white text-green-600 rounded-md border p-2 mt-4">
                                You Have Plus Plan
                              </h1>
                            </>
                          ) : (
                            <p className="bg-[#45494b] border px-4 py-3 rounded-lg border-none">
                              You have unlimited questions
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="bg-blue-500 hover:bg-blue-700 text-white w-full rounded h-10">
                         <Link to='/pricing'><h1>Upgrade</h1></Link> 
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ))}
            </>
          ) : (
            <>
              {bookdata.map((item, index) => (
                <>
                  <div key={index}>
                    <button
                      className="flex items-center py-3 w-full text-left pl-10 hover:bg-[#0c191f] h-14 mb-2"
                      onClick={() => handlebookdata(item.title, item.author)}
                    >
                      <div className="flex items-center">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbc5iREKtgv7S00EnrIUbsQs_9jq7uVkVPzA&usqp=CAU"
                          alt=""
                          className="p-1"
                          style={{
                            height: "100%",
                            width: "40px",
                            objectFit: "cover",
                            objectPosition: "left",
                          }}
                        />
                        <span className="ml-2">{item.title}</span>
                      </div>
                    </button>
                  </div>
                </>
              ))}
            </>
          )}

          <button></button>
        </div>
        <div className="  h-[6%] border-t-2 border-[#737474]  text-center">
          {renderAuthButton()}
        </div>
      </div>
      <div className="lg:w-[80%] w-[100%] bg-[#2a3742] text-white">
        <div className="h-[10%] border-b border-[#737474] ">
          {/* <div className="w-60 bg-[#161c20] absolute top-3 right-6">
            <Select
              label="Select Language"
              className="text-[#737474] border-none focus:outline-none"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <Option
                className="bg-[your-dropdown-background-color] text-[your-dropdown-text-color]"
                value="French"
              >
                French
              </Option>
              <Option
                className="bg-[your-dropdown-background-color] text-[your-dropdown-text-color]"
                value="English"
              >
                English
              </Option>
            </Select>
          </div> */}
           <div className=" inline-block text-left ">
   
        {users ? (
  uplan ? (
    // If users and uplan exist, show nothing
    <></>
  ) : (
    // If users exist but no uplan, show the menu
    <Menu>
<MenuHandler>
  <Button className="flex w-72 justify-center items-center  ml-3 mt-3 h-12 bg-[#2a3742]">
    {" "}
  
   <h1>ChatGPT 3.5</h1><IoMdArrowDropdown  className="text-2xl ml-5"/>

  </Button>
</MenuHandler>
<MenuList className="z-[1000000] w-64 mb-10 bg-[#1a1f22] text-white">
  {/* <MenuItem onClick={googleSignOut}>Log Out</MenuItem> */}
  {/* <MenuItem className="border-b-1 m-0 flex justify-center items-center hover:bg-[#1a1f22]"> */}
  <div className="border-b px-2 py-3 m-0 flex justify-start ml-3 items-center hover:bg-[#1a1f22]">
   <h1 className="">ChatGPT 3.5</h1><MdExpandCircleDown   className="text-1xl ml-5"/>
   </div>
   {/* </MenuItem> */}
   <div className="hover:bg-blue-gray-800 px-2 py-4 mt-1">
   <h1 className="flex items-center justify-start mt-2 ml-3">GPT4</h1>
  {/* <MenuItem   className=" flex justify-center items-center"> */}
   <Link to={'pricing'}>
  <button className="mt-4 w-[90%] rounded-lg px-8 py-2 bg-[#ff165d] font-semibold text-white tracking-wide">
<h1 className="font-mono text-sm ">Subscribe</h1>
</button> 
</Link>  
</div>           
  {/* </MenuItem> */}
</MenuList> 
</Menu>
  )
) : (
  // If no users, show nothing
  <></>
)}

      <select
        className="form-select appearance-none bg-[#2c302f] border border-gray-400 text-gray-700 py-2 pl-4 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-300 absolute top-3 right-3"
        value={selectedValue}
        onChange={handleSelectChange}
      >
       
       <option value="Afrikaans">Afrikaans</option>
<option value="Arabic">Arabic</option>
<option value="Armenian">Armenian</option>
<option value="Azerbaijani">Azerbaijani</option>
<option value="Belarusian">Belarusian</option>
<option value="Bosnian">Bosnian</option>
<option value="Bulgarian">Bulgarian</option>
<option value="Catalan">Catalan</option>
<option value="Chinese">Chinese</option>
<option value="Croatian">Croatian</option>
<option value="Czech">Czech</option>
<option value="Danish">Danish</option>
<option value="Dutch">Dutch</option>
<option value="English">English</option>
<option value="Estonian">Estonian</option>
<option value="Finnish">Finnish</option>
<option value="French">French</option>
<option value="Galician">Galician</option>
<option value="German">German</option>
<option value="Greek">Greek</option>
<option value="Hebrew">Hebrew</option>
<option value="Hindi">Hindi</option>
<option value="Hungarian">Hungarian</option>
<option value="Icelandic">Icelandic</option>
<option value="Indonesian">Indonesian</option>
<option value="Italian">Italian</option>
<option value="Japanese">Japanese</option>
<option value="Kannada">Kannada</option>
<option value="Kazakh">Kazakh</option>
<option value="Korean">Korean</option>
<option value="Latvian">Latvian</option>
<option value="Lithuanian">Lithuanian</option>
<option value="Macedonian">Macedonian</option>
<option value="Malay">Malay</option>
<option value="Marathi">Marathi</option>
<option value="Maori">Maori</option>
<option value="Nepali">Nepali</option>
<option value="Norwegian">Norwegian</option>
<option value="Persian">Persian</option>
<option value="Polish">Polish</option>
<option value="Portuguese">Portuguese</option>
<option value="Romanian">Romanian</option>
<option value="Russian">Russian</option>
<option value="Serbian">Serbian</option>
<option value="Slovak">Slovak</option>
<option value="Slovenian">Slovenian</option>
<option value="Spanish">Spanish</option>
<option value="Swahili">Swahili</option>
<option value="Swedish">Swedish</option>
<option value="Tagalog">Tagalog</option>
<option value="Tamil">Tamil</option>
<option value="Thai">Thai</option>
<option value="Turkish">Turkish</option>
<option value="Ukrainian">Ukrainian</option>
<option value="Urdu">Urdu</option>
<option value="Vietnamese">Vietnamese</option>
<option value="Welsh">Welsh</option>

      </select>
      <div className="pointer-events-none absolute  inset-y-0 right-0 flex items-center px-2 text-gray-700">
        {/* Dropdown arrow */}
        
      </div>

      {/* Display the selected value */}
      {/* {selectedValue && (
        <p className="mt-2 text-sm text-gray-600">Selected Value: {selectedValue}</p>
      )} */}
    </div>
        </div>
        {chat.length > 0 ? (
      <div className="h-[70%] overflow-scroll hide-scroll-bar pb-10" ref={chatContainerRef}>
      {chat.map((item, index) => (
        <div key={index} className={`w-[70%] mx-auto p-4 my-2 rounded-lg ${item.role === "user" ? "bg-blue-500 text-white self-start" : "bg-gray-800 text-white self-end"}`}>
          <div className="flex items-center">
            <div className={`w-8 h-8 mr-2 rounded-full ${item.role === "user" ? "bg-blue-700" : "bg-gray-700"}`}>
              {item.role === "user" ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <circle cx="12" cy="12" r="10" />
                  <path d="M14 10l4.5 4.5M14 10L12 2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 11c0 3.866-2.52 7-5.656 7a1 1 0 0 1-.832-1.554L5.293 15.88a9 9 0 1 0 9.798 0l1.781 1.79a1 1 0 0 1-1.396 1.416l-1.79-1.78a8.963 8.963 0 0 0-2.612-1.357A6.963 6.963 0 0 1 9 11z" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="font-semibold">{item.role === "" ? inputValue : ""}</h1>
              <p className="leading-loose" style={{ whiteSpace: "break-spaces" }}>
                {item.content.includes("\\n")
                  ? item.content.split("\\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                  : item.content.replace(/\\([\\n])/g, "$1").replace(/\\/g, "")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
    
     
        ) : (
          <div className="h-[70%]  flex flex-col justify-center items-center">
            <div className="mb-5">
              <h1 className="mt-5 text-4xl font-bold">
                <img src="" alt="" />
              </h1>
            </div>
            <div className="lg:flex lg:flex-wrap ml-10 mr-10">
              {examples.map((item, index) => (
                <div key={index} className="w-full lg:w-1/2 p-3">
                  <p className=" lg:p-3  sm:p-2 mt-2 cursor-pointer">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-[20%]  flex justify-center w-full items-center">
          <div className="relative flex items-center justify-center w-[70%] shadow-4xl">
            <input
              type="text"
              className={`w-full p-4 rounded-md pr-16 bg-[#2d3135] ${
                isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your text"
              onChange={handleChange}
              value={inputValue}
              onKeyPress={handleKeyPress}
              disabled={isButtonDisabled}
            />
            {!isButtonDisabled && (
              <LuSendHorizonal
                className="text-3xl text-white absolute cursor-pointer right-4 top-[1.5] bg-slate-600"
                onClick={handlesend}
              />
            )}
          </div>

          {/* <button>Click Me</button> */}
        </div>
      </div>
    </div>
  );
}
