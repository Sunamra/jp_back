import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const UpdatePasswordDialog = ({ open, setOpen }) => {
	const [loading, setLoading] = useState(false);
	const [dialogHeight, setDialogHeight] = useState(null);  // Set initial height to 'auto' to fit content
	const dialogContentRef = useRef(null);  // Create a ref for DialogContent

	const [input, setInput] = useState({
		oldPassword: "",
		newPassword: "",
	});

	const changeEventHandler = (e) => {
		console.log("OLD", input.oldPassword.trim(), (input.oldPassword.trim()).length);
		console.log("NEW", input.newPassword.trim(), (input.newPassword.trim()).length);
		setInput({ ...input, [e.target.name]: e.target.value });
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		console.log("-> OLD", input.oldPassword.trim(), (input.oldPassword.trim()).length);
		console.log("-> NEW", input.newPassword.trim(), (input.newPassword.trim()).length);
		try {
			if ((input.oldPassword.trim()).length == 0 || (input.newPassword.trim()).length == 0) {
				toast.error("Please input both passwords");
				throw new Error("Empty password input while updating");
			}
			else if (input.newPassword.trim().length < 3) {
				toast.error("New Password requires at least 3 characters")
				throw new Error("New Password length must be at least 3 characters");
			}

			const formData = new FormData();
			formData.append('oldPassword', input.oldPassword);
			formData.append('newPassword', input.newPassword);

			setLoading(true);
			const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				withCredentials: true,
			});

			if (res.data.success) {
				toast.success(res.data.message);
				setOpen(false);
			}
		} catch (error) {
			console.log(error);
			if (error.response) {
				toast.error(error.response.data.message);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const updateHeight = () => {
			const windowHeight = window.innerHeight;

			const dialogContent = dialogContentRef.current;
			if (!dialogContent) return;

			let contentHeight = dialogContent.scrollHeight || dialogContent.getBoundingClientRect().height;

			if (windowHeight <= (contentHeight + 55)) {
				setDialogHeight(windowHeight * 0.87);
			} else {
				setDialogHeight('fit-content');
			}
			console.log(windowHeight, "<=>", contentHeight);
		};


		const timer = setTimeout(() => {
			if (open) {
				updateHeight();
			}
		}, 0);

		window.addEventListener('resize', updateHeight);
		window.addEventListener('load', updateHeight);

		return () => {
			clearTimeout(timer);
			window.removeEventListener('resize', updateHeight);
			window.removeEventListener('load', updateHeight);
		};
	}, [open]);

	return (
		<div>
			<Dialog open={open}>
				<DialogContent
					ref={dialogContentRef}
					className={"max-w-[400px] min-w-[300px] px-3 dialog-content"}
					style={{ height: dialogHeight }}
				>
					<DialogHeader>
						<DialogTitle>Update Password</DialogTitle>
						<DialogClose onClick={() => setOpen(false)} title="Close" className="absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100">
							<X className="h-5 w-5" />
						</DialogClose>
					</DialogHeader>
					<form onSubmit={submitHandler}>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-12 items-center">
								<Label htmlFor="oldPassword" className="col-span-4 text-right">Old Password</Label>
								<Input
									id="oldPassword"
									name="oldPassword"
									type="password"
									onChange={changeEventHandler}
									className="col-span-7 col-start-6"
								/>
							</div>
							<div className="grid grid-cols-12 items-center">
								<Label htmlFor="newPassword" className="col-span-4 text-right">New Password</Label>
								<Input
									id="newPassword"
									name="newPassword"
									type="password"
									onChange={changeEventHandler}
									className="col-span-7 col-start-6"
								/>
							</div>
						</div>
						<DialogFooter>
							{
								loading ?
									<Button className="w-full mt-5"><Loader2 className="mx-2 h-4 w-4 animate-spin" /> Please wait</Button> :
									<Button type="submit" className="w-full mt-5">Update</Button>
							}
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default UpdatePasswordDialog;
