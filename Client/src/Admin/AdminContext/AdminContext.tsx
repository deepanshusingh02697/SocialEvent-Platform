import { createContext, useContext, useState, type ReactNode } from "react";
import type { EditIdContextType } from "../../Component/graphql/client";

const WhearhouseContext = createContext<EditIdContextType | undefined>(
  undefined,
);

export const EditIdContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [editId, setEditId] = useState<string | null>(null);
  const [ismaplatitude, setIsmaplatitude] = useState<number | null>(null);
  const [ismaplongitude, setIsmaplongitude] = useState<number | null>(null);

  const setUpdateId = (id: string | null) => {
    setEditId(id);
  };

  const setmaplatlongFunc = (lat: number | null, long: number | null) => {
    setIsmaplatitude(lat);
    setIsmaplongitude(long);
  };

  return (
    <WhearhouseContext.Provider
      value={{
        editId,
        setUpdateId,
        ismaplatitude,
        ismaplongitude,
        setmaplatlongFunc,
      }}
    >
      {children}
    </WhearhouseContext.Provider>
  );
};

export function useEditContext() {
  const editContext = useContext(WhearhouseContext);
  if (!editContext) {
    throw new Error("Wrap your Components in WhearhouseContext.Provider");
  }
  return editContext;
}
