import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Student } from './models/Student';

const BASE_URL = 'http://localhost:8000/api/students';

const App: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editStudent, setEditStudent] = useState<Student | null>(null);
    const [newStudent, setNewStudent] = useState({
        firstName: "",
        lastName: "",
        email: "",
        university: ""
    });

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(BASE_URL);
                setStudents(data);
                setError(null);
            } catch (err) {
                setError('An unexpected error occurred while fetching students.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleAddStudent = async () => {
        try {
            const { data } = await axios.post(BASE_URL, newStudent);
            setStudents([...students, data]);
            setNewStudent({
                firstName: "",
                lastName: "",
                email: "",
                university: ""
            });
        } catch (error) {
            setError('An error occurred while adding the student.');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            setStudents(students.filter(student => student.id !== id));
        } catch (error) {
            setError('An error occurred while deleting the student.');
        }
    };

    const handleUpdate = async (updatedStudent: Student) => {
        try {
            await axios.put(`${BASE_URL}/${updatedStudent.id}`, updatedStudent);
            setStudents(students.map(student => student.id === updatedStudent.id ? updatedStudent : student));
            setEditStudent(null);
        } catch (error) {
            setError('An error occurred while updating the student.');
        }
    };

    const handleSave = () => {
        if (editStudent) {
            handleUpdate(editStudent);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewStudent({
            ...newStudent,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-xl font-bold my-4">Student List</h1>
            <div className="mb-4">
                <input
                    type="text"
                    name="firstName"
                    value={newStudent.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="border border-gray-300 rounded px-4 py-2 mr-2"
                />
                <input
                    type="text"
                    name="lastName"
                    value={newStudent.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="border border-gray-300 rounded px-4 py-2 mr-2"
                />
                <input
                    type="email"
                    name="email"
                    value={newStudent.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="border border-gray-300 rounded px-4 py-2 mr-2"
                />
                <input
                    type="text"
                    name="university"
                    value={newStudent.university}
                    onChange={handleInputChange}
                    placeholder="University"
                    className="border border-gray-300 rounded px-4 py-2 mr-2"
                />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAddStudent}
                >
                    Add Student
                </button>
            </div>

            {loading && <p>Loading students...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <div className="overflow-x-auto mt-6">
                    <table className="table-auto w-full">
                        {/* ... Table headers remain the same */}
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    {/* ... Table cells with editable inputs for each student property */}
                                    <td className="border px-4 py-2">
                                        {editStudent && editStudent.id === student.id ? (
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                                onClick={() => setEditStudent(student)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                                            onClick={() => handleDelete(student.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;
