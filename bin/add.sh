url=$1
slug=$2

curl -v --cookie 'connect.sid="s%3AAbUeFIzvvMs6TGW5Umw0l5F8ll7t0vtB.fdVQRcmG90Zb69ycBYhRT6XDCrSyN%2BVO5eKILMicJXI"'  -H"Content-Type: Application/json" -XPOST --data "{\"url\": \"$url\", \"slug\": \"$slug\" }" "http://localhost:3001/add"
