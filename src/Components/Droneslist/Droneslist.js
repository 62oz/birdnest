import Spinner from "../Spinner/Spinner";
import React from "react";
import { useState, useEffect } from "react";
import Table from "../Table/Table";
import EmptyRadar from "./Dronesmap";

  
function Droneslist() {
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

      if (data === null) {
        rendered = <div>UGH</div>
        console.log("h", data)
      } else if (!loading && data && data.length > 0) {
        console.log("dta not nul")
        console.log("data1",data)
        rendered = <div><Table data={data} />
        <EmptyRadar data={data} /></div>;
      }
    
      return (
        <div>
          <div className="container">HERE{rendered}</div>
        </div>
      );
    
  }
  


  export default Droneslist;