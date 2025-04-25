import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { shortenFilename } from '@/lib/utils'

const CompanyEdit = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null,
        registeredFully: undefined
    });
    const [existingLogoURL, setExistingLogoURL] = useState(""); // To hold the current logo URL
    let [existingLogoName, setExistingLogoName] = useState(""); // To hold the current logo filename
    const [loading, setLoading] = useState(false);
    const { singleCompany } = useSelector(store => store.company);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (
            !input.name.trim() ||
            !input.description.trim() ||
            !input.website.trim() ||
            !input.location.trim()
        ) {
            toast.error("Please fill out all fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);

        // formData.append("registeredFully", true);

        try {
            setLoading(true);

            if (input.file) {
                formData.append("file1", input.file);
            } else if (!existingLogoURL) {
                toast.error("Please upload a logo.");
                throw new Error("No Logo Uploaded");
            }

            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/superadmin/companies");
            }
        } catch (error) {
            console.error(error);
            if (error.response) {
                toast.error(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null,
            registeredFully: singleCompany.registeredFully || undefined
        })
        setExistingLogoURL(singleCompany.logo || ""); // Store the current logo URL

        setExistingLogoName(singleCompany.logoFilename || ""); // Store the current logo filename

    }, [singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='p-8 max-w-xl min-w-[350px] mx-auto my-5 border border-black shadow-lg rounded-md'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 pb-8'>

                        <Button type="button" onClick={() => { navigate("/superadmin/companies") }} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Company Details</h1>
                    </div>
                    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2'>
                        <div>
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                className="hover:cursor-pointer"
                                onChange={changeFileHandler}
                            />
                            {
                                <p className="text-center opacity-50 text-xs transform translate-y-[-5px] h-[20px] px-1">{shortenFilename(existingLogoName)}</p>
                            }
                        </div>
                    </div>
                    {
                        loading ?
                            <Button className="w-full mt-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> :
                            <Button type="submit" className="w-full mt-4">
                                {
                                    (singleCompany?.registeredFully) != undefined ?
                                        singleCompany?.registeredFully == false ?
                                            "Register" :
                                            "Update" :
                                        "Update"

                                }
                            </Button>
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanyEdit