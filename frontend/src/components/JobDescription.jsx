import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import { positionOrS, toTitleCase } from '@/lib/utils';


const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);

    const params = useParams();
    const dispatch = useDispatch();

    const jobId = params.id;
    const userApplication = singleJob?.applications?.find(application => application.applicant === user?._id);
    const applicationStatus = userApplication ? userApplication.status : null; // 'pending', 'accepted', or 'rejected'

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res?.data?.success) {
                setIsApplied(true); // Update the local state
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res?.data?.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error);
        }
    }
console.log(singleJob);

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res?.data?.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id, applicationStatus]);

    const experienceYrs = (year) => {
        return year == 0 ? 'NA' : year == 1 ? `${year} Year` : `${year} Years`;
    }

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto py-10'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                        <div className='flex items-center gap-2 mt-4'>
                            <Badge className={'text-blue-700 font-bold border-black'} variant="ghost">{singleJob?.position} {positionOrS(singleJob?.position)}</Badge>
                            <Badge className={'text-[#F83002] font-bold border-black'} variant="ghost">{singleJob?.jobType}</Badge>
                            <Badge className={'text-[#7209b7] font-bold border-black'} variant="ghost">{singleJob?.salary} LPA</Badge>
                        </div>
                    </div>
                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`rounded-lg ${isApplied ?
                            applicationStatus == "accepted" ?
                                'bg-green-600' :
                                applicationStatus == "rejected" ?
                                    'bg-red-600' :
                                    'bg-gray-600' :
                            'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                        {
                            applicationStatus && isApplied ?
                                (
                                    applicationStatus == "pending" ?
                                        'Already Applied' :
                                        toTitleCase(applicationStatus)
                                ) :
                                'Apply Now'
                        }
                    </Button>
                </div>
                <h1 className='border-b border-b-black font-medium py-4'>Job Description</h1>
                <div className='my-4'>
                    <h1 className='font-bold my-1'>Company: <span className='pl-4 font-normal text-gray-800'>
                        {
                            singleJob?.company?.name ||
                            (<span className="text-gray-500">&lt;Unknown&gt;</span>)
                        }
                    </span></h1>
                    <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                    <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                    <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                    <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{experienceYrs(singleJob?.experienceLevel)}</span></h1>
                    <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                    <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                    <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
                </div>
            </div>
        </div >
    )
}

export default JobDescription