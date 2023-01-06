import Spinner from "../Spinner/Spinner";
import React from "react";
import { useState, useEffect } from "react";
import Table from "../Table/Table";


  
function Droneslist(props) {
    const [data, setData] = useState(null);
    const [err, seterr] = useState(null);
    const [loading, setloading] = useState(true);


    useEffect(() => {
      async function getData() {
        try {
          const response = await fetch("http://localhost:8080");
          const data = await response.json();
          setData(data);
          setloading(false)
        } catch (error) {
          console.error(error);
          seterr(error)
        }
      }
      getData();
    }, [data]);

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

      if (!loading && data) {
        console.log("data",data)
        rendered = <Table data={data} />;
      }
    
      return (
        <div>
          <div className="container">HERE{rendered}</div>
        </div>
      );
    
  }
  

  export default Droneslist;