import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser, setWarningClosed } from '@/redux/authSlice'
import { toast } from 'sonner'
import { useLocation } from 'react-router-dom'
import { Badge } from '../ui/badge'
import { toTitleCase } from '@/lib/utils'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const path = useLocation().pathname;

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                dispatch(setWarningClosed(false));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div>
            <div className='flex items-center justify-between mx-auto h-16'>
                {/* <Link to="/"> First Ever Change to Frontend by me! */}
                <Link to={user && user?.role == 'recruiter' ? '/admin/companies' :
                    user?.role == "superadmin" ? '/superadmin/companies' :
                        '/'}>
                    <div>
                        <h1 className='text-2xl font-bold'>Career<span className='text-[#e3321f] font-caveat'>Sync</span></h1>
                    </div>
                </Link>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-7'>
                        {
                            user && user.role === 'recruiter' ?
                                (
                                    <>
                                        <Link to="/admin/companies">
                                            <li className={`hover-underline ${path == "/admin/companies" ? 'permanent-underline' : ''}`}>
                                                Companies
                                            </li>
                                        </Link>
                                        <Link to="/admin/jobs">
                                            <li className={`hover-underline ${path == "/admin/jobs" ? 'permanent-underline' : ''}`}>
                                                Jobs
                                            </li>
                                        </Link>
                                    </>
                                ) :
                                user && user.role == 'student' ?
                                    (
                                        <>
                                            <Link to="/">
                                                <li className={`hover-underline ${path == "/" ? 'permanent-underline' : ''}`}>
                                                    Home
                                                </li>
                                            </Link>
                                            <Link to="/jobs">
                                                <li className={`hover-underline ${path == "/jobs" ? 'permanent-underline' : ''}`}>
                                                    Browse Jobs
                                                </li>
                                            </Link>
                                        </>
                                    ) :
                                    user && user.role === 'superadmin' ?
                                        (
                                            <>
                                                <Link to="/superadmin/users">
                                                    <li className={`hover-underline ${path == "/superadmin/users" ? 'permanent-underline' : ''}`}>
                                                        Users
                                                    </li>
                                                </Link>
                                                <Link to="/superadmin/companies">
                                                    <li className={`hover-underline ${path == "/superadmin/companies" ? 'permanent-underline' : ''}`}>
                                                        Companies
                                                    </li>
                                                </Link>
                                                <Link to="/superadmin/jobs">
                                                    <li className={`hover-underline ${path == "/superadmin/jobs" ? 'permanent-underline' : ''}`}>
                                                        Jobs
                                                    </li>
                                                </Link>
                                            </>
                                        ) :
                                        (
                                            <>

                                            </>
                                        )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#e3321f]">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src={user?.profile?.avatar} alt="Avatar Image" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src={user?.profile?.avatar} alt="Avatar Image" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{user?.fullname}</h4>
                                                {
                                                    user && user.role === 'student' ?
                                                        <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                                        : <></>
                                                }
                                            </div>
                                            <div className='ml-auto'>
                                                <Badge className={`
                                                 ${user?.role == "student" ? 'bg-green-500 hover:bg-green-500' :
                                                        user?.role == "recruiter" ? 'bg-blue-500 hover:bg-blue-500' :
                                                            user?.role == "superadmin" ? 'bg-orange-600 hover:bg-orange-600' :
                                                                ""
                                                    }
                                                 `}>
                                                    {
                                                        toTitleCase(user?.role)
                                                    }
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            <Link to="/profile">
                                                <div className='flex w-fit items-center gap-2 cursor-pointer outline-none'>
                                                    <User2 />
                                                    <Button variant="link" className="focus-visible:ring-0 focus-visible:ring-offset-0"> View Profile</Button>
                                                </div>
                                            </Link>
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link" className="focus-visible:ring-0 focus-visible:ring-offset-0">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar