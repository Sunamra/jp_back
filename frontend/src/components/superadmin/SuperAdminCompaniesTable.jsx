import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { COMPANY_API_END_POINT, USER_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setCompanies } from '@/redux/companySlice'

const SuperAdminCompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector((store) => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const [users, setUsers] = useState(null);
    const [jobs, setJobs] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const filteredCompany = companies?.filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase()) ||
                (company?.userId?.fullname?.toLowerCase())?.includes(searchCompanyByText?.toLowerCase());
        });
        setFilterCompany(filteredCompany);

        // Fetch all users
        const fetchAndSetUsers = async () => {
            const usersData = await fetchUsers();
            setUsers(usersData);
        };
        fetchAndSetUsers();


        const fetchAndSetJobs = async () => {
            const jobsData = await fetchJobs();
            setJobs(jobsData)
        };
        fetchAndSetJobs();


    }, [companies, searchCompanyByText]);

    const handleCompanyDelete = async (companyId) => {
        if (!window.confirm(`Are you sure to delete the company ${companies.find(item => item._id === companyId).name}?`)) {
            return;
        }

        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/superadmin/companies/${companyId}`, {
                withCredentials: true,
            });

            if (res?.data?.success) {
                dispatch(setCompanies(res?.data?.companies));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to delete company');
        } finally {
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/get`, {
                withCredentials: true,
            });

            if (res?.data?.success) {
                return res.data.users;
            }
            else {
                toast.error(res?.data?.message || "Failed to fetch users")
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        }
    }

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/get`, {
                withCredentials: true,
            });

            if (res?.data?.success) {
                return res?.data?.jobs;
            }
            else {
                toast.error(res?.data?.message || "Failed to fetch jobs")
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to fetch jobs');
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of recent registered companies.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Created By</TableHead>
                        <TableHead className="text-center">Total Jobs</TableHead>
                        <TableHead className="text-center">Date</TableHead>
                        <TableHead className="text-center">Edit</TableHead>
                        <TableHead className="text-right -translate-x-[10px]">Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company, index) => {
                            
                            return (company.registeredFully !== false || company.registeredFully === undefined ?
                                (
                                    <TableRow key={`ID_${index}`}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={company.logo} />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="text-center">{company.name}</TableCell>
                                        <TableCell className="text-center">
                                            {
                                                company.userId?.fullname ||
                                                (<span className="text-gray-500">&lt;Unknown&gt;</span>)

                                            }
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {
                                                jobs?.filter(item => item?.company?._id === company._id)?.length
                                            }
                                        </TableCell>
                                        <TableCell className="text-center">{company.createdAt.split('T')[0]}</TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                onClick={() => navigate(`/superadmin/companies/${company._id}`)}
                                                className="h-fit p-0 bg-transparent hover:bg-transparent"
                                                title="Edit Company"
                                            >
                                                <Badge>
                                                    Edit
                                                </Badge>
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right cursor-pointer">
                                            <Button
                                                onClick={() => handleCompanyDelete(company._id)}
                                                className="h-fit p-0 bg-transparent hover:bg-transparent"
                                                title="Delete Company"
                                            >
                                                <Badge className="bg-[#FF2929] hover:bg-red-900">
                                                    Delete
                                                </Badge>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) :
                                (
                                    <TableRow key={`ID_${index}`} className="text-gray-500" style={{ border: '2px dashed #FF4545' }}>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={company.logo} />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="text-center">{company.name}</TableCell>
                                        <TableCell className="text-center">
                                            {
                                                users?.find(item => item?._id === company.userId)?.fullname ||
                                                (<span className="text-gray-500">&lt;Unknown&gt;</span>)

                                            }
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="text-gray-500">NA</span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={"bg-[#536493]"}>Not&nbsp;Registered</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                onClick={() => navigate(`/superadmin/companies/${company._id}`)}
                                                className="h-fit p-0 bg-transparent hover:bg-transparent"
                                                title="Edit Company"
                                            >
                                                <Badge>Edit</Badge>
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right cursor-pointer">
                                            <Button
                                                onClick={() => handleCompanyDelete(company._id)}
                                                className="h-fit p-0 bg-transparent hover:bg-transparent"
                                                title="Delete Company"
                                            >
                                                <Badge className="bg-[#FF2929] hover:bg-red-900">Delete</Badge>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                        }
                        )
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default SuperAdminCompaniesTable;
