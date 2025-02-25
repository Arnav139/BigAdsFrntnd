import React, { useState } from 'react';

interface AnalyticCounts{
    total: number;
    a: number;
    b: number;
}

const AnalyticCounts = ({ total, a, b }: AnalyticCounts) => {
    const aN = Number(a);
    const bN = Number(b);
    const totalN = Number(total);

    // console.log(aN, bN, totalN, " countData");

    // Normalize percentages to ensure they don't exceed 100%
    const aP = Math.round((aN / totalN) * 100);
    const bP = Math.round((bN / totalN) * 100);

    // Example data for bars
    const bars = [
        { name: 'Polygon', value: aN, percentage: aP, color: '#8B5CF6' }, // Purple
        { name: 'Diamante', value: bN, percentage: bP, color: '#3B82F6' }, // Blue
    ];

    // State to manage modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* Main Component */}
            <div className='w-full h-full flex flex-col justify-between p-6 rounded-lg  bg-white border border-black shadow-lg hover:shadow-xl transition-all duration-300'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                    <p className='text-[14px] md:text-xl font-semibold text-black'>Transaction Analytics</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='text-sm text-black hover:text-purple-300 transition-all duration-300'
                    >
                        View All
                    </button>
                </div>

                {/* Bars */}
                <div className='w-full h-[200px] overflow-y-auto scroll-hidden mt-4'>
                    <div className='flex flex-col space-y-6'>
                        {bars.map((bar, index) => (
                            <div key={index} className='w-full relative'>
                                {/* Bar Labels */}
                                <div className='flex justify-between text-sm text-black'>
                                    <span>{bar.name}</span>
                                    <span>{bar.percentage}%</span>
                                </div>

                                {/* Progress Bar Container */}
                                <div className='w-full h-3 bg-[#1F2937] rounded-full mt-2 overflow-hidden'>
                                    {/* Progress Bar */}
                                    <div
                                        style={{ width: `${bar.percentage}%`, backgroundColor: bar.color }}
                                        className='h-full rounded-full transition-all duration-500'
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#14191F99] z-50'>
                    <div className='w-[90%] md:w-[60%] lg:w-[50%] bg-white border border-[#31373F] rounded-lg p-6 shadow-2xl'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between mb-6'>
                            <p className='text-2xl font-semibold text-black'>Transaction Analytics</p>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className='text-2xl text-black hover:text-white transition-all duration-300 p-2'
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className='w-full max-h-[60vh] overflow-y-auto scroll-hidden'>
                            <div className='flex flex-col space-y-6'>
                                {bars.map((bar, index) => (
                                    <div key={index} className='w-full relative'>
                                        {/* Bar Labels */}
                                        <div className='flex justify-between text-sm text-black'>
                                            <span>{bar.name}</span>
                                            <span>{bar.value} ({bar.percentage}%)</span>
                                        </div>

                                        {/* Progress Bar Container */}
                                        <div className='w-full h-3 bg-[#1F2937] rounded-full mt-2 overflow-hidden'>
                                            {/* Progress Bar */}
                                            <div
                                                style={{ width: `${bar.percentage}%`, backgroundColor: bar.color }}
                                                className='h-full rounded-full transition-all duration-500'
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AnalyticCounts;