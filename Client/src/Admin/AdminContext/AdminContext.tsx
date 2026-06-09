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
  const [editId, setEditId] = useState<string | null >(null);

  const setUpdateId = (id: string) => {
    setEditId(id);    
  };
console.log("editId is : ",editId);


  return (
    <WhearhouseContext.Provider value={{ editId, setUpdateId }}>
      {children}
    </WhearhouseContext.Provider>
  );
};

export function useEditContext() {
  const editContext = useContext(WhearhouseContext);
  if (!editContext) {
    throw new Error("Wrap your Components in WhearhouseContext.Provider");
  }
  return  editContext;
}
