import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { ChatPopupContextType } from "../graphql/client";

const ChatWhearhouseContext = createContext<ChatPopupContextType | undefined>(
  undefined,
);

export function ChatContextProvider({ children }: { children: ReactNode }) {
  const [isOpenChat, setIsOpenChat] = useState<boolean>(false);

  const closeChatPopup = () => {
    setIsOpenChat(false);
  };

  useEffect(() => {
    console.log("is open value from popupContext.tex ; ", isOpenChat);
    if (!isOpenChat) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeChatPopup();
      }
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpenChat]);
  return (
    <ChatWhearhouseContext.Provider value={{ isOpenChat,setIsOpenChat, closeChatPopup }}>
      {children}
    </ChatWhearhouseContext.Provider>
  );
}

export function chatPopupContext(): ChatPopupContextType {
  const chatContext = useContext(ChatWhearhouseContext);
  if (!chatContext) {
    throw new Error("UseOTPPopup must be used withinContextProvider");
  }
  return chatContext;
}
