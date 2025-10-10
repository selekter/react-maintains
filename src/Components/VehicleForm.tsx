import { useState } from 'react';
import Button from './Button.js';
import { addDoc, collection } from 'firebase/firestore/lite';
import { db } from '../firebase.js';
import Swal from 'sweetalert2';

interface VehicleFormProps {
	onSubmit: () => void;
}

interface MaintainItem {
	repair: string;
}

function VehicleForm({ onSubmit }: VehicleFormProps) {
	const [licensePlate, setLicensePlate] = useState<string>('');
	const [maintains, setMaintains] = useState<MaintainItem[]>([{ repair: '' }]);

	const handleMaintainChange = (index: number, value: string) => {
		const newMaintains = [...maintains];
		newMaintains[index] = { repair: value };
		setMaintains(newMaintains);
	};

	//! เพิ่มฟอร์มการแจ้งซ่อม
	const addMaintainInput = () => {
		setMaintains([...maintains, { repair: '' }]);
	};

	//! ลบข้อมูลฟอร์ม
	const resetForm = () => {
		setLicensePlate('');
		setMaintains([{ repair: '' }]);
	};

	//! ลบฟอร์มการแจ้งซ่อม
	const removeMaintainInput = (index: number) => {
		const newMaintains = [...maintains];
		newMaintains.splice(index, 1);
		setMaintains(newMaintains);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await addDoc(collection(db, 'maintain'), {
				license_plate: licensePlate,
				maintains: maintains,
			});
			Swal.fire({
				title: 'บันทึกข้อมูลเรียบร้อย',
				icon: 'success',
			});
		} catch (e) {
			console.error('Error adding document: ', e);
		}
		setLicensePlate('');
		setMaintains([{ repair: '' }]);
		onSubmit();
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label htmlFor="list" className="text-xl font-bold">
					รายการ
				</label>
				<input
					type="text"
					className="p-2 rounded w-full border border-sky-500 shadow-lg"
					value={licensePlate}
					id="list"
					placeholder="License Plate"
					required
					onChange={(e) => setLicensePlate(e.target.value)}
				/>
				<label htmlFor="licensePlate" className="text-xl font-bold">
					License Plate
				</label>
				{maintains.map((maintain, index) => (
					<div key={index} className="flex my-2 gap-2">
						<input
							type="text"
							className="w-full rounded border border-sky-500 p-2 shadow-lg"
							value={maintain.repair}
							id="licensePlate"
							placeholder="licensePlate"
							required
							onChange={(e) =>
								handleMaintainChange(index, e.target.value)
							}
						/>
						{index !== 0 && (
							<Button
								type="button"
								className="bg-red-500 text-white w-20 md:w-40"
								onClick={() => removeMaintainInput(index)}
							>
								Remove
							</Button>
						)}
					</div>
				))}
				<div className="flex flex-col md:flex-row gap-2">
					<Button type="submit" className="bg-blue-500 text-white">
						บันทึกข้อมูล
					</Button>
					<Button
						className="bg-yellow-400"
						onClick={addMaintainInput}
					>
						เพิ่มการแจ้งซ่อม
					</Button>
					<Button
						onClick={resetForm}
						className="bg-red-500 text-white"
					>
						Reset
					</Button>
				</div>
			</form>
		</>
	);
}

export default VehicleForm;
