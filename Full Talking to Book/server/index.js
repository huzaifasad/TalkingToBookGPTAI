// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const moment = require("moment");

require('dotenv').config()
console.log(process.env.OPENAI_API_KEY)
  
const PORT = process.env.PORT || 3000;
// const {  , collection } = require('firebase/firestore');
const stripe = require("stripe")('sk_test_51ODvC1DVdv2HjLcj6AGT0Jdcck8pxemUpsJtFzxGY8FJsTqQrr4XBDpnQJ0CJ04EMVPbvQFPlfNPpehxXRfoYWT500bZDUyykI');
app.use(bodyParser.json());
app.use(express.json());

app.use(cors());
 
const userPromptCounts = new Map(); // Map to store user prompt counts
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} = require("firebase/firestore");
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_measurementId
};

const appfire = initializeApp(firebaseConfig);

const db = getFirestore(appfire);
const [free, plus, premium, genius] = [
  // "price_1O",
  // "price_",
  // "price_",
  // "price",
];
const userCollection = collection(db, "users");

//////user docs


app.get('/',(req,res)=>{
  res.write('Now We Deploy it')
})

app.post("/create", async (req, res) => {
  console.log('reached there')
  try {
    const data = req.body;
    const { uid } = req.body;

    // Check if the user with the specified uid already exists
    const userExistsQuery = query(userCollection, where("uid", "==", uid));
    const existingUserDocs = await getDocs(userExistsQuery);

    if (existingUserDocs.docs.length > 0) {
      // User already exists, handle accordingly (you can send an error response)
      // console.log('User with the specified UID already exists');
      const existingUser = existingUserDocs.docs[0].data();
   
      const existingUserData = existingUserDocs.docs[0].data();

      // Access the sessionID
      const sessionID = existingUserData.subscription?.sessionID;

      if (sessionID) {
        // Do something with the sessionID
      } else {
        // Handle the case where sessionID is not present
      }
      // Print all the data in the existing user document

      res.status(400).send("User with the specified UID already exists");
      return;
    }

    // Add the document to the collection
    const docRef = await addDoc(userCollection, data);
    const documentId = docRef.id;

    // Add the document ID to the data with the name "uxid"
    data.uxid = documentId;

    // Update the existing user document with the new data
    await updateDoc(docRef, data);

    // Send a success response with the document ID
    res.status(201).send({
      message: "Document added successfully",
      documentId: documentId,
      userId: data.uid,
    });
  } finally {
    // Code to run whether an error occurred or not
  }
});

app.post("/add/book/info", async (req, res) => {
  try {
    const data = req.body;
    const { uid, imageUrl, title, author } = req.body;

    // Check if the user exists
    const userExistsQuery = query(userCollection, where("uid", "==", uid));
    const existingUserDocs = await getDocs(userExistsQuery);

    if (existingUserDocs.docs.length > 0) {
      // User already exists, update the book count and add the book info
      const existingUserDoc = existingUserDocs.docs[0];
      const existingUserData = existingUserDoc.data();

      // Increment the book count
      const bookCount = (existingUserData.bookCount || 0) + 1;

      // Update the user document with the new book info and book count
      await updateDoc(existingUserDoc.ref, {
        books: [...(existingUserData.books || []), { title, author, imageUrl }],
        bookCount,
      });

      res.status(200).json({ message: "Book added successfully.", bookCount });
    } else {
      // User not found
      res.status(404).send("User with the specified UID not found.");
    }
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete/book/:uid/:title", async (req, res) => {
  const { uid, title } = req.params;

  // Query the Firestore collection to get the user document
  const userQuery = query(userCollection, where("uid", "==", uid));
  const userDocs = await getDocs(userQuery);

  if (userDocs.docs.length > 0) {
    // User found, access the user document
    const userDoc = userDocs.docs[0];
    const userData = userDoc.data();

    // Check if the user has a "books" array
    if (userData.books && userData.books.length > 0) {
      // Access the "books" array containing the book information
      const booksArray = userData.books;

      // Find the index of the book with the specified title
      const bookIndex = booksArray.findIndex((book) => book.title === title);

      if (bookIndex !== -1) {
        // Book found, remove it from the array
        const deletedBook = booksArray.splice(bookIndex, 1);

        // Decrement the book count
        const bookCount = (userData.bookCount || 0) - 1;

        // Update the user document with the modified books array and decremented book count
        await updateDoc(userDoc.ref, { books: booksArray, bookCount });

        // Send the deleted book information and decremented book count as a response
        res.status(200).json({
          message: "Book deleted successfully",
          deletedBook,
          bookCount,
        });
      } else {
        // Book not found, send an appropriate response
        res.status(404).send("Book with the specified title not found.");
      }
    } else {
      // User has no books, send an appropriate response
      res.status(404).send("User has no books.");
    }
  } else {
    // User not found, send an appropriate response
    res.status(404).send("User with the specified UID not found.");
  }
});

////////////Retrive book By Specific User
app.get("/read/book/info/:uid", async (req, res) => {
  const { uid } = req.params; // Replace 'userUid' with the actual UID

  // Query the Firestore collection to get the user document
  const userQuery = query(userCollection, where("uid", "==", uid));
  const userDocs = await getDocs(userQuery);

  if (userDocs.docs.length > 0) {
    // User found, access the user document
    const userDoc = userDocs.docs[0];
    const userData = userDoc.data();

    // Check if the user has a "books" array
    if (userData.books && userData.books.length > 0) {
      // Access the "books" array containing the book information
      const booksArray = userData.books;

      // Print or use the book information as needed

      
      // Send the book information as a response
      res.status(200).json({ books: booksArray });
    } else {
      // User has no books, send an appropriate response
      res.status(404).send("User has no books.");
    }
  } else {
    // User not found, send an appropriate response
    res.status(404).send("User with the specified UID not found.");
  }
});

//////chatgptcode for docs
/////stripe payments cheking
const stripeSession = async (plan, quantity = 1) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan,
          quantity: quantity,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    return session;
  } catch (error) {
    console.error(
      "Error creating subscription checkout session:",
      error.message
    );
    throw error;
  }
};

