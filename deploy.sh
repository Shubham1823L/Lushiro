cd /opt/myapp

echo Pulling latest images...
sudo docker -f compose.prod.yaml pull

echo Building and then running...
sudo docker -f compose.prod.yaml up --build

echo Cleaning up old images...
sudo docker system prune -af --volumes

echo Good shit!

