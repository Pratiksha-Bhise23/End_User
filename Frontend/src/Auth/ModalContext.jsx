import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const showModalMessage = (message) => {
    setModalMessage(message);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000); // Auto-close after 2 seconds
  };

  const hideModal = () => {
    setShowModal(false);
    setModalMessage("");
  };

  return (
    <ModalContext.Provider value={{ showModalMessage, hideModal }}>
      {children}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-none bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-sm w-full mx-4 animate-slide-in">
            <p className="text-lg font-semibold text-center">{modalMessage}</p>
            <div className="mt-4 flex justify-center">
              <button
                className="bg-blue-600 hover:bg-blue-400 px-4 py-2 rounded-lg"
                onClick={hideModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
