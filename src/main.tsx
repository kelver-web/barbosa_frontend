import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { SearchProvider } from "./context/SearchProvider.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { KitchenProvider } from "./context/KitchenContext.tsx";
import { GarcomProvider } from "./context/GarcomContext.tsx";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <KitchenProvider>
          <GarcomProvider>
            <SearchProvider>
              <CartProvider>
                <App />

                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                  style={{ zIndex: 99999 }}
                />
              </CartProvider>
            </SearchProvider>
          </GarcomProvider>
        </KitchenProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
