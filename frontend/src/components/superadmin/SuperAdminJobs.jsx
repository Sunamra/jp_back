import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SuperAdminJobsTable from './SuperAdminJobsTable'
import useGetAllSuperAdminJobs from '@/hooks/useGetAllSuperAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import useGetAllSuperAdminCompanies from '@/hooks/useGetAllSuperAdminCompanies'

const SuperAdminJobs = () => {
  useGetAllSuperAdminJobs();
  useGetAllSuperAdminCompanies();
  const [input, setInput] = useState("");
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, allAdminJobs]);
  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <SuperAdminJobsTable />
      </div>
    </div>
  )
}

export default SuperAdminJobs