import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        if (query.trim() == "") {
            toast.error("Empty search query")
        }
        else {
            dispatch(setSearchedQuery(query));
            navigate("/browse");
        }
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                {/* <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span> */}
                {/* <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#C0392B]'>Dream Jobs</span></h1> */}
                <h1 className='text-5xl font-bold'>Take the Leap, Land the Dream<br /><span className='text-[#e3321f]'>Apply Now</span></h1>
                <p className='font-hubot'>Get hired faster by connecting with leading companies, personalized job matches, and professional resources.</p>
                <div className='flex lg:w-[40%]  sm:w-[60%] pl-3 rounded-full items-center gap-4 mx-auto border-2 border-transparent hover:border-[#e3321f] focus-within:border-[#C0392B] transition-all duration-300 shadow-[rgba(0,0,0,0.56)_-10px_20px_60px_5px]'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full bg-transparent h-[40px] placeholder-gray-500'

                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#e3321f] hover:bg-[#e3321f] group">
                        <Search className='h-5 w-5 group-hover:text-black transition-all transition-1000' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection