#!/bin/bash
INTERVAL=${1:-1}
for i in $(seq 1 10000); do
    echo "Requisição $i"
    curl --max-time 2 http://192.168.49.2:30080
    sleep $INTERVAL
done
