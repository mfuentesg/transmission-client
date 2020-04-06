package constant

const (
	EventInit  = "init"
	EventError = "error"

	EventTorrentGet        = "torrent:get"
	EventTorrentGetSuccess = "torrent:get:success"
	EventTorrentGetFailed  = "torrent:get:failed"

	EventConfigSet        = "config:set"
	EventConfigSetSuccess = "config:set:success"
	EventConfigSetFailed  = "config:set:failed"

	ConfigServerURL = "server_url"
	ConfigUsername  = "username"
	ConfigPassword  = "password"
)
