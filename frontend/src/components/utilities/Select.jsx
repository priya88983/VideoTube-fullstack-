import React, { useId, forwardRef } from 'react'; // ✅ fixed import

const Select = (
    {
        options,
        label,
        className = "", // ✅ fixed typo from `classname` to `className`
        ...props
    },
    ref
) => {
    const id = useId();

    return (
        <div className='w-full'>
            {label && (
                <label htmlFor={id} className='block mb-1 font-medium'>
                    {label}
                </label>
            )}

            <select
                {...props}
                id={id}
                ref={ref}
                className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            >
                {options?.map((option, index) => ( // ✅ fixed map syntax
                    <option key={index} value={option}> {/* ✅ fixed key typo */}
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default forwardRef(Select); // ✅ correct use of forwardRef
