import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { SquareArrowOutUpRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { setAllAdminJobs } from '@/redux/jobSlice'
import { toast } from 'sonner'


const SuperAdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText?.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchJobByText?.toLowerCase());

        });
        setFilterJobs(filteredJobs);

    }, [allAdminJobs, searchJobByText])


    const handleJobDelete = async (jobId) => {
        if (!window.confirm(`Are you sure to delete the Job?`)) {
            return;
        }

        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/superadmin/deletejob/${jobId}`, {
                withCredentials: true,
            });

            if (res?.data?.success) {
                dispatch(setAllAdminJobs(res?.data?.jobs));

                toast.success(res?.data?.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete job');
        } finally {
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of recent posted jobs.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company Name</TableHead>
                        <TableHead className="text-center">Applicants</TableHead>
                        <TableHead className="text-center">Edit</TableHead>
                        <TableHead className="text-right -translate-x-[10px]">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job) => {

                            return (
                                <TableRow key={`JOB_${job?._id}`}>
                                    <TableCell>{job?.title}</TableCell>
                                    <TableCell>
                                        {
                                            job?.company?.name ||
                                            (<span className="text-gray-500">&lt;Unknown&gt;</span>)
                                        }
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Link to={`/superadmin/jobs/${job._id}/applicants`}>
                                            <Badge className="bg-green-600 hover:bg-green-800">
                                                <SquareArrowOutUpRight className='h-3 w-3 mr-2' />
                                                <p className='font-bold'>Applicants</p>
                                            </Badge>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            onClick={() => navigate(`/superadmin/jobs/${job._id}`)}
                                            className="h-fit p-0 bg-transparent hover:bg-transparent"
                                            title="Edit Job"
                                        >
                                            <Badge>
                                                Edit
                                            </Badge>
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Button
                                            onClick={() => handleJobDelete(job._id)}
                                            className="h-fit p-0 bg-transparent hover:bg-transparent"
                                            title="Delete Job"
                                        >
                                            <Badge className="bg-[#FF2929] hover:bg-red-900">
                                                Delete
                                            </Badge>
                                        </Button>
                                    </TableCell>
                                </TableRow>

                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default SuperAdminJobsTable