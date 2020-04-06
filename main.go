package main

import (
	"context"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	socketio "github.com/googollee/go-socket.io"
	"github.com/mfuentesg/transmission"
	"github.com/mfuentesg/transmission-client/config"
	"github.com/mfuentesg/transmission-client/constant"
	"github.com/mfuentesg/transmission-client/event"
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

	if err := cl.Ping(context.Background()); err != nil {
		log.Fatalf("could not connect to transmission service: %+v", err)
	}

	socketServer, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal("could not create socket.io server")
	}

	srv := &http.Server{
		Addr:         ":8000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	evt := event.New(cl)

	socketServer.OnConnect("/", evt.OnConnect)
	socketServer.OnError("/", func(s socketio.Conn, e error) {
		print("meet error:", s.Context().(string), e)
	})
	socketServer.OnDisconnect("/", func(s socketio.Conn, reason string) {
		print("closed", reason)
		print(s.Close())
	})

	socketServer.OnEvent("/", constant.EventTorrentGet, evt.TorrentGet)

	http.Handle("/socket.io/", socketServer)
	http.Handle("/", http.FileServer(http.Dir("./public")))

	errs := make(chan error, 2)
	go func() {
		errs <- socketServer.Serve()
		defer socketServer.Close()
	}()
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
