import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore/lite";
import { Link } from "react-router-dom";
import Button from "./Button";
import Swal from "sweetalert2";

function HomeTable(props) {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRepairs, setFilterRepairs] = useState([]);

  const inputSearch = (searchValue) => {
    setSearch(searchValue);
    const filterSearch = repairs.filter((person) =>
      person.license_plate.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilterRepairs(filterSearch);
  };

  //! ดึงข้อมูลมาจาก Firebase
  const fetchPost = async () => {
    setLoading(true);
    await getDocs(collection(db, "maintain"))
      .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setRepairs(newData);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  //! ลบการแจ้งซ่อม
  const deleteMaintain = async (index, id, license_plate) => {
    setLoading(true);
    try {
      Swal.fire({
        title: "ลบการแจ้งซ่อม",
        text: `คุณต้องการที่จะลบการแจ้งซ่อมนี้ใช่ไหม ? ${license_plate}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ต้องการลบ",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteDoc(doc(db, "maintain", id));
          setRepairs(repairs.filter((o, i) => index !== i));
          Swal.fire({
            title: "ลบเรียบร้อยแล้ว",
            icon: "success",
          });
        }
      });
      setLoading(false);
    } catch (error) {
      throw new Error("Failed to Delete");
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <>
      <section>
        {loading && (
          <div className="fixed inset-0 bg-black opacity-30 left-0 top-0">
            <div className="flex items-center justify-center h-screen text-white text-4xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-arrow-clockwise animate-spin"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
              </svg>
            </div>
          </div>
        )}
      </section>
      <div className="p-5 flex justify-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="p-2 bg-neutral-200 rounded w-full md:max-w-md shadow-lg transition duration-300 ease-in-out border border-sky-500 focus:border-blue-500 focus:outline-none focus:ring-sky-500 focus:ring-1"
          onChange={(e) => inputSearch(e.target.value)}
        />
      </div>
      <table className="table-auto w-full text-center shadow">
        <thead className="bg-blue-300">
          <tr>
            <th className="border text-xl p-4">รายการ</th>
            <th className="border text-xl">ทะเบียน</th>
            {props.checkLogin && (
              <th className="border w-24 md:w-60">Action</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white">
          {search
            ? filterRepairs.map((data, i) => (
                <tr key={i}>
                  <td className="border p-4">{data.license_plate}</td>
                  <td className="border">
                    <ol className="list-disc list-inside">
                      {data?.maintains?.map((data_maintain, i) => (
                        <li key={i}>{data_maintain.repair}</li>
                      ))}
                    </ol>
                  </td>
                  {props.checkLogin && (
                    <td className="border">
                      <div className="flex flex-col md:flex-row justify-center md:gap-2">
                        <Link
                          to={`edit/${data.id}`}
                          className="py-2 px-2 md:px-5 rounded shadow-lg transition duration-300 bg-yellow-500 hover:bg-yellow-700"
                        >
                          Edit
                        </Link>
                        <Button
                          className="bg-red-500 hover:bg-red-700 text-white"
                          onClick={() =>
                            deleteMaintain(i, data.id, data.license_plate)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            : repairs?.map((data, i) => (
                <tr key={i}>
                  <td className="border p-4">{data.license_plate}</td>
                  <td className="border">
                    <ol className="list-disc list-inside">
                      {data?.maintains
                        .sort((a, b) => a.repair.localeCompare(b.repair))
                        ?.map((data_maintain, i) => (
                          <li key={i}>{data_maintain.repair}</li>
                        ))}
                    </ol>
                  </td>
                  {props.checkLogin && (
                    <td className="border">
                      <div className="flex flex-col md:flex-row justify-center gap-2">
                        <Link
                          to={`edit/${data.id}`}
                          className="py-2 px-2 md:px-5 rounded-md md:rounded shadow-lg transition duration-300 bg-yellow-500 hover:bg-yellow-700"
                        >
                          Edit
                        </Link>
                        <Button
                          className="bg-red-500 hover:bg-red-700 text-white"
                          onClick={() =>
                            deleteMaintain(i, data.id, data.license_plate)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
}

export default HomeTable;
