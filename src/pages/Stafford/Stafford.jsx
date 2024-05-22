import React, { useEffect, useRef, useState } from "react";
import ChatSection from './../../components/Chat/ChatSection.jsx';
import { useParams } from "react-router-dom";

import '../../App.css';
import "./Stafford.css";

const data = {
  "introMessages": [
      "Ahoy matey, ready to sail the seven seas",
      "I've got ye a treasure map each with clues to find the next destination",
      "Ready to play?"
  ],
  "questions": [
      {
          "question": "how many fish are in the sea",
          "clues": [
              "its not 0",
              "its larger than 0"
          ],
          "answer": "1"
      },
      {
          "question": "how many bees are there in totla",
          "clues": [
              "its not 0",
              "its larger than 0"
          ],
          "answer": "2"
      }
  ],
  "endMessage": "Congrats you found the treasure"
}

export const Stafford = () => {
  const [messages, setMessages] = useState([]); // Array of the messages - [{message: str, side: "left"|"right"}, ...]
  const [input, setInput] = useState(""); // Users current input

  const [introState, setIntroState] = useState(true); // Whether the system is sending 'intro' messages
  const [introIndex, setIntroIndex] = useState(0); // Index of the intro questions the systems asks

  const [systemsTurn, setSystemsTurn] = useState(true); // Whether it is the systems turn to reply

  const [firstQuestionState, setFirstQuestionState] = useState(true); // If the first question should be sent
  const [questionIndex, setQuestionIndex] = useState(0); // The index of the question the user is on
  const [finished, setFinished] = useState(false); // State if the user has completed the game

  const [hintIndex, setHintIndex] = useState(0); // Index of the current clue, should be reseted every correct answer

  const { id } = useParams(); // Id from the url - the game instance id
  console.log(id);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (side, message) => {
    if (message.trim() !== "") {
      setMessages([...messages, { text: message, side }]);
      setInput("");
    }
    // If the system has sent a message, its no longer their go
    if (side === "left"){
      setSystemsTurn(false);
    }
    // If the user has sent a message, its now the systems turn to send a message
    else if (side === "right"){
      setSystemsTurn(true);  
    }
  };

  const systemMessagingLogic = () => {
    if (systemsTurn) {
      // If the game hasn't finished
      if (!finished) {
        if (introState){
          setTimeout(() => {
            // Adding a delay to make it seem like a message being sent
            handleSendMessage("left", data["introMessages"][introIndex])
          }, 500);
          if (introIndex === data["introMessages"].length - 1) {
            setIntroState(false);
          }
          setIntroIndex(introIndex + 1);
        }
        // If we're not doing the intro then begin the game
        else {
          // Ask the first question
          if (firstQuestionState){
            setTimeout(() => {
              // Adding a delay to make it seem like a message being sent
              handleSendMessage("left", data["questions"][questionIndex]["question"])
            }, 500);
            setFirstQuestionState(false);
            return;
          }
          // Check the if the users answer is correct
          if (messages[messages.length - 1]["text"] === data["questions"][questionIndex]["answer"]) {
            setHintIndex(0); // Reset hint index
            // Check there's still questions left
            if (questionIndex < data["questions"].length - 1) {
              setQuestionIndex(questionIndex + 1); // If answer is correct then increase question index
              setTimeout(() => {
                // Adding a delay to make it seem like a message being sent
                handleSendMessage("left", data["questions"][questionIndex + 1]["question"]);
              }, 500);
            } else if (!finished) {
              setTimeout(() => {
                // Adding a delay to make it seem like a message being sent
                handleSendMessage("left", data["endMessage"]);
                setFinished(true);
              }, 500);
            }
          }
          // Check if they've asked for a hint
          else if (messages[messages.length - 1]["text"] === "hint") {
            // Check the user hasn't used all the hints
            if (hintIndex < data["questions"][questionIndex]["clues"].length) {
              setTimeout(() => {
                handleSendMessage("left", data["questions"][questionIndex]["clues"][hintIndex]);
              }, 500);
              setHintIndex(i => i + 1);
            } else {
              setTimeout(() => {
                // Adding a delay to make it seem like a message being sent
                handleSendMessage("left", "Sorry, there are no more hints");
              }, 500);
            }
          }
          // Wrong/Unrecognized answer
          else {
            setTimeout(() => {
              // TODO add random wrong answer messages
              handleSendMessage("left", "Sorry, that's the wrong answer");
            }, 500);
          }
        }
      }
    }    
  }

  useEffect(() => {
    // If its the systems turn then send an appropriate message
    systemMessagingLogic()
  }, [systemsTurn])

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage("right", input);
    }
  };

  return (
    <div className="chat-container">
      <ChatSection
        messagesEndRef={messagesEndRef}
        messages={messages}
      />
      <div className="input-container">
          <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          />
          <button onClick={() => handleSendMessage("right", input)}>Send ➡️</button>
      </div>
    </div>
  )
};