app.post("/api/v1/create-subscription-checkout-session", async (req, res) => {
  const { plan, customerID } = req.body;
  let planID = null;

  // Map plan value to Stripe price ID
  if (plan === 100) planID = "price_1OGMOUDVdv2HjLcjzTeLdDi1"; // Use the actual price ID here
  else if (plan === 1699) planID = "price_1OGMScDVdv2HjLcj55o5q51C";
  else if (plan === 1999) planID = "price_1OGMTODVdv2HjLcjXEc8ufWh";
  else if (plan === 9999) planID = "price_1OGMRjDVdv2HjLcj3ureRYrC";

  try {
    // Create a subscription checkout session
    const session = await stripeSession(planID);
    console.log("Checkout URL:", session.url);

    // Check if the user with the specified uid already exists
    const userExistsQuery = query(
      userCollection,
      where("uid", "==", customerID)
    );
    const existingUserDocs = await getDocs(userExistsQuery);

    if (existingUserDocs.docs.length > 0) {
      const existingUserRef = existingUserDocs.docs[0].ref;

      // Check if session and session.id are defined
      if (session && session.id) {
        await updateDoc(existingUserRef, {
          subscription: {
            sessionID: session.id,
          },
        });
        console.log(
          "User with the specified UID already exists. Updated subscription data."
        );
        res.status(200).json({
          checkoutSessionData: {
            url: session.url,
            message: "Subscription data updated successfully",
          },
        });
      } else {
        console.error("Error creating subscription checkout session");
        res.status(500).send("Internal Server Error");
      }
    } else {
      // User does not exist, handle accordingly
      res.status(400).send("User with the specified UID does not exist");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/v1/payment-success", async (req, res) => {
  const { sessionId, uid } = req.body;

  console.log(uid);

  const uids = uid;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const subscriptionId = session.subscription;

      try {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        const userDocRef = doc(db, "users", uids);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const planAmount = subscription.plan.amount;
          let planType, bookAllowed, questionsAllowed, questionCount;

          switch (planAmount) {
            case 100:
              planType = "free";
              bookAllowed = 3;
              questionsAllowed = 20;
              questionCount = 0;
              break;
            case 1699:
              planType = "plus";
              bookAllowed = 5;
              questionsAllowed = 200;
              questionCount = 0;
              break;
            case 1999:
              planType = "premium"; // You can adjust this if needed
              bookAllowed = "unlimited";
              questionsAllowed = "unlimited";
              questionCount = 0;
              break;
            case 9999:
              planType = "genius";
              bookAllowed = "unlimited";
              questionsAllowed = "unlimited";
              questionCount = 0;
              break;
            default:
              planType = "noting";
              bookAllowed = 0; // Adjust as needed
              questionsAllowed = 0; // Adjust as needed
              questionCount = 0;
              break;
          }

          const startDate = moment
            .unix(subscription.current_period_start)
            .format("YYYY-MM-DD");
          const endDate = moment
            .unix(subscription.current_period_end)
            .format("YYYY-MM-DD");

          const today = moment().format("YYYY-MM-DD");

          if (today > endDate) {
            // Delete the user's subscription from Firestore
            await deleteDoc(userDocRef);
            return res.json({ message: "Subscription ended" });
          } else {
            // Update the user's subscription information in Firestore
            const userSubscriptionRef = doc(db, "users", uids);

            await setDoc(
              userSubscriptionRef,
              {
                planId: subscription.plan.id,
                planType,
                planStartDate: startDate,
                planEndDate: endDate,
                bookAllowed,
                questionsAllowed,
                questionCount,
              },
              { merge: true }
            );

            return res.json({ message: "Payment successful" });
          }
        } else {
          console.error("User not found in Firestore");
          return res.json({ message: "Payment failed - User not found" });
        }
      } catch (error) {
        console.error("Error retrieving subscription:", error);
      }
    } else {
      return res.json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.send(error);
  }
});

