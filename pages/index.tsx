import { useState } from "react";
import Title from "@/components/Title";
import { RecordMessage } from "@/components/RecordMessage";
import Link from 'next/link';
import config from '../config'; // Adjust the path as necessary

const handleStop = async (mediaBlobUrl: any) => {
  setIsLoading(true);
  console.log(mediaBlobUrl);

  const myMessage = { sender: "me", mediaBlobUrl };
  const messagesArr = [...messages, myMessage];

  try {
    const response = await fetch(mediaBlobUrl);
    const blob = await response.blob();

    // Initialize formData
    const formData = new FormData();
    formData.append("file", blob, "myFile.wav");

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const blobResponse = await fetch(`${BASE_URL}/post-audio`, {
      method: 'POST',
      mode: 'cors',
      body: formData,
    });

    const chatbotData = await blobResponse.blob();
    
    if (!blobResponse.ok) { 
      throw new Error("Unable to get Blob response");
    }
    console.log(chatbotData);
    const chatbotBlob = new Blob([chatbotData], {type: 'audio/wav'})
    const chatbotBlobURL = URL.createObjectURL(chatbotBlob)
    const ChatbotAudio = new Audio(chatbotBlobURL)
    ChatbotAudio.play()

    const chatbotMessage = { sender: config.BOT_NAME.toLowerCase(), mediaBlobUrl: chatbotBlobURL };
    const updatedMessagesArr = [...messagesArr, chatbotMessage];

    setMessages(updatedMessagesArr);
    setIsLoading(false);
  } catch (error) {
    console.error(error);
    setIsLoading(false);
  };
};

  
  return (
    <div className="h-screen overflow-y-hidden">
      <Title setMessages={setMessages} />

      <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
        <div className="mt-5 px-5">
          {messages?.map((audio, index) => (
            <div
              key={index}
              className={`flex flex-col ${audio.sender == config.BOT_NAME.toLowerCase() ? "items-end" : ""}`}
            >
              <div className="mt-4">
                <p
                  className={audio.sender == config.BOT_NAME.toLowerCase()
                    ? "text-right mr-2 italic text-green-500"
                    : "ml-2 italic text-blue-500"}
                >
                  {audio.sender}
                </p>

                <audio
                  src={audio.mediaBlobUrl}
                  className="appearance-none"
                  controls
                />
              </div>
            </div>
          ))}

          {messages.length == 0 && !isLoading && (
            <div className="text-center font-light italic mt-10">
              Send {config.BOT_NAME} a message...
            </div>
          )}

          {isLoading && (
            <div className="text-center font-light italic mt-10 animate-pulse">
              Gimme a few seconds...
            </div>
          )}
        </div>

        <div className="fixed bottom-0 w-full py-6 border-t text-center bg-gradient-to-r from-black to-blue-500">
          <div className="flex justify-center items-center w-full">
            <RecordMessage handleStop={handleStop} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;
