package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	"github.com/mfuentesg/transmission"
	"github.com/mfuentesg/transmission-client/config"
	"github.com/mfuentesg/transmission-client/response"
)

func main() {
	path := flag.String("config", "", "config file path")
	flag.Parse()

	if *path == "" {
		flag.Usage()
		return
	}

	b, err := ioutil.ReadFile(*path)
	if err != nil {
		log.Fatalf("could not load config file: %v\n", err)
	}

	conf, err := config.Parse(b)
	if err != nil {
		log.Fatalf("could not parse config file: %v\n", err)
	}

	cl := transmission.New(
		transmission.WithURL(conf.URL),
		transmission.WithBasicAuth(conf.Auth.Username, conf.Auth.Password),
	)

	if err := cl.Ping(); err != nil {
		log.Fatalf("could not connect to transmission service: %+v", err)
	}

	r := mux.NewRouter()
	r.HandleFunc("/torrents/{id:[0-9]+}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id, _ := strconv.Atoi(vars["id"])
		torr, err := cl.Get(int64(id), []string{"magnetLink", "id", "name", "totalSize"})

		responseWriter := response.New(w)
		if err != nil {
			responseWriter.JSON(http.StatusBadRequest, struct {
				Error string `json:"error"`
			}{
				Error: err.Error(),
			})
			return
		}
		responseWriter.JSON(http.StatusOK, torr)
	})

	srv := &http.Server{
		Handler:      r,
		Addr:         ":8000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	errs := make(chan error, 2)
	go func() {
		log.Printf("server started on port %s\n", srv.Addr)
		errs <- srv.ListenAndServe()
	}()
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGINT)
		errs <- fmt.Errorf("%s", <-c)
	}()
	fmt.Printf("service terminated: %s\n", <-errs)
}
