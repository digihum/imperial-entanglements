#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

cd stage/_book

git init
git config user.name "Tim Hollies"
git config user.email "tim.hollies@warwick.ac.uk"

git remote add upstream "https://$ACCESS_TOKEN@github.com/digihum/imperial-entanglements-app"
git fetch upstream
git reset upstream/master

touch .

git add -A .
git commit -m "rebuild at ${rev}"
git push -q upstream HEAD:master
