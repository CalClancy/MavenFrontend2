import { useState } from "react";
import Title from "@/components/Title";
import { RecordMessage } from "@/components/RecordMessage";
import config from '../config'; // Make sure this path is correct
import Link from 'next/link';

const Controller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  // Rest of your code...

  const handleStop = async (mediaBlobUrl: any) => {
    // Existing code...

    // Create a new message for the chatbot response
    const chatbotMessage = { sender: config.BOT_NAME.toLowerCase(), mediaBlobUrl: chatbotBlobURL };
    const updatedMessagesArr = [...messagesArr, chatbotMessage];

    setMessages(updatedMessagesArr);
    setIsLoading(false);

    // Catch block...
  };

  return (
    <div className="h-screen overflow-y-hidden">
      {/* Title */}
      <Title setMessages={setMessages} />

      <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
        {/* Conversation */}
        <div className="mt-5 px-5">
          {messages?.map((audio, index) => {
            return (
              <div
                key={index}
                className={`flex flex-col ${audio.sender === config.BOT_NAME.toLowerCase() ? "items-end" : ""}`}
              >
                {/* Sender */}
                <div className="mt-4 ">
                  <p
                    className={
                      audio.sender === config.BOT_NAME.toLowerCase()
                        ? "text-right mr-2 italic text-green-500"
                        : "ml-2 italic text-blue-500"
                    }
                  >
                    {audio.sender}
                  </p>

                  {/* Message */}
                  <audio
                    src={audio.mediaBlobUrl}
                    className="appearance-none"
                    controls
                  />
                </div>
              </div>
            );
          })}

          {messages.length === 0 && !isLoading && (
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

        {/* Recorder */}
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
