#!/bin/sh

pwd = $(pwd)
cd ..
cd ..
git pull origin master
cd ${pwd}