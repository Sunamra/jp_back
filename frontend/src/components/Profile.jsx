import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, SquareArrowOutUpRight } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Link } from 'react-router-dom'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const isResume = user.profile.resume;

    return (
        <div>
            <Navbar />
            <div className={`max-w-4xl min-w-[350px] mx-auto border border-black rounded-2xl my-5 p-8`}>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.avatar} alt="profile" />
                        </Avatar>
                        <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                        {/* NO RECRUITER, ONLY FOR STUDENT */}
                        {
                            user && user.role == "student" ?
                                (
                                    <div>
                                        <p>{user?.profile?.bio}</p>
                                    </div>
                                ) :
                                <></>
                        }
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right bg-transparent hover:bg-[#C0392B] hover:text-white transition-all duration-100" variant="outline" title="Update Profile"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                {/* NO RECRUITER, ONLY FOR STUDENT */}
                {
                    user && user.role == "student" ?
                        (<>
                            <div className='my-5'>
                                <h1>Skills</h1>
                                <div className='flex items-center gap-1'>
                                    {
                                        user?.profile?.skills ?
                                            (user?.profile?.skills?.length !== 0 ? user?.profile?.skills?.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>)
                                            :
                                            <span>NA</span>
                                    }
                                </div>
                            </div>
                            <div className='grid w-full max-w-sm items-center gap-1.5'>
                                <Label className="text-md font-bold">Resume</Label>
                                {
                                    isResume ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                }
                            </div>
                        </>) :
                        <></>
                }
            </div>
            {/* NO RECRUITER, ONLY FOR STUDENT */}
            {
                user && user.role == "student" ?
                    (
                        <div className='max-w-4xl min-w-[350px] mx-auto rounded-2xl'>

                            <div className='flex items-center mt-5 mb-3'>
                                <Link to={"/bookmarks"}>
                                <Badge className="bg-[#C0392B]">
                                    <SquareArrowOutUpRight className='h-5 w-5 mr-2' />
                                    <p className='font-bold text-lg'>Bookmarked Jobs</p>
                                </Badge>
                                </Link>
                            </div>

                            <p className='font-bold text-lg mt-10 mb-3'>Applied Jobs</p>
                            <AppliedJobTable />
                        </div>
                    ) :
                    <></>
            }
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile