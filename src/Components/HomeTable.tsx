import { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore/lite";
import Button from "./Button.js";
import Swal from "sweetalert2";
import { Link } from "react-router";

interface RepairItem {
  repair: string;
}

interface RepairsProps {
  id: string;
  list: string;
  maintains: RepairItem[];
}

interface HomeTableProps {
  checkLogin: boolean;
}

function HomeTable({ checkLogin }: HomeTableProps) {
  const [repairs, setRepairs] = useState<RepairsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filterRepairs, setFilterRepairs] = useState<RepairsProps[]>([]);

  //! ค้นหารายการ
  const inputSearch = (searchValue: string) => {
    setSearch(searchValue);
    const filterSearch = repairs.filter((person) =>
      person.list.toLowerCase().includes(searchValue.toLowerCase()),
    );
    setFilterRepairs(filterSearch);
  };

  //! ดึงข้อมูลมาจาก Firebase
  const fetchPost = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "maintain"));
      const newData: RepairsProps[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<RepairsProps, "id">),
      }));
      setRepairs(newData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  //! ลบการแจ้งซ่อม
  const deleteMaintain = async (
    index: number,
    id: string,
    license_plate: string,
  ) => {
    setLoading(true);
    try {
      const result = await Swal.fire({
        title: "ลบการแจ้งซ่อม",
        text: `คุณต้องการที่จะลบการแจ้งซ่อมนี้ใช่ไหม ? ${license_plate}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ต้องการลบ",
      });
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "maintain", id));
        setRepairs((prev) => prev.filter((_, i) => i !== index));
        Swal.fire({
          title: "ลบเรียบร้อยแล้ว",
          icon: "success",
        });
      }
    } catch (err) {
      console.error(err);
      throw new Error("Failed to Delete");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <>
      <section>
        {loading && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-white">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full mb-2"></div>
              <p>กำลังโหลด...</p>
            </div>
          </div>
        )}
      </section>
      <div className="p-5 flex justify-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          name="search"
          className="p-2 bg-white rounded w-full md:max-w-md shadow transition duration-300 ease-in-out border border-sky-500 focus:border-blue-500 focus:outline-none focus:ring-sky-500 focus:ring-1"
          onChange={(e) => inputSearch(e.target.value)}
          value={search}
        />
      </div>
      <table className="table-auto w-full text-center shadow">
        <thead className="bg-blue-300">
          <tr>
            <th className="border text-xl p-4">รายการ</th>
            <th className="border text-xl">ทะเบียน</th>
            {checkLogin && <th className="border w-24 md:w-60">Action</th>}
          </tr>
        </thead>
        <tbody className="bg-white">
          {(search ? filterRepairs : repairs).map((data, i) => (
            <tr key={i}>
              <td className="border p-4">{data.list}</td>
              <td className="border">
                <ol className="list-disc list-inside">
                  {data?.maintains?.map((data_maintain, i) => (
                    <li key={i}>{data_maintain.repair}</li>
                  ))}
                </ol>
              </td>
              {checkLogin && (
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
                      onClick={() => deleteMaintain(i, data.id, data.list)}
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
