cat config | jq -r '.certificatePem' > core.cert.pem
cat config | jq -r '.keyPair.PrivateKey' > core.private.key
cat config | jq -r '.configFile' > config.json
sudo cp root.ca.pem /greengrass/certs/
sudo cp core.cert.pem /greengrass/certs/
sudo cp core.private.key /greengrass/certs/
sudo cp config.json /greengrass/config/
