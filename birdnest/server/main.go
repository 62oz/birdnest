package server

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

func server() {
	http.HandleFunc("/", GetRequest)

	log.Println("Starting server port 8080 (http://localhost:8080/)")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}

type XMLData struct {
	DeviceInfo Device `json:"deviceInformation"`
	Capture    []Drone
}

type Drone struct {
	Serial       string `json:"serialNumber"`
	Model        string `json:"model"`
	Manufacturer string `json:"manufacturer"`
	Mac          string `json:"mac"`
	Ipv4         string `json:"ipv4"`
	Ipv6         string `json:"ipv6"`
	Firmware     string `json:"firmware"`
	X            string `json:"positionX"`
	Y            string `json:"positionY"`
	Altitude     string `json:"altitude"`
}

type Device struct {
	Range          int       `json:"listenRange"`
	Start          time.Time `json:"deviceStarted"`
	UpTime         int       `json:"uptimeSeconds"`
	UpdateInterval int       `json:"updateIntervalMs"`
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
	var xmlData XMLData
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
	w.Write(jsonData)

}
