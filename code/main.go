package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func main() {
	router := gin.Default()

	serveStaticResources(router)

	router.GET("/signal", signalHandler)

	router.Run(":9000")
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

}

func serveStaticResources(router *gin.Engine) {
	router.LoadHTMLFiles("./view/out/index.html")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	router.StaticFS("/app", http.Dir("./view/out"))
}
