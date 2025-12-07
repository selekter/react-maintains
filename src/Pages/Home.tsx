import AppLayout from '../Layouts/AppLayout';
// import Swal from 'sweetalert2';

// Import the functions you need from the SDKs you need
import { auth } from '../../firebase.js';
import { Suspense, useEffect, useState } from 'react';
import Button from '../Components/Button.js';
import Modal from '../Components/Modal.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import VehicleForm from '../Components/VehicleForm.js';
import HomeTable from '../Components/HomeTable.js';
import TableSkeleton from '../Components/TableSkeleton';

function Home() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [checkLogin, setCheckLogin] = useState(false);

	//! Modal โชว์ฟอร์ม
	const openModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	//! ปิด Modal
	const closeModal = () => {
		setIsModalOpen(false);
	};

	//! ออกจากระบบ
	const handleLogout = () => {
		signOut(auth);
		setCheckLogin(false);
	};

	//! เพิ่มข้อมูลไปยัง Firebase
	const addMaintain = () => {
		setIsModalOpen(false);
		window.location.reload();
	};

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setCheckLogin(true);
			} else {
				setCheckLogin(false);
			}
		});
	}, []);

	return (
		<>
			<div className="p-2">
				<Suspense fallback={<TableSkeleton />}>
					<HomeTable checkLogin={checkLogin} />
				</Suspense>
			</div >

			{checkLogin && (
				<div className="mx-2 flex flex-col md:flex-row gap-2 mb-3">
					<Button
						type="button"
						className="bg-blue-500 hover:bg-blue-700 text-white hover:shadow-blue-500"
						onClick={openModal}
					>
						Maintain
					</Button>
					<Button
						type="button"
						className="bg-red-500 hover:bg-red-700 text-white hover:shadow-red-500"
						onClick={handleLogout}
					>
						Logout
					</Button>
				</div>
			)
			}

			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<VehicleForm onSubmit={addMaintain} />
			</Modal>
		</>
	);
}

export default Home;
