import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({storage}).single("file");

export const multiUpload = multer({ storage }).fields([
	{
		name: "file1",
		maxCount: 1
	},
	{
		name: "file2",
		maxCount: 1
	}
]);
