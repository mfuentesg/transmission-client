package event

import (
	"context"
	"encoding/json"
	"log"
	"sync"

	socketio "github.com/googollee/go-socket.io"
	"github.com/mfuentesg/transmission"
	"github.com/mfuentesg/transmission-client/constant"
	"github.com/spf13/viper"
)

func getTransmissionClient() *transmission.Client {
	required := []string{constant.ConfigPassword, constant.ConfigUsername, constant.ConfigServerURL}
	for _, configKey := range required {
		if viper.GetString(configKey) == "" {
			return nil
		}
	}

	return transmission.New(
		transmission.WithURL(viper.GetString("server_url")),
		transmission.WithBasicAuth(
			viper.GetString("username"),
			viper.GetString("password"),
		),
	)
}

type Event struct {
	Client *transmission.Client
	mutex  sync.Mutex
}

type Error struct {
	Message string
}

type ConnectionConfig struct {
	ServerURL string `json:"server"`
	Username  string `json:"username"`
	Password  string `json:"password"`
}

type InitConfig struct {
	Configured bool   `json:"configured"`
	Theme      string `json:"theme"`
	ServerURL  string `json:"serverUrl"`
	Username   string `json:"username"`
}

func New() *Event {
	client := getTransmissionClient()
	if client != nil {
		if err := client.Ping(context.Background()); err != nil {
			log.Printf("unable to connect to transmission service: %+v\n", err)
			client = nil
		}
	}
	return &Event{Client: client}
}

func (evt *Event) OnConnect(s socketio.Conn) error {
	s.Emit(constant.EventInit, InitConfig{
		Configured: evt.Client != nil,
		Theme:      viper.GetString("theme"),
		Username:   viper.GetString("username"),
		ServerURL:  viper.GetString("server_url"),
	})
	return nil
}

func (evt *Event) OnError(s socketio.Conn, err error) {
	log.Printf("on error: %+v\n", err)
}

func (evt *Event) OnDisconnect(s socketio.Conn, reason string) {
	log.Println(s.ID(), "-> disconnected from server", reason)
}

func (evt *Event) TorrentGet(s socketio.Conn, message string) {
	// TODO: parse message into TorrentGetPayload
	// var payload map[string]string
	// if err := json.Unmarshal([]byte(message), &payload); err != nil {
	// 	log.Fatal("could not parse message to payload struct")
	// }
	//
	// id, ok := payload["id"]
	// if !ok {
	// 	log.Fatal("id is not part of the response")
	// }
	//
	// intId, _ := strconv.Atoi(id)
	//
	// torrents, err := evt.Client.TorrentGet(context.Background(), transmission.TorrentGet{
	// 	Ids: intId,
	// 	Fields: []string{
	// 		"activityDate",
	// 		"addedDate",
	// 		"bandwidthPriority",
	// 		"comment",
	// 		"corruptEver",
	// 		"creator",
	// 		"dateCreated",
	// 		"desiredAvailable",
	// 		"doneDate",
	// 		"downloadDir",
	// 		"downloadedEver",
	// 		"downloadLimit",
	// 		"downloadLimited",
	// 		"editDate",
	// 		"error",
	// 		"errorString",
	// 		"eta",
	// 		"etaIdle",
	// 		"files",
	// 		"fileStats",
	// 		"hashString",
	// 		"haveUnchecked",
	// 		"haveValid",
	// 		"honorsSessionLimits",
	// 		"id",
	// 		"isFinished",
	// 		"isPrivate",
	// 		"isStalled",
	// 		"labels",
	// 		"leftUntilDone",
	// 		"magnetLink",
	// 		"manualAnnounceTime",
	// 		"maxConnectedPeers",
	// 		"metadataPercentComplete",
	// 		"name",
	// 		"peer-limit",
	// 		"peers",
	// 		"peersConnected",
	// 		"peersFrom",
	// 		"peersGettingFromUs",
	// 		"peersSendingToUs",
	// 		"percentDone",
	// 		"pieces",
	// 		"pieceCount",
	// 		"pieceSize",
	// 		"priorities",
	// 		"queuePosition",
	// 		"rateDownload",
	// 		"rateUpload",
	// 		"recheckProgress",
	// 		"secondsDownloading",
	// 		"secondsSeeding",
	// 		"seedIdleLimit",
	// 		"seedIdleMode",
	// 		"seedRatioLimit",
	// 		"seedRatioMode",
	// 		"sizeWhenDone",
	// 		"startDate",
	// 		"status",
	// 		"trackers",
	// 		"trackerStats",
	// 		"totalSize",
	// 		"torrentFile",
	// 		"uploadedEver",
	// 		"uploadLimit",
	// 		"uploadLimited",
	// 		"uploadRatio",
	// 		"wanted",
	// 		"webseeds",
	// 		"downloaders",
	// 	},
	// })
	//
	// if err != nil {
	//
	// }
	//
	// s.Emit(constant.EventTorrentGet, torrent)
}

func (evt *Event) ConfigSet(s socketio.Conn, message string) {
	var conn ConnectionConfig
	if err := json.Unmarshal([]byte(message), &conn); err != nil {
		s.Emit(constant.EventConfigSetFailed)
		return
	}

	client := transmission.New(
		transmission.WithURL(conn.ServerURL),
		transmission.WithBasicAuth(conn.Username, conn.Password),
	)

	if err := client.Ping(context.Background()); err != nil {
		s.Emit(constant.EventConfigSetFailed)
		return
	}
	evt.mutex.Lock()
	viper.Set(constant.ConfigPassword, conn.Password)
	viper.Set(constant.ConfigUsername, conn.Username)
	viper.Set(constant.ConfigServerURL, conn.ServerURL)

	if err := viper.WriteConfig(); err != nil {
		log.Println("not able to write config file", err)
		s.Emit(constant.EventConfigSetFailed)
		return
	}

	evt.Client = client
	s.Emit(constant.EventConfigSetSuccess)
	evt.mutex.Unlock()
}

func (evt *Event) ConfigTest(s socketio.Conn, message string) {
	var conn ConnectionConfig
	if err := json.Unmarshal([]byte(message), &conn); err != nil {
		s.Emit(constant.EventConfigTestFailed)
		return
	}

	client := transmission.New(
		transmission.WithURL(conn.ServerURL),
		transmission.WithBasicAuth(conn.Username, conn.Password),
	)

	if err := client.Ping(context.Background()); err != nil {
		s.Emit(constant.EventConfigTestFailed)
		return
	}

	s.Emit(constant.EventConfigTestSuccess)
}
