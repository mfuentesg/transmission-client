package event

import (
	"context"
	"log"

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
}

type Error struct {
	Message string
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
	s.Emit(constant.EventError, Error{Message: err.Error()})
}

// nolint
func (evt *Event) OnDisconnect(s socketio.Conn, _ string) {
	_ = s.Close()
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
	// TODO: call viper write function after set
}
