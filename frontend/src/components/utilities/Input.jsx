import React, { useId } from "react";

const Input = React.forwardRef(function Input(
  {
    label,
    type = "text",
    labelClassName = "",
    inputClassName = "",
    ...props
  },
  ref
) {
  const id = useId();

  return (
    <div className="w-full flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        ref={ref}
        className={`px-3 py-2 rounded-md bg-white text-black border border-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${inputClassName}`}
        {...props}
      />
    </div>
  );
});

export default Input;
