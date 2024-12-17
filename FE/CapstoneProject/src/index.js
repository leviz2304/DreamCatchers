// src/index.js
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "sonner";
import { ThemeProvider } from "@material-tailwind/react";
import { StompProvider } from "./context/StompContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <Provider store={store}>
                <StompProvider>
                    <Router>
                        <App />
                        <Toaster position="top-center" richColors />
                    </Router>
                </StompProvider>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>
);
