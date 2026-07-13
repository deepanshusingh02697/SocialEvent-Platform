import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { PopupContextType } from "../graphql/client";


const WhearhouseContext = createContext<PopupContextType | undefined>(
  undefined,
);

export function ContextProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openPopup = () => {
    setIsOpen(true);
  };
  const closePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  return (
    <WhearhouseContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
    </WhearhouseContext.Provider>
  );
}

export function useOTPPopup(): PopupContextType {
  const context = useContext(WhearhouseContext);
  if (!context) {
    throw new Error("UseOTPPopup must be used withinContextProvider");
  }
  return context;
}
