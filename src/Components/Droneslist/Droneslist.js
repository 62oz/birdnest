import Spinner from "../Spinner/Spinner";
import React, { useState, useEffect } from "react";
import Table from "../Table/Table";
import Chart from "./Dronesmap";
import { createContext } from "react";

export const SearchContext = createContext();

function Droneslist() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null);
  const [err, seterr] = useState(null);
  const [loading, setloading] = useState(true);

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("http://localhost:8080");
        const data = await response.json();
        setData(data);
        setloading(false);
      } catch (error) {
        console.error(error);
        seterr(error);
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
  } else if (!loading && data && data.length > 0) {
    rendered = (
      <SearchContext.Provider value={{ searchQuery, handleSearch }}>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Table data={data} />
        <Chart data={data} />
      </SearchContext.Provider>
    );
  }

  return (
    <div>
      <div className="container">HERE{rendered}</div>
    </div>
  );
}

export default Droneslist;