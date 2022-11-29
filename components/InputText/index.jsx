import React from "react";

const InputText = ({ amount, onChange }) => {
  return (
    <div class="relative px-2">
      <input
        defaultValue={1}
        value={amount}
        onChange={onChange}
        onKeyPress={(event) => {
          if (!/[\d+((\.|)\d+)?]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        className="md:w-full rounded-md w-[120px]  py-2.5 pr-10  sm:text-sm p-2  hover:border-0"
      />
    </div>
  );
};

export default InputText;
