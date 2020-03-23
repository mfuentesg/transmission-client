package handler

import (
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
	"github.com/mfuentesg/transmission"
	"github.com/mfuentesg/transmission-client/response"
)

type Handler struct {
	Client *transmission.Client
}

func New(client *transmission.Client) *Handler {
	return &Handler{
		Client: client,
	}
}

func (h *Handler) GetTorrent(w http.ResponseWriter, _ *http.Request, ps httprouter.Params) {
	id, _ := strconv.Atoi(ps.ByName("id"))
	torr, err := h.Client.Get(int64(id), []string{"magnetLink", "id", "name", "totalSize"})

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
}

func (h *Handler) GetTorrents(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	torr, err := h.Client.GetAll([]int64{}, []string{"magnetLink", "id", "name", "totalSize"})
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
}

func (h *Handler) AddTorrent(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
	torr, err := h.Client.Add(transmission.AddPayload{
		DownloadDir: "/media/storage/Downloads",
		Filename:    "magnet:?xt=urn:btih:26fd40855ce763be57d4462f1e7f831b684be9dd&dn=Card+Captor+Sakura+%28PT-BR%29+%28Dublado%29&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969",
	})

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
}

func (h *Handler) HandleTorrentAction(action func(int64) error) httprouter.Handle {
	return func(w http.ResponseWriter, _ *http.Request, ps httprouter.Params) {
		id, _ := strconv.Atoi(ps.ByName("id"))
		err := action(int64(id))

		responseWriter := response.New(w)
		if err != nil {
			responseWriter.JSON(http.StatusBadRequest, struct {
				Error string `json:"error"`
			}{
				Error: err.Error(),
			})
			return
		}
		responseWriter.JSON(http.StatusCreated, nil)
	}
}