////end





///checking resposne
app.post("/api/chat", async (req, res) => {
  try {
    console.log('api reached 1')
    const inputValue = req.body;

    const data = {
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content: "You Are Good Assistant",
        },
        ...inputValue.messages, // Include user messages
      ],
    };
    console.log('api reached 2')

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    // Set up headers for server-sent events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    console.log('api reached 3')

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Send the start signal

    while (true) {
      const { done, value } = await reader.read();
      console.log('api reached 4')

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      // Process the chunk and send to the client
      processChunk(chunk);
    }

    // Send the end signal
    // res.write("data: End\n\n");
    res.end();

    function processChunk(chunk) {
      const matches = chunk.match(/"content":"(.*?)"/g);
    
      if (matches) {
        matches.forEach((match) => {
          const contentMatch = /"content":"(.*?)"/.exec(match);
          if (contentMatch && contentMatch[1]) {
            const content = contentMatch[1];
            res.write(`${content}`);
            console.write(content)
          }
        });
      }
    }
    
  } catch (error) {
    // Handle other errors
    console.error("Error in processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});





app.post("/add/question/info", async (req, res) => {
  try {
    const { uid } = req.body;

    // Check if the user exists
    const userExistsQuery = query(userCollection, where("uid", "==", uid));
    const existingUserDocs = await getDocs(userExistsQuery);

    if (existingUserDocs.docs.length > 0) {
      // User already exists, update the book count and add the book info
      const existingUserDoc = existingUserDocs.docs[0];
      const existingUserData = existingUserDoc.data();

      // Increment the book count
      const questionCount = (existingUserData.questionCount || 0) + 1;

      // Update the user document with the new book info and book count
      await updateDoc(existingUserDoc.ref, {
        questionCount,
      });

      res
        .status(200)
        .json({ message: "Book added successfully.", questionCount });
    } else {
      // User not found
      res.status(404).send("User with the specified UID not found.");
    }
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).send("Internal Server Error");
  }
});

//readall the data
app.get("/read/all/info/:uid", async (req, res) => {
  const { uid } = req.params; // Replace 'userUid' with the actual UID

  // Query the Firestore collection to get the user document
  const userQuery = query(userCollection, where("uid", "==", uid));
  const userDocs = await getDocs(userQuery);

  if (userDocs.docs.length > 0) {
    // User found, access the user document
    const userDoc = userDocs.docs[0];
    const userData = userDoc.data();

    // Check if the user has a "books" array
    if (userData.books && userData.books.length > 0) {
      // Access the "books" array containing the book information
      const booksArray = userData.books;
      const plantype = userData.planType;
      const planstartdate = userData.planStartDate;
      const planEndDate = userData.planEndDate;
      const bookAllowed = userData.bookAllowed;
      const questionsAllowed = userData.questionsAllowed;
      const bookCount = userData.bookCount;
      const questionCount = userData.questionCount;
  
      // Send the book information as a response
      res.status(200).json({
        books: booksArray.map((book) => ({
          title: book.title,
          author: book.author,
          imageUrl: book.imageUrl,
        })),
        plantype,
        planstartdate,
        planEndDate,
        bookAllowed,
        questionsAllowed,
        bookCount,
        questionCount,
      });
    } else {
      // User has no books, send an appropriate response
      res.status(404).send("User has no books.");
    }
  } else {
    // User not found, send an appropriate response
    res.status(404).send("User with the specified UID not found.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});