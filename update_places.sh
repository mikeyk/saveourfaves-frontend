#! /bin/bash
ssh ubuntu@saveourfaves.org './regen_places.sh'
scp ubuntu@saveourfaves.org:Places.js src/CityData/Places.js