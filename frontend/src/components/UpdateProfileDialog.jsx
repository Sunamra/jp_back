import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { X } from "lucide-react"
import UpdatePasswordDialog from './UpdatePasswordDialog'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [openPassDialog, setOpenPassDialog] = useState(false);
    const [dialogHeight, setDialogHeight] = useState(null);  // Set initial height to 'auto' to fit content
    const dialogContentRef = useRef(null);  // Create a ref for DialogContent
    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || 0,
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills || [],
        file1: user?.profile?.resume || "",
        file2: user?.profile?.avatar || ""
    });
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const fileType = e.target.name; // either 'file1' or 'file2'
        const file = e.target.files?.[0];
        setInput(prevState => ({
            ...prevState,
            [fileType]: file
        }));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file1) {
            formData.append("file1", input.file1);
        }
        if (input.file2) {
            formData.append("file2", input.file2);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                toast.error(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
        setOpen(false);
    }
    
    useEffect(() => {
        const updateHeight = () => {
            const windowHeight = window.innerHeight;

            const dialogContent = dialogContentRef.current;
            if (!dialogContent) return;

            let contentHeight = dialogContent.scrollHeight || dialogContent.getBoundingClientRect().height;

            if (windowHeight <= (contentHeight + 55)) {
                setDialogHeight(windowHeight * 0.93);
            } else {
                setDialogHeight('fit-content');
            }
            console.log(windowHeight, "<=>", contentHeight);
        };


        const timer = setTimeout(() => {
            if (open) {
                updateHeight();
            }
        }, 0);

        window.addEventListener('resize', updateHeight);
        window.addEventListener('load', updateHeight);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateHeight);
            window.removeEventListener('load', updateHeight);
        };
    }, [open]);

    return (
        <div>
            <Dialog open={open}>
                <DialogContent
                    ref={dialogContentRef}
                    className={"max-w-[500px] min-w-[350px] dialog-content"}
                    style={{ height: dialogHeight }}
                >
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                        <DialogClose onClick={() => setOpen(false)} title='Close' className="absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-5 w-5" />
                        </DialogClose>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-5 items-center gap-4'>
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-4"
                                />
                            </div>
                            <div className='grid grid-cols-5 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-4"
                                />
                            </div>
                            {
                                user && user.role == "student" ?
                                    (
                                        <>
                                            <div className='grid grid-cols-5 items-center gap-4'>
                                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                                <Input
                                                    id="bio"
                                                    name="bio"
                                                    value={input.bio}
                                                    onChange={changeEventHandler}
                                                    className="col-span-4"
                                                />
                                            </div>
                                            <div className='grid grid-cols-5 items-center gap-4'>
                                                <Label htmlFor="skills" className="text-right">Skills</Label>
                                                <Input
                                                    id="skills"
                                                    name="skills"
                                                    value={input.skills}
                                                    onChange={changeEventHandler}
                                                    className="col-span-4"
                                                />
                                            </div>
                                            <div className='grid grid-cols-5 items-center gap-4'>
                                                <Label htmlFor="file1" className="text-right">Resume</Label>
                                                <Input
                                                    id="resume"
                                                    name="file1"
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={fileChangeHandler}
                                                    className="col-span-4 cursor-pointer"
                                                />
                                            </div>
                                        </>
                                    ) : null
                            }
                            <div className='grid grid-cols-5 items-center gap-4'>
                                <Label htmlFor="file2" className="text-right">Avatar</Label>
                                <Input
                                    id="profile"
                                    name="file2"
                                    type="file"
                                    accept="image/*"
                                    onChange={fileChangeHandler}
                                    className="col-span-4 cursor-pointer"
                                />
                            </div>
                            <div className='grid grid-cols-5 items-center gap-4'>
                                <Label htmlFor="password" className="text-right">Password</Label>
                                <Button type="button" onClick={() => { setOpenPassDialog(true) }} className="col-span-4 bg-transparent border text-gray-500 hover:bg-gray-300">Change Password</Button>
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ?
                                    <Button className="w-full my-4 mt-5"> <Loader2 className='mx-2 h-4 w-4 animate-spin' /> Please wait </Button> :
                                    <Button type="submit" className="w-full mt-5">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <UpdatePasswordDialog open={openPassDialog} setOpen={setOpenPassDialog} />
        </div>
    );
}

export default UpdateProfileDialog;
