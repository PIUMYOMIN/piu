// import { React, useEffect, useState } from "react";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           throw new Error("Authentication token not found");
//         }

//         const headers = { Authorization: `Bearer ${token}` };

//         const response = await fetch("https://piueducation.org/api/v1/users", {
//           headers
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch Users");
//         }

//         const data = await response.json();
//         setUsers(data);
//       } catch (error) {
//         console.log("Error fetching User data", error);
//         setError(error.message);
//       }
//     };

//     fetchUsers();
//   }, []);
//   if (error) {
//     return (
//       <div>
//         Error: {error}
//       </div>
//     );
//   }
//   return <div>
//       <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
//         <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900 p-2">
//           <div>
//             <button id="dropdownActionButton" data-dropdown-toggle="dropdownAction" className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
//               <span className="sr-only">Action button</span>
//               Action
//               <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
//                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
//               </svg>
//             </button>
//             {/* Dropdown menu */}
//             <div id="dropdownAction" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
//               <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
//                 <li>
//                   <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
//                     Reward
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
//                     Promote
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
//                     Activate account
//                   </a>
//                 </li>
//               </ul>
//               <div className="py-1">
//                 <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
//                   Delete User
//                 </a>
//               </div>
//             </div>
//           </div>
//           <label htmlFor="table-search" className="sr-only">
//             Search
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
//               <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
//                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
//               </svg>
//             </div>
//             <input type="text" id="table-search-users" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
//           </div>
//         </div>
//         <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//             <tr>
//               <th scope="col" className="p-4">
//                 <div className="flex items-center">
//                   <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" disabled />
//                   <label htmlFor="checkbox-all-search" className="sr-only">
//                     checkbox
//                   </label>
//                 </div>
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Name
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Email
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Status
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {users && users.map((user, index) =>
//                 <tr
//                   className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
//                   key={index}
//                 >
//                   <td className="w-4 p-4">
//                     <div className="flex items-center">
//                       <input
//                         id="checkbox-table-search-1"
//                         type="checkbox"
//                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                       />
//                       <label
//                         htmlFor="checkbox-table-search-1"
//                         className="sr-only"
//                       >
//                         checkbox
//                       </label>
//                     </div>
//                   </td>
//                   <th
//                     scope="row"
//                     className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
//                   >
//                     <img
//                       className="w-10 h-10 rounded-full"
//                       src={`https://piueducation.org/storage/${user.picture}`}
//                       alt={user.picture}
//                     />
//                     <div className="ps-3">
//                       <div className="text-base font-semibold">
//                         {user.name}
//                       </div>
//                       <div className="font-normal text-gray-500">
//                         {user.city},&nbsp;
//                         {user.country}
//                       </div>
//                     </div>
//                   </th>
//                   <td className="px-6 py-4">
//                     {user.email}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />{" "}
//                       Online
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <a
//                       href="#"
//                       className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
//                     >
//                       Edit user
//                     </a>
//                   </td>
//                 </tr>
//               )}
//           </tbody>
//         </table>
//       </div>
//     </div>;
// }


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Try to fetch from API
    fetch("https://piueducation.org/api/v1/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data);
        } else {
          // If API returns no data, use sample data
          setUsers(sampleData);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers(sampleData); // fallback to sample
      });
  }, []);

  const sampleData = [
    {
      id: 1,
      name: "John Doe",
      phone: "+1 555 123 456",
      email: "john@example.com",
      dob: "1990-05-15",
      status: "Active",
      image: "https://i.pravatar.cc/40?img=1",
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "+1 555 987 654",
      email: "jane@example.com",
      dob: "1995-08-21",
      status: "Inactive",
      image: "https://i.pravatar.cc/40?img=2",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold p-4 mb-2 bg-[#002147] text-white rounded-t-lg">
        Users Information
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">DOB</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">View</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                </td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.phone}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.dob}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`/admin/users/${user.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <Link to="#" className="text-yellow-500 hover:underline">
                    Edit
                  </Link>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users