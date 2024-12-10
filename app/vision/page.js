"use client";

import React, { useState, useEffect } from "react";
import ChatBot from "react-chatbotify";
import ReactFlagsSelect from "react-flags-select";
import { translations } from "@/lib/languageconstant";
import CameraComponent from "@/components/camera"; // Bileşen yolunu doğru belirttiğinizden emin olun
import Overlay from "@/components/overlay";
import FoodComponent from "@/components/foodcomponent";
import {
  addMessageToChatHistory,
  getChatHistory,
  clearChatHistory,
} from "@/lib/chatmanager";
export default function OCRPage() {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("image");
  const [results, setResults] = useState([]);
  const [resultsex, setResultsEx] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("GB"); // Varsayılan dil Türkçe
  const [firstCall, setfirstCall] = useState(true);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      const type = selectedFile.type.includes("pdf") ? "pdf" : "image";
      setFileType(type);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      clearChatHistory();
      // Convert file to Base64
      const base64 = await toBase64(file);

      // Send request to the API
      const response = await fetch("/api/vision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64,
          fileType,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        sendMessage(data.text);
      } else {
        throw new Error(data.error || "Something went wrong");
      }
    } catch (err) {
      setError(err.message);
    } finally {
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove metadata prefix
      reader.onerror = (error) => reject(error);
    });

  const sendMessage = async (text) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.reply || []);
        setResultsEx(data.reply || []);

        if (firstCall) {
          addMessageToChatHistory({
            role: "system",
            content: translations[language].initparams,
          });
          setfirstCall(false);
        }
        addMessageToChatHistory({
          role: "assistant",
          content: JSON.stringify(data.reply),
        });
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendRegularMessage = async (text) => {
    try {
      var tw = text + translations[language].responselanguage;
      addMessageToChatHistory({
        role: "user",
        content: JSON.stringify(tw),
      });

      var mess = getChatHistory();
      const response = await fetch("/api/regularchatter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: mess,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addMessageToChatHistory({ role: "assistant", content: data.reply });
        return data.reply;
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };
  const flow = {
    start: {
      message: translations[language].greeting,
      transition: { duration: 1000 },
      path: "start2",
    },
    start2: {
      message: translations[language].greeting2,
      path: "loop",
    },
    loop: {
      message: async (params) => {
        var qq = await sendRegularMessage(params.userInput);
        await params.injectMessage(qq);
      },
      path: () => {
        if (error) {
          return "start";
        }
        return "loop";
      },
    },
  };

  const settings = {
    isOpen: false,
    general: {
      primaryColor: "#ff0000cc",
      secondaryColor: "#ff0000dd",
      fontFamily: "Arial, sans-serif",
      embedded: false,
      showFooter: false,
    },
    header: {
      title: translations[language].assistantTitle,
      showAvatar: false,
    },

    audio: {
      disabled: true,
    },
    notifications: { disabled: true },
    chatHistory: {
      disabled: true,
    },
    chatInput: {
      enabledPlaceholderText: "...",
    },
    tooltip: {
      mode: "START",
      text: translations[language].assistantwelcome,
    },
    botBubble: { simStream: true },
    // other sections
  };

  return (
    <div>
      {loading && <Overlay message={translations[language].overlaymessage} />}
      {resultsex.length > 0 ? (
        <div className="bg-gradient-to-br from-[#f0f0f0] to-[#ffffff] md:from-[#f0f0f0] md:to-[#ffffff]">
          <FoodComponent data={resultsex} language={language} />
          <ChatBot key={language} flow={flow} settings={settings} />
          <div
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              color: "#000000",
              fontWeight: "bold",
            }}
          >
            <ReactFlagsSelect
              countries={["GB", "TR"]}
              customLabels={{
                GB: "EN",
                TR: "TR",
              }}
              placeholder="Language"
              showOptionLabel={true}
              selected={language}
              onSelect={(code) => setLanguage(code)}
            />
          </div>
        </div>
      ) : (
        <div
          className="h-screen w-screen bg-cover bg-center flex items-center justify-center md:justify-start"
          style={{
            backgroundImage: `url('https://cdn.turkishairlines.com/m/7559aab31cb380c0/original/1400x500-BO-jpg.jpg')`,
          }}
        >
          <div>
            <div className="bg-white w-[400px] rounded-lg shadow-lg p-6 md:ml-[15%] border-2 border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
                {translations[language].mainpagetitle}
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                {translations[language].mainpagedescription}
              </p>

              {/* Dosya Yükleme Alanı */}
              <form onSubmit={handleSubmit}>
                <div className="border-2 border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-red-500 transition">
                  <label htmlFor="file" className="cursor-pointer">
                    <p className="text-gray-500">
                      {file == null
                        ? translations[language].mainpageclick
                        : "Ready"}
                    </p>
                    <input
                      type="file"
                      id="file"
                      accept=".pdf, image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Gönder Butonu */}
                <button
                  className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  type="submit"
                >
                  {translations[language].mainpagesend}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
