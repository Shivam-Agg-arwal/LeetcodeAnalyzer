// Tooltip.js
import React from 'react';

const Tooltip = ({ text, children }) => (
    <div className="relative inline-block">
        <div className="tooltip">
            {children}
            <div className="tooltiptext">{text}</div>
        </div>
        <style jsx>{`
            .tooltip {
                position: relative;
                display: inline-block;
            }

            .tooltiptext {
                visibility: hidden;
                background-color: #333;
                color: #fff;
                text-align: center;
                border-radius: 4px;
                padding: 8px;
                position: absolute;
                z-index: 10;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: opacity 0.3s, visibility 0.3s;
                white-space: nowrap;
            }

            .tooltip:hover .tooltiptext {
                visibility: visible;
                opacity: 1;
            }
        `}</style>
    </div>
);

export default Tooltip;
