import React, { useState } from "react";
import "./App.css";

export default function App() {
  const apiBaseUrl = "https://pdf-chat-backend.onrender.com";

  const [messages, setMessages] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const uploadPDF = async () => {
    const pdfUpload = document.getElementById("pdfUpload");
    const files = pdfUpload.files;

    if (files.length === 0) {
      alert("Please select at least one PDF file.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("pdf_docs", files[i]);
    }

    try {
      const response = await fetch(`${apiBaseUrl}/upload-pdfs/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload PDFs");
      }

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading PDFs. Please check the console for more details.");
    }
  };

  const askQuestion = async (userQuestion) => {
    if (!userQuestion) {
      alert("Please enter a question.");
      return;
    }

    // Add user question to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: userQuestion },
    ]);

    try {
      const response = await fetch(`${apiBaseUrl}/ask-question/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_question: userQuestion }),
      });

      if (!response.ok) {
        throw new Error("Failed to retrieve answer");
      }

      const result = await response.json();

      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "bot", text: result.answer },
      ]);
    } catch (error) {
      console.error("Error:", error);
      alert(
        "Error getting response. Please check the console for more details."
      );
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      askQuestion(event.target.value);
      event.target.value = "";
    }
  };

  const toggleDropdown = (dropdown) => {
    if (dropdown === "upload") {
      setIsUploadOpen(!isUploadOpen);
      setIsChatOpen(false);
    } else if (dropdown === "chat") {
      setIsChatOpen(!isChatOpen);
      setIsUploadOpen(false);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center py-10 bg-black min-h-screen">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-5 text-white text-center">CHAT WITH PDFS</h1>
        
        <div className="relative mb-5">
          <button
            onClick={() => toggleDropdown("upload")}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {isUploadOpen ? "Close PDF Upload" : "Upload PDF Files"}
          </button>
          {isUploadOpen && (
            <div className="mt-2 p-4 bg-white shadow-md rounded-lg">
              <h4 className="font-bold mb-2">Upload PDF Files</h4>
              <input type="file" id="pdfUpload" multiple accept=".pdf" className="mb-4"/>
              <button
                onClick={uploadPDF}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                Upload PDFs
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => toggleDropdown("chat")}
            className="w-full bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg"
          >
            {isChatOpen ? "Close Chat" : "Open Chat"}
          </button>
          {isChatOpen && (
            <div className="mt-2 p-4 bg-white shadow-md rounded-lg">
              <div className="chatbox max-h-80 overflow-y-auto mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message p-2 my-2 flex rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-200 text-left"
                        : "bg-gray-200 text-left"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>

              <div className="input-container">
                <input
                  type="text"
                  id="userQuestion"
                  placeholder="Type your question here..."
                  onKeyDown={handleKeyDown}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
