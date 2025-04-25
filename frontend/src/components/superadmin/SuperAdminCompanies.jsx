import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import SuperAdminCompaniesTable from './SuperAdminCompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllSuperAdminCompanies from '@/hooks/useGetAllSuperAdminCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'

const SuperAdminCompanies = () => {
    useGetAllSuperAdminCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input]);
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit"
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <SuperAdminCompaniesTable/>
            </div>
        </div>
    )
}

export default SuperAdminCompanies