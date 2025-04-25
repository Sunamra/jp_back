import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { positionOrS } from '@/lib/utils'
import { toast } from 'sonner'
import { USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/authSlice'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const dayAgo = daysAgoFunction(job?.createdAt);

    const dayOrDays = (dayAgo) => {
        return dayAgo == 1 ? "day" : "days";
    }

    const handleBookmark = async () => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/bookmark`,
                { jobId: job._id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );
            if (res?.data?.success) {
                dispatch(setUser(res.data.user));
                toast.success(res?.data?.message)
            }
        } catch (error) {
            console.error('Error bookmarking job:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Failed to bookmark job');
        }
    };

    const isJobMarked = user?.bookmarkedJobs?.includes(job._id);
    // console.log(job)
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 w-[350px] min-w-[250px] border-2 border-transparent hover:border-[#C0392Bdd] hover:scale-105 transition-all duration-400'>
            <div className='flex justify-between h-5'>
                <p className='text-sm text-gray-500'>{dayAgo === 0 ? "Today" : `${dayAgo} ${dayOrDays(dayAgo)} ago`}</p>
                <Button onClick={handleBookmark} variant="outline" className="rounded-full" size="icon">
                    <Bookmark
                        className='text-[#0f172a]'
                        fill={isJobMarked ? '#0f172a' : 'none'}
                    />
                </Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6 cursor-default" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600 h-10 overflow-y-hidden'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} {positionOrS(job?.position)}</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex justify-center items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" style={{ width: '100%' }} className="text-white hover:text-white bg-[#C0392BDE] hover:bg-[#C0392B]">Details</Button>
                {/* <Button className="bg-[#7209b7]">Save For Later</Button> */}
            </div>
        </div>
    )
}

export default Job