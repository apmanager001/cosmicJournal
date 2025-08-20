import React from 'react'
import { Toaster } from 'react-hot-toast'

const Toasters = () => {
  return (
    <>
      <Toaster
        position={"top-center"}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "1rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            maxWidth: "24rem",
          },
          success: {
            style: {
              background: "#d1fae5",
              color: "#065f46",
              border: "1px solid #10b981",
            },
            iconTheme: {
              primary: "#065f46",
              secondary: "#d1fae5",
            },
          },
          error: {
            style: {
              background: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #ef4444",
            },
            iconTheme: {
              primary: "#991b1b",
              secondary: "#fee2e2",
            },
          },
          loading: {
            style: {
              background: "#dbeafe",
              color: "#1e40af",
              border: "1px solid #3b82f6",
            },
          },
        }}
      />
    </>
  );
}

export default Toasters