import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useSelector } from 'react-redux';

const BookmarkedJobs = () => {
	const { allJobs } = useSelector((store) => store.job);
	const { user } = useSelector((store) => store.auth);

	const [bookmarkedJobs, setBookmarkedJobs] = useState([]);

	const filterMarkedJobs = () => {
		if (user?.bookmarkedJobs) {
			setBookmarkedJobs(allJobs.filter((job) => user.bookmarkedJobs.includes(job?._id)));
		} else {
			setBookmarkedJobs([]);
		}
	};

	useEffect(() => {
		filterMarkedJobs();
	}, [user?.bookmarkedJobs, allJobs]);

	return (
		<div>
			<Navbar />
			<div className="max-w-7xl mx-auto mt-5">
				<div className="flex justify-center gap-5">
					{
						bookmarkedJobs.length === 0 ?
							(
								<div className="flex h-[70vh] w-full min-w-[350px] justify-center items-center pb-5">
									<span className="text-[2rem] font-bold">You haven't Bookmarked any Jobs.</span>
								</div>
							) :
							(
								<div className="flex pb-5">
									<div className="flex flex-wrap justify-center mt-5 ml-5 gap-4">
										{
											bookmarkedJobs.map((job) => (
												<div key={job?._id} className="fade-in">
													<Job job={job} />
												</div>
											))
										}
									</div>
								</div>
							)
					}
				</div>
			</div>
		</div>
	);
};

export default BookmarkedJobs;
