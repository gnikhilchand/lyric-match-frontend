// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { TailSpin } from "react-loader-spinner";


// const App = () => {
//   const [lyricSnippet, setLyricSnippet] = useState("");
//   const [userGuess, setUserGuess] = useState("");
//   const [username, setUsername] = useState("");
//   const [result, setResult] = useState("");
//   const [score, setScore] = useState(0);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch the leaderboard on component mount
//   useEffect(() => {
//     fetchLeaderboard();
//   }, []);

//   const fetchLeaderboard = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/leaderboard");
//       setLeaderboard(response.data);
//     } catch (error) {
//       console.error("Error fetching leaderboard:", error);
//     }
//   };

//   // Function to fetch a lyric snippet from the backend
//   const generateLyric = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post("http://127.0.0.1:8000/generate-lyric");
//       setLyricSnippet(response.data.lyric_snippet);
//       setResult("");
//     } catch (error) {
//       console.error("Error generating lyric snippet:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to check if the user's guess is correct
//   const checkAnswer = async () => {
//     if (!username) {
//       alert("Please enter your username!");
//       return;
//     }

//     try {
//       const response = await axios.post("http://127.0.0.1:8000/check-answer", {
//         user_guess: userGuess,
//         correct_title: lyricSnippet.correct_title,
//         username: username,
//       });
//       if (response.data.is_correct) {
//         setResult("Correct! 🎉");
//         setScore(score + 1);
//         fetchLeaderboard(); // Refresh the leaderboard
//       } else {
//         setResult(`Incorrect! The correct title was "${correctTitle}".`);
//       }
//     } catch (error) {
//       console.error("Error checking answer:", error);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Lyric Matching game 🎵</h1>
//       <button
//         onClick={generateLyric}
//         style={{
//           padding: "10px 20px",
//           fontSize: "16px",
//           backgroundColor: "#4CAF50",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Generate Lyric 
//       </button>

//       {lyricSnippet && (
//         <div style={{ margin: "20px" }}>
//           <h3>Lyric Snippet:</h3>
//           <p style={{ fontStyle: "italic" }}>"{lyricSnippet}"</p>
//           <input
//             type="text"
//             placeholder="Enter your guess"
//             value={userGuess}
//             onChange={(e) => setUserGuess(e.target.value)}
//             style={{
//               padding: "10px",
//               fontSize: "16px",
//               width: "300px",
//               borderRadius: "5px",
//               border: "1px solid #ccc",
//             }}
//           />
//           <button
//             onClick={checkAnswer}
//             style={{
//               padding: "10px 20px",
//               fontSize: "16px",
//               backgroundColor: "#008CBA",
//               color: "white",
//               border: "none",
//               borderRadius: "5px",
//               marginLeft: "10px",
//               cursor: "pointer",
//             }}
//           >
//             Check Answer
//           </button>
//         </div>
//       )}

//       {result && (
//         <h3 style={{ color: result.includes("Correct") ? "green" : "red" }}>
//           {result}
//         </h3>
//       )}
//     </div>
//   );
// };

// export default App;


import React, { useState } from "react";
import axios from "axios";
import { CircleLoader } from "react-spinners";

const backendUrl = "https://lyric-match-backend.onrender.com";

const App = () => {
  const [lyricSnippet, setLyricSnippet] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [username, setUsername] = useState("");
  const [result, setResult] = useState("");
  const [correctTitle, setCorrectTitle] = useState("");
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch a lyric snippet
  const generateLyric = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/generate-lyric`);
      setLyricSnippet(response.data.lyric_snippet);
      setCorrectTitle(response.data.correct_title);
      setResult("");
    } catch (error) {
      console.error("Error generating lyric snippet:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check the user's guess
  const checkAnswer = async () => {
    if (!username) {
      alert("Please enter your username!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/check-answer`, {
        username: username,
        user_guess: userGuess,
        correct_title: correctTitle,
      });

      if (response.data.is_correct) {
        setResult("Correct! 🎉");
        setScore((prevScore) => prevScore + 1);
      } else {
        setResult(`Incorrect! The correct title was "${correctTitle}".`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error checking answer:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the leaderboard
  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/leaderboard`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Lyric Match 🎵</h1>

      {/* Username Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Score Display */}
      <h3>Your Score: {score}</h3>

      {/* Generate Lyric Button */}
      <button
        onClick={generateLyric}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Generate Lyric Snippet
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ marginTop: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
         }}>
  
          <CircleLoader color="#00BFFF" height={40} width={40} />
        </div>
      )}

      {/* Lyric Snippet and Guess Input */}
      {lyricSnippet && (
        <div style={{ margin: "20px" }}>
          <h3>Lyric Snippet:</h3>
          <p style={{ fontStyle: "italic" }}>"{lyricSnippet}"</p>
          <input
            type="text"
            placeholder="Enter your guess"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              width: "300px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={checkAnswer}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#008CBA",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            Check Answer
          </button>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <h3 style={{ color: result.includes("Correct") ? "green" : "red" }}>
          {result}
        </h3>
      )}

      {/* Leaderboard */}
      <div style={{ marginTop: "40px" }}>
        <button
          onClick={fetchLeaderboard}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Show Leaderboard
        </button>
        {leaderboard.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Leaderboard</h3>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {leaderboard.map((entry, index) => (
                <li key={index} style={{ margin: "10px 0" }}>
                  {entry.username}: {entry.score} points
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ marginTop: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
         }}>
          <CircleLoader color="#00BFFF" height={40} width={40} />
        </div>
      )}
    </div>
  );
};

export default App;
