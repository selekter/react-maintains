import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { auth, db } from "../firebase.js";
import Button from "../Components/Button.js";

interface MaintainProps {
  repair: string;
}

interface DocumentDataProps {
  license_plate: string;
  maintains: MaintainProps[];
}

const Edit = () => {
  const [data, setData] = useState<DocumentDataProps | null>(null);
  const [maintains, setMaintains] = useState<MaintainProps[]>([]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log(maintains);

  const addMaintain = () => {
    setMaintains([...maintains, { repair: "" }]);
  };

  const handleMaintainsChange = (index: number, value: string) => {
    const newMaintains = [...maintains];
    newMaintains[index] = { repair: value };
    setMaintains(newMaintains);
  };

  const removeRepairInput = (index: number) => {
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
      console.error("Error");
      navigate("/");
      return;
    }

    if (!id) {
      console.error("Error: Document ID is missing.");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(db, "maintain", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const docData = docSnap.data() as DocumentDataProps;
          setData(docData);

          setMaintains(
            docData.maintains.sort((a, b) => a.repair.localeCompare(b.repair)),
          );
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    try {
      const docRef = doc(db, "maintain", id);
      await updateDoc(docRef, { maintains: maintains });
      navigate("/");
    } catch (error) {
      console.error("Failed to edit", error);
    }
  };

  if (!data) {
    return <div className="p-4 text-center text-xl">กำลังโหลดข้อมูล...</div>;
  }
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
                onChange={(e) => handleMaintainsChange(index, e.target.value)}
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
