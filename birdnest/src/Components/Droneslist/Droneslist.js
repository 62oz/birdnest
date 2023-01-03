import Spinner from "../Spinner/Spinner";
import React from "react";
import { parseString } from 'xml-js';
import Axios from "axios";
import XMLParser from "react-xml-parser";


export class DronesList extends React.Component {
    state = {
      data: null,
      loading: true,
      err: null,
      posts: null
    };
  
    componentDidMount() {
      this.fetchData();
      console.log("component did mount")
      this.interval = setInterval(() => this.fetchData(), 60000); // refresh every 60 seconds
    }
  
    componentWillUnmount() {
        console.log("component unmounted")
      clearInterval(this.interval);
    }
  
    fetchData() {
    
      fetch("localhost:8080")
        .then(response => response.text())
        .then(str => parseString(str, { compact: true }))
        .then(data => this.setState({ data }))
        .catch((e) => {
            this.setState({loading:false, err:e});
            console.log(e);
          });
    }
  
    render() {
console.log("let's go")
        const { data, loading, err, posts } = this.state;

        if (data) {
            let p = [];
            var drones = data.children[0].children;
                for (let i in drones) {
                    if (
                      drones[i].children !== null &&
                      drones[i].children !== [] &&
                      drones[i].children.length > 0
                    ) {
                      p.push(drones[i].children);
                    }
                  }
                  this.setState({loading:false, posts:p});
        }
        
  
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
      if (!loading && data && posts.length > 0) {
        rendered = <div>{posts}</div>;
      }
    
      return (
        <div>
          <div className="container">{rendered}</div>
        </div>
      );
    
    }
  }
  