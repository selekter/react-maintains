/* eslint-disable react-hooks/exhaustive-deps */
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase";
import Button from "../Components/Button";

const Edit = () => {
  const [data, setData] = useState([]);
  const [maintains, setMaintains] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const addMaintain = () => {
    setMaintains([...maintains, { repair: "" }]);
  };

  const handleMaintainsChange = (index, value) => {
    const newMaintains = [...maintains];
    newMaintains[index] = { repair: value };
    setMaintains(newMaintains);
  };

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "maintain", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
        setMaintains(docSnap.data().maintains);
      } else {
        console.log("No such document!");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "maintain", id);
      await updateDoc(docRef, { maintains: maintains });
      navigate("/");
    } catch (error) {
      console.error("Failed to edit");
    }
  };
  return (
    <div className="p-2">
      <div className="bg-white p-3 shadow">
        <form onSubmit={handleSubmit}>
          <label htmlFor="license_plate">License Plate</label>
          <input
            type="text"
            name="license_plate"
            className="w-full borders"
            defaultValue={data.license_plate}
            readOnly
          />
          {maintains?.map((maintain, index) => (
            <div key={index} className="flex flex-col my-2">
              <input
                className="border border-blue-500 p-2 rounded focus:border-blue-700 outline-none"
                value={maintain.repair}
                onChange={(e) => handleMaintainsChange(index, e.target.value)}
              />
            </div>
          ))}
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Submit
            </Button>
            <Button
              onClick={addMaintain}
              className="bg-yellow-400 hover:bg-yellow-600"
            >
              Add input
            </Button>
            <Link
              to="/"
              className="py-2 px-2 md:px-5 rounded text-white text-center shadow-lg transition duration-300 bg-green-500 hover:bg-green-600"
            >
              Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Edit;
