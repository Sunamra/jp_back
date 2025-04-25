import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';

const JobEdit = () => {
	const { id } = useParams(); // Get job ID from URL
	const [job, setJob] = useState(null);
	const [fetching, setFetching] = useState(false);
	const [updating, setUpdating] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [input, setInput] = useState({
		title: "",
		description: "",
		requirements: "",
		salary: "",
		location: "",
		jobType: "",
		experienceLevel: 0,
		position: 0
	}); // Store editable job details

	// Fetch job details
	useEffect(() => {
		const fetchJobDetails = async () => {
			try {
				setFetching(true);
				const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
					withCredentials: true,
				});
				if (res.data.success) {
					setJob(res.data.job);
					setInput(res.data.job); // Initialize input fields with job details

				} else {
					toast.error('Failed to load job details');
				}
			} catch (error) {
				toast.error(error.response?.data?.message || 'An error occurred while fetching job details.');
			} finally {
				setFetching(false);
			}
		};
		fetchJobDetails();
	}, [id]);

	// Handle input changes
	const handleChange = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value });
	};

	// Submit updated job details
	const handleUpdate = async (e) => {
		e.preventDefault();

		setUpdating(true);

		// Validate form input
		if (!input.title ||
			!input.description ||
			!input.requirements ||
			!input.salary ||
			!input.location ||
			!input.jobType ||
			!input.experienceLevel ||
			!input.position
		) {
			toast.error("Please fill out all fields");
			setUpdating(false);
			return;
		}

		const formData = new FormData();
		formData.append("title", input.title);
		formData.append("description", input.description);
		formData.append("requirements", input.requirements);
		formData.append("salary", input.salary);
		formData.append("location", input.location);
		formData.append("jobType", input.jobType);
		formData.append("experienceLevel", input.experienceLevel);
		formData.append("position", input.position);

		try {
			// Submit the form data
			const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, formData, {
				headers: {
					'Content-Type': 'application/json',
				},
				withCredentials: true,
			});
			if (res?.data?.success) {
				toast.success('Job updated successfully.');
				setJob(input); // Update local job state
				navigate('/superadmin/jobs');
			}
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to update job');
		} finally {
			setUpdating(false);
		}
	};

	return (
		<div>
			<Navbar />

			<div className="p-8 max-w-xl min-w-[350px] mx-auto my-5 border border-gray-200 shadow-lg rounded-md">
				<div className='flex items-center gap-5 pb-8'>
					<Button onClick={() => navigate("/superadmin/jobs")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
						<ArrowLeft />
						<span>Back</span>
					</Button>
					<h1 className="text-xl font-bold ">Job Details</h1>
				</div>
				{
					job ?
						(
							<form onSubmit={handleUpdate}>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<Label>Title</Label>
										<Input
											name="title"
											value={input.title || ''}
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label>Description</Label>
										<Input
											name="description"
											value={input.description || ''}
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label>Requirements</Label>
										<Input
											name="requirements"
											value={input.requirements || ''}
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label>Salary</Label>
										<Input
											name="salary"
											type="number"
											value={input.salary || ''}
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label>Location</Label>
										<Input
											name="location"
											value={input.location || ''}
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label>Job Type</Label>
										<Input
											name="jobType"
											value={input.jobType || ''}
											onChange={handleChange}
										/>
									</div>
									<div>
										<Label>Experience Level</Label>
										<Input
											name="experienceLevel"
											type="number"
											value={input.experienceLevel}
											onChange={handleChange}
											min="0"
											max="80"
										/>
									</div>
									<div>
										<Label>No. of Positions</Label>
										<Input
											name="position"
											type="number"
											value={input.position}
											onChange={handleChange}
											min="0"
										/>
									</div>
								</div>
								<div className="flex justify-center mt-4">
									<Button type="submit" className="w-full">
										{updating ? (
											<div className='flex items-center text-md'>
												Updating
												<Loader2 className="m-3 h-5 w-5 animate-spin" />
											</div>
										) : (
											'Update'
										)}
									</Button>
								</div>
							</form>
						) :
						<></>
				}
			</div>
		</div>
	);
};

export default JobEdit;
