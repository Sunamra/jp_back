import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { filterData } from '../utils/filterData'

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery && Object.keys(searchedQuery).length > 0) {
            const queryValues = Object.values(searchedQuery).map(value => String(value).toLowerCase());
            const salaryFilter = filterData.find(f => f.filterType == "Salary");

            const filteredJobs = allJobs.filter((job) => {
                return queryValues.some(query => {

                    if (salaryFilter.array.includes(query)) {
                        const salaryIndex = salaryFilter.array.indexOf(query);
                        const salaryValue = salaryFilter.value[salaryIndex];

                        return (job.salary >= Math.min(...salaryValue) &&
                            job.salary < Math.max(...salaryValue))
                    }
                    return (
                        job.title.toLowerCase().includes(query) ||
                        job.description.toLowerCase().includes(query) ||
                        job.location.toLowerCase().includes(query)
                    );
                });
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ?
                            <div className='flex w-full min-w-[350px] justify-center items-center pb-5'>
                                <span className='text-[2rem] font-bold'>Job not found</span>
                            </div> :
                            (
                                <div className='flex pb-5'>
                                    <div className='flex flex-wrap justify-center mt-5 ml-5 gap-4'>
                                        {
                                            filterJobs.map((job) => {
                                                return (
                                                    <div key={job?._id} className='fade-in'>
                                                        <Job job={job} />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs