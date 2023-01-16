import { VictoryChart, VictoryScatter, VictoryTheme , VictoryAxis} from "victory";
import { useContext } from "react";
import { SearchContext } from "./Droneslist";
import { useMemo } from "react";

const handleClick = (pilot) => {
  let date = new Date(pilot.spotted)
  /* const alertBox =  */alert(`  Pilot: ${pilot.firstName} ${pilot.lastName}
  Last seen: ${date.toUTCString()}`);
  /* window.onclick = function(event) {
    if (event.target !== alertBox) {
      alertBox.close();
      window.removeEventListener("click", handleClick);
    }
  } */
}

  function Chart({ data }) {
    
    // Use the searchQuery to filter the data
    const searchQuery = useContext(SearchContext);
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.values(item).some(val =>
        val.toString().toLowerCase().includes(searchQuery.searchQuery.toLowerCase())
      );
    });
  }, [data, searchQuery]);

    
    const coor = filteredData.filter(item => item.positionX !== undefined && item.positionX !== null && !isNaN(item.positionX) && item.positionY !== undefined && item.positionY !== null && !isNaN(item.positionY)).map(item => 
    ({x: item.positionX - 250000, y: item.positionY - 250000, fill: item.colour, firstName: item.firstName, lastName: item.lastName, spotted: item.spotted, onClick: () => handleClick(item)})
    );

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
           data={coor}
           style={{ data: { fill: (d) =>  d.datum.fill ? d.datum.fill : "black" } }}
           events={[
            {
                target: "data",
                eventHandlers: {
                    onClick: (e,props) => {
                      handleClick(props.datum);
                       return {};
                    }
                }
            }
        ]}
        />

      </VictoryChart>
    )
  }
    
export default Chart
    