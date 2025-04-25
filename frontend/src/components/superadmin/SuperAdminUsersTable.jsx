import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setAllUsers } from '@/redux/authSlice';
import { toTitleCase } from '@/lib/utils';

const SuperAdminUsersTable = () => {
    const { allUsers, searchUserByText } = useSelector(store => store.auth);

    const [filterUsers, setFilterUsers] = useState(allUsers);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const filterUsers = allUsers?.filter((user) => {
            if (!searchUserByText) {
                return true;
            };
            return user?.fullname?.toLowerCase()?.includes(searchUserByText?.toLowerCase()) ||
                user?.email?.toLowerCase()?.includes(searchUserByText?.toLowerCase()) ||
                user?.phoneNumber?.toString()?.includes(searchUserByText?.toLowerCase()) ||
                user?.role?.toLowerCase()?.includes(searchUserByText?.toLowerCase());

        });
        setFilterUsers(filterUsers);

    }, [allUsers, searchUserByText])


    const handleUserDelete = async (userId, userName) => {
        if (!window.confirm(`Are you sure to delete user ${userName || ""}?`)) {
            return;
        }
        // return;
        try {
            const res = await axios.delete(`${USER_API_END_POINT}/superadmin/deleteuser/${userId}`, {
                withCredentials: true,
            });

            if (res?.data?.success) {
                dispatch(setAllUsers(res?.data?.users));

                toast.success(res?.data?.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        } finally {
        }
    };
    return (
        <div>
            <Table>
                <TableCaption>A list of recent registered users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full&nbsp;Name</TableHead>
                        <TableHead className="text-center">User&nbsp;Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact&nbsp;No.</TableHead>
                        {/* <TableHead className="text-center">Edit</TableHead> */}
                        <TableHead className="text-right -translate-x-[10px]">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterUsers?.map((user, index) => {
                            return (
                                user?.role !== "superadmin" ?
                                    (
                                        <TableRow key={`JOB_${user?._id}`}>
                                            <TableCell className="text-[1.2rem]">{user?.fullname}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={`${user?.role == "student" ? "bg-green-500 hover:bg-green-500" :
                                                    user?.role == "recruiter" ? "bg-blue-500 hover:bg-blue-500" :
                                                        "bg-transparent"}`}>
                                                    {toTitleCase(user?.role)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{user?.email}</TableCell>
                                            <TableCell>{user?.phoneNumber}</TableCell>
                                            {/* <TableCell className="text-center">
                                                <Button
                                                    onClick={() => navigate(`/superadmin/jobs/${user._id}`)}
                                                    className="h-fit p-0 bg-transparent hover:bg-transparent"
                                                    title="Edit Job"
                                                >
                                                    <Badge>
                                                        Edit
                                                    </Badge>
                                                </Button>
                                            </TableCell> */}
                                            <TableCell className="text-right cursor-pointer">
                                                <Button
                                                    onClick={() => handleUserDelete(user._id, user.fullname)}
                                                    className="h-fit p-0 bg-transparent hover:bg-transparent"
                                                    title="Delete Job"
                                                    disabled={user?.role == "superadmin"}
                                                >
                                                    <Badge className={`bg-[#FF2929] hover:bg-red-900`}>
                                                        Delete
                                                    </Badge>
                                                </Button>
                                            </TableCell>
                                        </TableRow>

                                    ) :
                                    (<TableRow key={`ID_${index}`}></TableRow>)
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
};

export default SuperAdminUsersTable;
