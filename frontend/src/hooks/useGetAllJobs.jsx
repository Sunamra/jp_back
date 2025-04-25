import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    const filterJobs = (jobs, query) => {
        if (!query) return jobs;

        return jobs.filter(job => {
            const searchableFields = [
                job?.title,
                job?.description,
                ...job?.requirements,
                job?.salary?.toString(),
                job?.location,
                job?.jobType,
                job?.company?.name,
                // job.company.description,
                // job.company.location,
            ];
            return searchableFields?.some(field => field?.toLowerCase().includes(String(query).toLowerCase()));
        });
    };

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, { withCredentials: true });
                if (res?.data?.success) {
                    dispatch(setAllJobs(filterJobs(res?.data?.jobs, searchedQuery)));
                    // console.log(res?.data?.jobs);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    }, [])
}

export default useGetAllJobs