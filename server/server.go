package server

import (
	h "birdnest/server/handlers"
	"log"
	"net/http"
)

func Server() {
	http.HandleFunc("/", h.GetRequest)

	log.Println("Starting server port 8080 (http://localhost:8080/)")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
