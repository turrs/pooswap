import React from "react";

const ImageToken = ({ image }) => {
  return (
    <div className=" flex justify-center items-center w-[40px] h-[40px]">
      <img src={image} />
    </div>
  );
};

export default ImageToken;
