import React from 'react';

interface CardProps {
  title: string;
  value: number;
}

const Card: React.FC<CardProps> = ({ title, value }) => {
  return (
    <div className="w-full text-black h-full flex flex-col justify-between p-6 rounded-lg bg-white border border-black cursor-pointer hover:bg-[linear-gradient(to_right,#dd1aff,#9800b3)] hover:text-white hover:scale-105 shadow-lg hover:shadow-xl">
      <div className="w-full flex items-center justify-between">
        {/* Placeholder for icons */}
        {/* <Image width={20} height={20} src="yuff.svg" alt="icon" /> */}
        {/* <Image width={20} height={20} src="yuff.svg" alt="threeDots" /> */}
      </div>
      <div className="flex flex-col items-center justify-center text-center h-full">
        <p className="text-2xl font-semibold mb-2 ">{title}</p>
        <p className="text-4xl font-bold ">{value}</p>
      </div>
    </div>
  );
};

export default Card;