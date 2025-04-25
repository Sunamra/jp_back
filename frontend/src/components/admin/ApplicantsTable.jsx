import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { useDispatch } from 'react-redux';
import { setStatusUpdated } from '@/redux/applicationSlice';


const shortlistingStatus = ["Accept", "Reject"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        const statusString = status == shortlistingStatus[0] ? "accepted" :
            status == shortlistingStatus[1] ? "rejected" :
                "pending";
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status: statusString });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setStatusUpdated(true)); // Dispatch to update the statusUpdated flag
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item, index) => (
                            item?.status == "pending" ?

                                <tr key={`ID_${index}`}>
                                    <TableCell>{item?.applicant?.fullname}</TableCell>
                                    <TableCell>{item?.applicant?.email}</TableCell>
                                    <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                    <TableCell >
                                        {
                                            item.applicant?.profile?.resume ?
                                                <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank"
                                                    rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> :
                                                <span>NA</span>
                                        }
                                    </TableCell>
                                    <TableCell>{item?.applicant?.createdAt?.split("T")[0]}</TableCell>
                                    <TableCell className="float-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32 p-2">
                                                {
                                                    shortlistingStatus?.map((status, index) => {
                                                        return (
                                                            <div onClick={() => statusHandler(status, item?._id)} key={index}
                                                                className={`flex justify-center items-center my-1 cursor-pointer `}>
                                                                <Badge className={`p-2 w-full justify-center bg-transparent text-[20px] text-black 
                                                                ${status == "Accept" ?
                                                                        "hover:text-white hover:bg-[#35af0c] active:bg-[#35af0caa] active:transition-none" :
                                                                        "hover:text-white hover:bg-[#FF2929] active:bg-[#FF2929aa] active:transition-none"}`}>
                                                                    {status}
                                                                </Badge>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </PopoverContent>
                                        </Popover>

                                    </TableCell>

                                </tr> :
                                <tr key={`ID_${index}`}></tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable