import React from 'react';

const Tooltip = ({ text, children }) => (
    <div className="relative inline-block">
        <div className="group">
            {children}
            <div className="absolute w-[200px] invisible group-hover:visible bg-gray-800 text-white text-sm rounded py-1 px-2 bottom-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {text}
            </div>
        </div>
    </div>
);

export default Tooltip;
