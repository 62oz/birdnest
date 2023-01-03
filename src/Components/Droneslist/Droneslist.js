import Spinner from "../Spinner/Spinner";
import React from "react";
import { useState, useEffect } from "react";

  
function Droneslist(props) {
    const [drones, setDrones] = useState([]);
    const [data, setData] = useState(null);
    const [err, seterr] = useState(null);
    const [loading, setloading] = useState(true);


    useEffect(() => {
      async function getData() {
        try {
          const response = await fetch("http://localhost:8080");
          const data = await response.json();
          setData(data);
          setDrones(data.Capture.Drones)
          setloading(false)
        } catch (error) {
          console.error(error);
          seterr(error)
        }
      }
      getData();
    }, []);
  
    console.log("let's go")


      let rendered;
      let error;
      let errorMsg;
      if (err && !loading) {
        console.log("Errtor is :", err);
        error = err.code ? err.code : err.name;
        errorMsg = err.message;
        rendered = (
          <>
            <h2 className="red center">{error}</h2>
            <p className="errorMessage center">{errorMsg}</p>
          </>
        );
      }
    
      if (loading) {
        rendered = <div><Spinner /></div>;
      }
      if (!loading && data && drones.length > 0) {
        console.log("drone", drones)
        rendered = <div>{drones.map((item) => (
          <li key={item.SerialNumber}>{item.SerialNumber}</li>
        ))}</div>;
        console.log("rendered", rendered)
      }
    
      return (
        <div>
          <div className="container">HERE{rendered}</div>
        </div>
      );
    
  }
  

  export default Droneslist;