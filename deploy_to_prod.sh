#! /bin/bash
npm run build
scp -r build/ ubuntu@saveourfaves.org:build/staged
ssh ubuntu@saveourfaves.org 'stat build/staged && rm -rf build/last &&  mv build/current build/last &&  mv build/staged build/current && sudo /snap/bin/docker exec saveourfaves-server_frontend_1 nginx -s reload'
