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
import { GoogleOAuthProvider } from "@react-oauth/google";

const httpLink = createHttpLink({
  // uri: "http://localhost:4003/graphql",
  uri:"https://socialevent-platform-client.onrender.com",
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
        <GoogleOAuthProvider clientId="767198098702-auruaq6sa30ios6tvc3fbp3r4v40h2vm.apps.googleusercontent.com">
          <ContextProvider>
            <ChatContextProvider>
              <EditIdContextProvider>
                <App />
              </EditIdContextProvider>
            </ChatContextProvider>
            <ToastContainer />
          </ContextProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
