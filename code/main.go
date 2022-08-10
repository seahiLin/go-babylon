package main

import (
	"net/http"

	"gintest/libs/controllers/rtc"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	serveStaticResources(router)

	rtc.InitRoute(router)

	router.Run(":9000")
}

func serveStaticResources(router *gin.Engine) {
	router.LoadHTMLFiles("./view/out/index.html")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	router.StaticFS("/app", http.Dir("./view/out"))
}
