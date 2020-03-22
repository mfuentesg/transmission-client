package config

import (
	"encoding/json"
)

type Config struct {
	URL  string `json:"url"`
	Auth struct {
		Username string `json:"username"`
		Password string `json:"password"`
	} `json:"auth"`
}

func Parse(b []byte) (Config, error) {
	var config Config
	if err := json.Unmarshal(b, &config); err != nil {
		return Config{}, err
	}
	return config, nil
}
