import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchUserByText } from '@/redux/authSlice'
import { setAllUsers } from '@/redux/authSlice'
import SuperAdminUsersTable from './SuperAdminUsersTable'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'

const SuperAdminUsers = () => {
	const [input, setInput] = useState("");
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setSearchUserByText(input));

		const fetchAndSetUsers = async () => {
			const usersData = await fetchUsers();
			dispatch(setAllUsers(usersData));
		};
		fetchAndSetUsers();

	}, [ input]);

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
				<SuperAdminUsersTable />
			</div>
		</div>
	)
}

export default SuperAdminUsers