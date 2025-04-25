import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const [delayedJobs, setDelayedJobs] = useState([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDelayedJobs(allJobs);
        }, 50);

        return () => {
            clearTimeout(timeout);
            dispatch(setSearchedQuery(""));
        };
    }, [allJobs]);

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto py-10">
                <h1 className="font-bold text-xl mb-10">Search Results {delayedJobs.length}</h1>
                <div className="flex flex-wrap justify-center gap-4">
                    {delayedJobs.map((job) => (
                        <Job key={job._id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Browse;
