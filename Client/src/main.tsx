import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ContextProvider } from "./Component/Context/PopupContext.tsx";
import { ChatContextProvider } from "./Component/Context/ChatPopupContext.tsx";
import { EditIdContextProvider } from "./Admin/AdminContext/AdminContext.tsx";

const httpLink = createHttpLink({
  uri: "http://localhost:4003/graphql",
  credentials: "include",
});
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <ContextProvider>
          <ChatContextProvider>
            <EditIdContextProvider>
              <App />
            </EditIdContextProvider>
          </ChatContextProvider>
          <ToastContainer />
        </ContextProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
