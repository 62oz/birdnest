package handlers

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io/ioutil"

	"net/http"
)

/* type XMLData struct {
	DeviceInfo Device `xml:"deviceInformation"`
	Capture    Capture
}

type Capture struct {
	SnapshotTimestamp string  `xml:"snapshotTimestamp,attr"`
	Drone             []Drone `xml:"drone"`
}

type Drone struct {
	Serial       string `xml:"serialNumber"`
	Model        string `xml:"model"`
	Manufacturer string `xml:"manufacturer"`
	Mac          string `xml:"mac"`
	Ipv4         string `xml:"ipv4"`
	Ipv6         string `xml:"ipv6"`
	Firmware     string `xml:"firmware"`
	X            string `xml:"positionX"`
	Y            string `xml:"positionY"`
	Altitude     string `xml:"altitude"`
}

type Device struct {
	Range          int       `xml:"listenRange"`
	Start          time.Time `xml:"deviceStarted"`
	UpTime         int       `xml:"uptimeSeconds"`
	UpdateInterval int       `xml:"updateIntervalMs"`
} */

type Report struct {
	DeviceInformation struct {
		DeviceId         string `xml:"deviceId,attr"`
		ListenRange      string `xml:"listenRange"`
		DeviceStarted    string `xml:"deviceStarted"`
		UptimeSeconds    string `xml:"uptimeSeconds"`
		UpdateIntervalMs string `xml:"updateIntervalMs"`
	} `xml:"deviceInformation"`
	Capture struct {
		SnapshotTimestamp string `xml:"snapshotTimestamp,attr"`
		Drones            []struct {
			SerialNumber string `xml:"serialNumber"`
			Model        string `xml:"model"`
			Manufacturer string `xml:"manufacturer"`
			Mac          string `xml:"mac"`
			Ipv4         string `xml:"ipv4"`
			Ipv6         string `xml:"ipv6"`
			Firmware     string `xml:"firmware"`
			PositionY    string `xml:"positionY"`
			PositionX    string `xml:"positionX"`
			Altitude     string `xml:"altitude"`
		} `xml:"drone"`
	} `xml:"capture"`
}

func GetRequest(w http.ResponseWriter, r *http.Request) {

	// Make a GET request to the API
	resp, err := http.Get("http://assignments.reaktor.com/birdnest/drones")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Unmarshal the XML into a struct
	var xmlData Report
	if err := xml.Unmarshal(body, &xmlData); err != nil {
		fmt.Println(err)
		return
	}

	// Marshal the struct into a JSON object
	jsonData, err := json.MarshalIndent(xmlData, "", "    ")
	if err != nil {
		fmt.Println(err)
		return
	}

	// Print the JSON object
	fmt.Println(string(jsonData))

	// Write
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Write(jsonData)

}
