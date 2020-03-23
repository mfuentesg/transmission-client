package response

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Response wrap common http responses
type Response struct {
	writer http.ResponseWriter
}

// NewResponse instantiate `Response` struct
func New(w http.ResponseWriter) *Response {
	return &Response{
		writer: w,
	}
}

func (r *Response) writeJSON(code int, data interface{}) {
	r.writer.Header().Set("content-type", "application/json")
	b, err := json.Marshal(data)
	if err != nil {
		r.writer.WriteHeader(http.StatusInternalServerError)
		_, _ = r.writer.Write([]byte(fmt.Sprintf("unexpected error: %v", err)))
	}
	r.writer.WriteHeader(code)
	if data != nil {
		_, _ = r.writer.Write(b)
	}
}

// JSON converts the given interface in a JSON response
// adding the expected headers.
func (r *Response) JSON(code int, data interface{}) {
	r.writeJSON(code, data)
}
