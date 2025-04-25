import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants, setStatusUpdated } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants, statusUpdated } = useSelector(store => store.application);


    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
        if (statusUpdated) {
            dispatch(setStatusUpdated(false));
        }
    }, [statusUpdated]);

    const applicantCount = applicants?.applications?.filter(a => a.status == "pending").length;

    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4'>
                <h1 className='font-bold text-xl my-5'>
                    {applicantCount <= 1 ? "Applicant" : "Applicants"} : {applicantCount}
                </h1>
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants