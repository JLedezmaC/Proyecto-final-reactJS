import React, { useEffect, useState } from "react";
import AlertTag from "../components/AlertTag";
import { useNavigate } from "react-router-dom";
import useAlert from "../hooks/useAlert";

export default function StudentForm() {
  const [nameInput, setNameInput] = useState("");
  const [idInput, setIdInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { sendAlert } = useAlert();

  const insertStudent = (id, name) => {
    setIsLoading(true);
    return fetch(`${process.env.REACT_APP_API_URL}student`, {
      method: "POST",
      headers: {
        "x-hasura-admin-secret":
          `${process.env.REACT_APP_HASURA_SECRET}`
      },
      body: JSON.stringify({ id: id, name: name })
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data.insert_students_one === null) {
          sendAlert({ type: "warning", message: "Repeated ID, please verify", close: false , position: 'left'});
          // setAlert("Repeated ID, please verify");
        } else {
          sendAlert({ type: "success", message: "New student added", close: 8000  , position: 'center'});
          // setAlert("New student Added");
          navigate("/");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    insertStudent(idInput, nameInput).then(() => {
      setIdInput(0);
      setNameInput("");
    });
  };

  // useEffect(() => {
  //   const alertTimer = setTimeout(() => {
  //     console.log("timer");
  //     setAlert("");
  //   }, 5000);

  //   return () => clearTimeout(alertTimer);
  // }, [alert]);

  return (
    <>
      <h1>Student form</h1>
      <form onSubmit={handleSubmit}>
        <input
          required
          name="id"
          onChange={(e) => setIdInput(e.target.value)}
          value={idInput}
          type="number"
          placeholder="123"
        />

        <input
          required
          name="name"
          onChange={(e) => setNameInput(e.target.value)}
          value={nameInput}
          type="text"
          placeholder="Jon Snow"
        />

        <button disabled={isLoading} type="submit">
          Add Student
        </button>
      </form>
    </>
  );
}