package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	socketio "github.com/googollee/go-socket.io"
	"github.com/mfuentesg/transmission-client/constant"
	"github.com/mfuentesg/transmission-client/event"
	"github.com/spf13/viper"
)

func initConfig() {
	viper.SetDefault("username", "")
	viper.SetDefault("password", "")
	viper.SetDefault("server_url", "")
	viper.SetDefault("theme", "light")
	viper.SetDefault("require_auth", false)

	viper.AddConfigPath(".")
	viper.SetConfigName("config")
	viper.SetConfigType("json")
	viper.SetEnvPrefix("T_")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("not able to read configuration file: %+v\n", err)
	}

	// merge with old configuration with the new one
	if err := viper.MergeInConfig(); err != nil {
		log.Printf("not able to merge configurations: %+v\n", err)
	}

	if err := viper.WriteConfig(); err != nil {
		log.Printf("not able to write merged configuration: %+v\n", err)
	}
}

func main() {
	socketServer, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal("could not create socket.io server")
	}

	http.Handle("/socket.io/", socketServer)
	http.Handle("/", http.FileServer(http.Dir("./public")))

	initConfig()

	evt := event.New()
	socketServer.OnConnect("/", evt.OnConnect)
	socketServer.OnError("/", evt.OnError)
	socketServer.OnDisconnect("/", evt.OnDisconnect)
	socketServer.OnEvent("/", constant.EventTorrentGet, evt.TorrentGet)
	socketServer.OnEvent("/", constant.EventConfigSet, evt.ConfigSet)

	httpServer := &http.Server{
		Addr:         ":8000",
		WriteTimeout: 5 * time.Second,
		ReadTimeout:  5 * time.Second,
	}
	errs := make(chan error, 2)
	go func() {
		errs <- socketServer.Serve()
		defer socketServer.Close()
	}()
	go func() {
		log.Printf("server started on port %s\n", httpServer.Addr)
		errs <- httpServer.ListenAndServe()
	}()
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGINT)
		errs <- fmt.Errorf("%s", <-c)
	}()
	fmt.Printf("service terminated: %s\n", <-errs)
}
