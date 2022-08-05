.PHONY: run
run:
	cd view && npm run build && cd .. && go mod tidy && GO111MODULE=on go build -o target/main main.go && ./target/main