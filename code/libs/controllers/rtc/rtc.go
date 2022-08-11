package rtc

import (
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func InitRoute(router *gin.Engine) {
	group := router.Group("/rtc")
	group.GET("/signal", signalHandler)
}

var upGrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Type string `json:"type"`
	Room string `json:"room"`
	Data string `json:"data"`
}

type Candidate struct {
	Data string
	Chan chan string
}

var CandidateForRoom = make(map[string]Candidate)

func signalHandler(c *gin.Context) {
	ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer ws.Close()

	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			break
		}

		var msg Message
		err = json.Unmarshal(message, &msg)
		if err != nil {
			break
		}

		if candidate, exist := CandidateForRoom[msg.Room]; exist {
			candidate.Chan <- string(message)

			ws.WriteMessage(websocket.TextMessage, []byte(candidate.Data))
		} else {
			go func() {
				candidateChan := make(chan string)
				CandidateForRoom[msg.Room] = Candidate{
					Data: string(message),
					Chan: candidateChan,
				}
				data := <-candidateChan
				ws.WriteJSON(Message{
					Type: "candidate",
					Data: data,
				})
			}()
		}

	}
}
