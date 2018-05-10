#!/bin/sh

pwd = $(pwd)
cd ..
node www &
cd ${pwd}
