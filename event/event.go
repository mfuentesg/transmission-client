package event

import (
	"fmt"

	socketio "github.com/googollee/go-socket.io"
	"github.com/mfuentesg/transmission"
)

type Event struct {
	Client *transmission.Client
}

func New(client *transmission.Client) *Event {
	return &Event{
		Client: client,
	}
}

func (evt *Event) OnConnect(s socketio.Conn) error {
	fmt.Println("socket connected id ->", s.ID())

	return nil
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

func (evt *Event) ConfigSet(s socketio.Conn) {
	// TODO: call viper write function after set
}
