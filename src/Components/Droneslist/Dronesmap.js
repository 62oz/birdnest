import { Radar } from 'react-chartjs-2';
import { useRef, useEffect } from 'react'

function RadarChart({ data }) {
  const chartRef = useRef(null);
  useEffect(() => {
    if(chartRef.current){
      chartRef.current.destroy();}
  }, [data, chartRef])
  console.log(data[0].positionX)
  return (
    <Radar
    ref={chartRef}
      data={{
        labels: data.map(point => point.positionX),
        datasets: [
          {
            label: data.map(point => point.firstName),
            data: data.map(point => point.positionY),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
          },
        ],
        
      }}
      
      options={{
        scale: {
          type: 'linear',
        },
      }}
    />
  );
}

export default RadarChart