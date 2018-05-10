#!/bin/sh

path=$(pwd)
cd ${path%/*}
git pull origin master
cd ${path}
