import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const useGetAllSuperAdminCompanies = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchSuperAdminCompanies = async () => {
			try {
				const res = await axios.get(`${COMPANY_API_END_POINT}/superadmin/get`, { withCredentials: true });
				// console.log(res);
				if (res?.data?.success) {
					dispatch(setCompanies(res?.data?.companies));
				}
			} catch (error) {
				console.error(error);
				toast.error(error.response?.data?.message || "Failed to fetch companies")
			}
		};

		fetchSuperAdminCompanies();
	}, []);
};

export default useGetAllSuperAdminCompanies;
