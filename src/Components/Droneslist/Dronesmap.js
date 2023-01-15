import Radar from 'react-d3-radar'
import { useRef, useEffect } from 'react'

  function RadarPoint({ label, value }) {
    return (
      <circle cx={500} cy={500} r={value} fill="black" stroke="black" />
    );
  }

  function RadarChart({ data }) {
    const chartRef = useRef(null);
    useEffect(() => {
      if(chartRef.current){
        chartRef.current.destroy();}
    }, [data])
    
    if (!data) return <div>Loading...</div>;

    console.log("data not null")
    const radarData = {
      variables: [{key: 'positionX', label:'X'},{key: 'positionY', label:'Y'}],
      sets : data.map(point => ( {
        key: point.firstName,
        label: point.firstName,
        values: {positionX: point.positionX, positionY: point.positionY}
      }))
    }

    return (
      <div>
        <Radar
            width={1000}
            height={1000}
            padding={50}
            domainMax={500000}
            data={radarData}
          >
            {data.map(item => (
              <RadarPoint key={item.key} {...item} />
            ))}
            </Radar>
      </div>
    );

  }

export default RadarChart