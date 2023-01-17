package handlers

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"math/rand"
	"sort"
	"time"

	"net/http"
)

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
			SerialNumber string  `xml:"serialNumber"`
			Model        string  `xml:"model"`
			Manufacturer string  `xml:"manufacturer"`
			Mac          string  `xml:"mac"`
			Ipv4         string  `xml:"ipv4"`
			Ipv6         string  `xml:"ipv6"`
			Firmware     string  `xml:"firmware"`
			PositionY    float64 `xml:"positionY"`
			PositionX    float64 `xml:"positionX"`
			Altitude     string  `xml:"altitude"`
		} `xml:"drone"`
	} `xml:"capture"`
}

type Pilot struct {
	PilotId     string  `json:"pilotId"`
	FirstName   string  `json:"firstName"`
	LastName    string  `json:"lastName"`
	PhoneNumber string  `json:"phoneNumber"`
	CreateDt    string  `json:"createDt"`
	Email       string  `json:"email"`
	Spotted     string  `json:"spotted"`
	DroneSN     string  `json:"droneSN"`
	Distance    float64 `json:"distance"`
	PositionY   float64 `json:"positionY"`
	PositionX   float64 `json:"positionX"`
	Colour      string  `json:"colour"`
}

var Pilots []Pilot
var jsonData []byte
var colors = make(map[string]string)

type ByDistance []Pilot

func (a ByDistance) Len() int           { return len(a) }
func (a ByDistance) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a ByDistance) Less(i, j int) bool { return a[i].Distance < a[j].Distance }

func GetRequest(w http.ResponseWriter, r *http.Request) {

	// Make a GET request to the API
	resp, err := http.Get("http://assignments.reaktor.com/birdnest/drones")
	if err != nil {
		fmt.Println("Get drones error")
		log.Fatal(err)
		return
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Read drone resp error")
		log.Fatal(err)
		return
	}

	// Unmarshal the XML into a struct
	var xmlData Report
	if err := xml.Unmarshal(body, &xmlData); err != nil {
		fmt.Println("XML ended: sending latest data")
		fmt.Println(err)
		// Write
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Write(jsonData)
		return
	}

	//////////////////// Drone data to Pilot data

	for _, drone := range xmlData.Capture.Drones {
		// Make a GET request to the API
		resp, err := http.Get("http://assignments.reaktor.com/birdnest/pilots/" + drone.SerialNumber)
		if err != nil {
			fmt.Println("Get from pilots error")
			log.Fatal(err)
			return
		}
		// If 404 skip pilot
		if resp.StatusCode == http.StatusNotFound {
			continue
		}

		defer resp.Body.Close()

		// Read the response body
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("Read JSON resp error")
			log.Fatal(err)
			return
		}

		// Unmarshal the JSON into a struct
		var pilot Pilot
		if err := json.Unmarshal(body, &pilot); err != nil {
			fmt.Println("Unmarshall error")
			log.Fatal(err)
			return
		}
		pilot.DroneSN = drone.SerialNumber

		pilot.PositionX = drone.PositionX
		pilot.PositionY = drone.PositionY
		if _, ok := colors[pilot.PilotId]; !ok {
			colors[pilot.PilotId] = fmt.Sprintf("#%06x", rand.Intn(1<<24))
		}
		pilot.Colour = colors[pilot.PilotId]
		var xOrigin, yOrigin float64
		xOrigin = 250
		yOrigin = 250
		d := math.Sqrt(math.Pow((drone.PositionX/1000)-xOrigin, 2) + math.Pow((drone.PositionY/1000)-yOrigin, 2))
		pilot.Distance = d
		if pilot.Distance <= 100 {
			pilot.Spotted = xmlData.Capture.SnapshotTimestamp
		}

		// Update Pilots
		exists := false
		for i, p := range Pilots {
			if p.PilotId == pilot.PilotId {
				if pilot.Distance > 100 {
					pilot.Spotted = Pilots[i].Spotted
				} else {
					pilot.Spotted = xmlData.Capture.SnapshotTimestamp
				}
				Pilots[i] = pilot
				exists = true
				break
			}
		}

		// If new Pilot to list append
		if !exists && pilot.Distance <= 100 {
			pilot.Colour = fmt.Sprintf("#%06x", rand.Intn(1<<24))
			Pilots = append(Pilots, pilot)
		}
	}

	// Only display 10 minutes and less (after violation of NDZ)
	FilterExpired()

	// Sort the pilots by distance
	sort.Sort(ByDistance(Pilots))

	// Marshall struct to JSON and send to client
	SendPilots(Pilots, w)
}

func FilterExpired() {
	for i, pilot := range Pilots {
		t, err := time.Parse(time.RFC3339, pilot.Spotted)
		if err != nil {
			fmt.Println("Time parse error")
			log.Fatal(err)
			return
		}
		now := time.Now()
		if t.Before(now.Add(-10 * time.Minute)) {
			// Remove from list
			if i < len(Pilots)-1 {
				Pilots = append(Pilots[:i], Pilots[i+1:]...)
			} else {
				Pilots = Pilots[:i]
			}
		}
	}
}

func SendPilots(Pilots []Pilot, w http.ResponseWriter) {
	jsonData, err := json.Marshal(Pilots)
	if err != nil {
		fmt.Println("Marshall error")
		log.Fatal(err)
	}

	// Write
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Write(jsonData)
}
