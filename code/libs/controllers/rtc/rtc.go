package rtc

import (
	"fmt"
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

func signalHandler(c *gin.Context) {
	ws, err := upGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	defer ws.Close()

	json := make(chan []byte)
	ws.ReadJSON(json)

	for {
		msg := <-json
		fmt.Println(string(msg))
		ws.WriteJSON(msg)
	}
}
