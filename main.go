package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/mfuentesg/transmission-client/handler"

	"github.com/julienschmidt/httprouter"
	"github.com/mfuentesg/transmission"
	"github.com/mfuentesg/transmission-client/config"
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

	router := httprouter.New()
	h := handler.New(cl)
	router.GET("/torrents/:id", h.GetTorrent)
	router.GET("/torrents", h.GetTorrents)

	router.POST("/torrents/:id/start", h.HandleTorrentAction(cl.Start))
	router.POST("/torrents/:id/start-now", h.HandleTorrentAction(cl.StartNow))
	router.POST("/torrents/:id/stop", h.HandleTorrentAction(cl.Stop))
	router.POST("/torrents/:id/verify", h.HandleTorrentAction(cl.Verify))
	router.POST("/torrents/:id/reannounce", h.HandleTorrentAction(cl.Reannounce))

	srv := &http.Server{
		Handler:      router,
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
