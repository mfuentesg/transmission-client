package handler

import (
	"fmt"

	socketio "github.com/googollee/go-socket.io"
	"github.com/mfuentesg/transmission"
)

type Handler struct {
	Client *transmission.Client
}

func New(client *transmission.Client) *Handler {
	return &Handler{
		Client: client,
	}
}

func (h *Handler) OnConnect(s socketio.Conn) error {
	fmt.Println("socket connected id ->", s.ID())
	return nil
}
