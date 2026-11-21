import { useState, useEffect } from "react";
import Api from "../api/Api";
import UpdateCount from "../utilsUpdateCountCache/dashboardUpdate";
export default function RemoveButton({ value }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // handle apis call ========================================
  async function handleRemove(endPoint) {
    if (isDisabled) return;
    setMessage("");
    setIsDisabled(true);
    try {
      const response = await Api.delete(endPoint);
      setMessage(response.data.message);
      if (endPoint === "/books") {
        UpdateCount("totalBooks", "delete", response.data.deletedCount);
      } else if (endPoint === "/authors") {
        UpdateCount("totalAuthors", "delete", response.data.deletedCount);
      } else if (endPoint === "/users") {
        UpdateCount("totalUsers", "delete", response.data.deletedCount);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "something went wrong !";
      console.log(errorMessage);
      setMessage(errorMessage);
    } finally {
      setIsDisabled(false);
    }
  }
  // function handleclick
  async function handleClickButton() {
    setIsDeleting(true);
    try {
      if (value === "Remove Books") {
        await handleRemove("/books");
      } else if (value === "Remove Authors") {
        await handleRemove("/authors");
      } else if (value === "Remove Users") {
        await handleRemove("/users");
      } else {
        return;
      }
    } finally {
      setIsDeleting(false);
      setDialog(false);
    }
  }
  useEffect(() => {
    const time = setTimeout(() => {
      setMessage("");
    }, 3000);
    return () => {
      clearTimeout(time);
    };
  }, [message]);
  return (
    <>
      <button
        type="button"
        disabled={isDisabled}
        className="primary-button mt-5"
        onClick={() => {
          setDialog(true);
        }}
      >
        {isDisabled ? "Loading..." : value}
      </button>

      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-gray-800 p-6 shadow-xl">
            <h4 className="mb-6 text-lg font-bold text-white">
              Are you sure you want to delete All Data?
            </h4>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="secondary-buuton"
                disabled={isDeleting}
                onClick={handleClickButton}
              >
                {isDeleting ? "Deleting..." : "confirm"}
              </button>

              <button
                type="button"
                className="secondary-buuton"
                onClick={() => {
                  setDialog(false);
                }}
              >
                Cancel
              </button>
            </div>
            {message && (
              <p className="text-white mb-4 mt-4 bg-green-500 rounded-lg w-full ml-[30%] text-sm font-body font-medium lg:text-lg">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
