'use client';

import Image from "next/image";

export const ExploreBtn = () => {
    return (
        <button
        type="button"
        className='mt-7 mx-auto flex cursor-pointer items-center  bg-white/5 rounded-full
        p-4 w-full md:w-64 justify-between hover:bg-white/10 focus:outline-none
        focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
        >
            <a className={'mx-auto'} href="#events">Explore More</a>
            <Image src='icons/arrow-down.svg' alt={'arrow-down'} width={24} height={24} />
        </button>
    )
}