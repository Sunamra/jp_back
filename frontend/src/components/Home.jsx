import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from './ui/badge'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { X, TriangleAlert } from 'lucide-react'
import { Button } from './ui/button'
import { setWarningClosed } from '@/redux/authSlice'


const Home = () => {
	useGetAllJobs();
	const { user, warningClosed } = useSelector(store => store.auth);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	useEffect(() => {
		if (user?.role === 'recruiter') {
			navigate("/admin/companies");
		}
		if (user?.role === 'superadmin') {
			navigate("/superadmin/companies");
		}
		if (user && user.role === "student" && !isProfileComplete() && !warningClosed) {
			setOpen(true);
		}
	}, []);

	const closeHandler = () => {
		dispatch(setWarningClosed(true));
		setOpen(false);
	}

	const isProfileComplete = () => {
		return Boolean(user?.profile?.skills &&
			user?.profile?.skills?.length != 0 &&
			user?.profile?.bio &&
			user?.profile?.resume)
	}
	const missingInProfile = [
		!user?.profile?.bio && "Bio",
		(!user?.profile?.skills || user?.profile?.skills?.length === 0) && "Skills",
		!user?.profile?.resume && "Resume",
	].filter(Boolean);

	return (
		<div className='h-[98.7vh] flex flex-col justify-between'>
			<Navbar />
			{
				user ?
					<>
						<HeroSection />
						<CategoryCarousel />
						<LatestJobs />

						{/* Dialog to Prompt user to complete Profile */}
						<Dialog open={open} className="relative top-8 left-4">
							<DialogContent className="px-3 max-w-[500px] min-w-[300px] max-h-[370px]">
								<DialogHeader className="flex-row justify-center">
									<DialogTitle className="flex justify-center" ><TriangleAlert className='h-[70px] w-[70px] text-red-500' /></DialogTitle>
									<DialogClose onClick={closeHandler} title="Close" className="absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100 outline-none">
										<X className="h-5 w-5" />
									</DialogClose>
								</DialogHeader>
								<div className='flex flex-col items-center'>
									<p className='text-2xl font-bold font-times'>Please Complete Your Profile</p>
									{
										missingInProfile.length != 0 ?
											(
												<p className='text-sm font-hubot text-gray-500'>Missing: {missingInProfile.map((items, index) => {
													if (items) {
														return (
															<span key={index} className='text-gray-800'>
																{items}{index < missingInProfile.length - 1 ? ', ' : ''}
															</span>
														);
													}
												})}
												</p>
											) :
											<></>
									}
								</div>
								<DialogFooter className="sm:flex-col sm:justify-center ">
									<Button onClick={() => { navigate("./profile") }} type="button" className="w-full">Go to Profile</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</> :
					<div className='flex flex-col min-h-[350px] min-w-[350px] gap-6 justify-center items-center'>
						<p className='text-5xl font-bold'><span className='text-[#e3321f]'>SignUp</span> to Explore more.</p>
						<p className='text-3xl font-bold'>Find your <span className='text-[#0A3981]'>Dream Job</span> today.</p>
						<p className='text-xl font-bold'>Already have an account?<Link to="/login"><Badge className='-translate-y-[3px] translate-x-2'> Login Here</Badge></Link></p>
					</div>
			}
			<Footer />
		</div>
	)
}

export default Home