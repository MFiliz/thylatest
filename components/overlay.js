import React from "react";

const Overlay = ({ message = "Bekleyiniz..." }) => {
  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-100 flex items-center flex-col justify-center z-50"
      style={{ zIndex: 99999 }}
    >
      <div
        className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-red-500 "
        style={{ marginBottom: 20 }}
      ></div>
      <img
        src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"
        className="rounded-full h-28 w-28 mt-10"
      />
      <p className="text-black text-lg mt-5">{message}</p>
    </div>
  );
};

export default Overlay;
