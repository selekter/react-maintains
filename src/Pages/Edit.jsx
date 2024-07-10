/* eslint-disable react-hooks/exhaustive-deps */
import { doc, getDoc, updateDoc } from 'firebase/firestore/lite';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import Button from '../Components/Button';

const Edit = () => {
	const [data, setData] = useState([]);
	const [maintains, setMaintains] = useState([]);
	const { id } = useParams();
	const navigate = useNavigate();

	const addMaintain = () => {
		setMaintains([...maintains, { repair: '' }]);
	};

	const handleMaintainsChange = (index, value) => {
		const newMaintains = [...maintains];
		newMaintains[index] = { repair: value };
		setMaintains(newMaintains);
	};

	const removeRepairInput = (index) => {
		const newRepair = [...maintains];
		newRepair.splice(index, 1);
		setMaintains(newRepair);
	};

	const backToHome = () => {
		navigate(-1);
	};

	useEffect(() => {
		const user = auth.currentUser;
		if (!user) {
			console.log('Error');
			navigate('/');
		}
		const fetchData = async () => {
			const docRef = doc(db, 'maintain', id);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setData(docSnap.data());
				setMaintains(docSnap.data().maintains);
			} else {
				console.log('No such document!');
			}
		};
		fetchData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const docRef = doc(db, 'maintain', id);
			await updateDoc(docRef, { maintains: maintains });
			navigate('/');
		} catch (error) {
			console.error('Failed to edit');
		}
	};
	return (
		<div className="p-2">
			<div className="bg-white p-3 shadow">
				<form onSubmit={handleSubmit}>
					<p>License Plate</p>
					<p>{data.license_plate}</p>
					{maintains?.map((maintain, index) => (
						<div key={index} className="flex flex-row gap-2 my-2">
							<input
								className="border border-blue-500 p-2 rounded focus:border-blue-700 outline-none w-full shadow-lg"
								value={maintain.repair}
								onChange={(e) =>
									handleMaintainsChange(index, e.target.value)
								}
							/>
							<Button
								type="button"
								className="bg-red-500 text-white px-5 md:px-10"
								onClick={() => removeRepairInput(index)}
							>
								ลบ
							</Button>
						</div>
					))}
					<div className="flex flex-col md:flex-row gap-2">
						<Button
							type="submit"
							className="bg-blue-500 hover:bg-blue-600 text-white"
						>
							บันทึกข้อมูล
						</Button>
						<Button
							onClick={addMaintain}
							className="bg-yellow-400 hover:bg-yellow-600"
						>
							เพิ่มการแจ้งซ่อม
						</Button>
						<Button
							onClick={backToHome}
							className="text-white bg-green-500 hover:bg-green-600"
						>
							กลับไปหน้าหลัก
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Edit;
