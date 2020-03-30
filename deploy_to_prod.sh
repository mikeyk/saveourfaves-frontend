#! /bin/bash
npm run build
scp -i /Users/chrisciszak/Downloads/LightsailDefaultKey-eu-west-1.pem -r build ubuntu@52.31.241.233:apps/SaveOurFaves/saveourfaves-server/nginx/build/staged
ssh -i /Users/chrisciszak/Downloads/LightsailDefaultKey-eu-west-1.pem ubuntu@52.31.241.233  'sudo stat apps/SaveOurFaves/saveourfaves-server/nginx/build/staged && sudo rm -rf apps/SaveOurFaves/saveourfaves-server/nginx/build/last && sudo mv apps/SaveOurFaves/saveourfaves-server/nginx/build/current apps/SaveOurFaves/saveourfaves-server/nginx/build/last && sudo mv apps/SaveOurFaves/saveourfaves-server/nginx/build/staged apps/SaveOurFaves/saveourfaves-server/nginx/build/current && sudo docker exec saveourfaves-server_frontend_1 nginx -s reload'
