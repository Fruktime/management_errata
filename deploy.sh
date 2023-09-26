#!/bin/bash
if [[ $1 = "prod" || $1 = "dev" ]] && [[ $2 = "down" || $2 = "up" || $2 = "build" ]]; then
  fileEnv="docker-compose.${1}.yml"
  downOrUpOrBuild=$2

  if [[ downOrUpOrBuild = "build" ]]; then
    echo "Running docker compose -f $fileEnv up -d --build"
    docker compose -f $fileEnv up -d --build
  else
    echo "Running docker compose -f $fileEnv $downOrUpOrBuild"
    docker compose -f $fileEnv $downOrUpOrBuild
  fi
else
  echo "Need to follow format ./deploy.sh prod|dev down|up|build"
fi