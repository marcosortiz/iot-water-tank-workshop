
````
sudo su
echo "nameserver 192.168.1.1" > /etc/resolv.conf
````

````
sudo dhclient -r eth0
sudo dhclient eth0
````

````
ssh-keygen -R hostname
````