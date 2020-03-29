#! /bin/bash
npm run build
scp -r build/ ubuntu@supportseattle.org:build/staged
ssh ubuntu@supportseattle.org 'stat build/staged && rm -rf build/last &&  mv build/current build/last &&  mv build/staged build/current && sudo /snap/bin/docker exec supportseattle-server_frontend_1 nginx -s reload'
