import { Stomp } from "@stomp/stompjs";
import { useState } from "react";
import SockJS from "sockjs-client";

const ChatPage = () => {
  const sockJS = new SockJS("/stomp/chat");
  const stomp = Stomp.over(sockJS);
  const [inputMsg, setInputMsg] = useState("");
  const [msgList, setMsgList] = useState([
    { nickname: "관리자", message: "--님이 입장하셨습니다." },
  ]);
  stomp.connect(
    "guest",
    "guest",
    function (frame) {
      console.log("Connected to Stomp");

      // Subscribe to the chat room
      stomp.subscribe("/exchange/chat.exchange/room.1", function (message) {
        const chatDto = JSON.parse(message.body);

        setMsgList((prev) => [
          ...prev,
          { [chatDto.nickname]: chatDto.message },
        ]);
      });
    },
    function (error) {
      console.error("Stomp connection error", error);
    }
  );

  const submitHandler = (event) => {
    event.preventDefault();

    // const messageInput =
    setInputMsg("");
  };

  const inputMsgHandler = (event) => {
    setInputMsg(event.target.value);
    console.log(event.target.value);
  };
  // const chatForm = document.getElementById("chatForm");
  // chatForm.addEventListener("submit", function(event) {
  //     event.preventDefault();

  //     const messageInput = document.getElementById("message");
  //     const message = messageInput.value;

  //     // Send the message to the chat room
  //     stomp.send("/pub/chat.message.1", {}, JSON.stringify({
  //         message: message,
  //         memberId: 1,
  //         nickname: "YourNickname"
  //     }));

  //
  // });
  return (
    <div>
      <div id="chatArea">
        {msgList.map((msg) => (
          <li key={msg.message}>
            `${msg.nickname} : ${msg.message}
          </li>
        ))}
      </div>

      <form id="chatForm" onSubmit={submitHandler}>
        <label htmlfor="message">Message:</label>
        <input
          onChange={inputMsgHandler}
          type="text"
          id="message"
          value={inputMsg}
          required
          placeholder="message써줘잉"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;
