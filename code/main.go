package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	serveStaticResources(router)

	router.GET("/api/v1/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.Run(":9000")
}

func serveStaticResources(router *gin.Engine) {
	router.LoadHTMLFiles("./view/out/index.html")
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	router.StaticFS("/app", http.Dir("./view/out"))
}
