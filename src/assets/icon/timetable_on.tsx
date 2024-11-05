import React from 'react';
const TimetableOn: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="640" height="640" fill="white" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 5H5V17H14V5ZM25 13H16V25H25V13ZM16 5H25V11H16V5ZM14 19H5V25H14V19Z"
      fill="black"
    />
  </svg>
);

export default TimetableOn;
