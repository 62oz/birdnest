import { VictoryChart, VictoryScatter, VictoryTheme , VictoryAxis} from "victory";


function Chart(data) {
  data = data.data
  const coor = data.map(item => 
    (item.positionX !== undefined && item.positionY !== undefined && !isNaN(item.positionX) && !isNaN(item.positionY))
    ? {x: item.positionX - 250000, y: item.positionY - 250000}
    : undefined
  ).filter(item => item !== undefined);
  
  const colours = data.map(item => item.colour)

  const coorWithColours = coor.map((point, index) => {
    return {
      ...point,
      fill: colours[index]
    }
  });
    console.log("coorC", coorWithColours)
      return (
        <VictoryChart
        domain={{ x: [-250000, 250000], y: [-250000, 250000] }}
        theme={VictoryTheme.material}
      >
         <VictoryAxis
    label="X"
    tickValues={[-250000, 250000]}
  />
  <VictoryAxis
    dependentAxis
    label="Y"
    tickValues={[-250000, 250000]}
  />
        <VictoryScatter
           size={7}
           data={coorWithColours}
           style={{data: {fill: (coorWithColours) => coorWithColours.fill}}}
        />
      </VictoryChart>
    )
  }

    
export default Chart
    