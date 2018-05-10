#!/bin/sh

ps=$(ps -ef | grep 'node www$')

pid=$(echo ${ps} | cut -d " " -f2)

if [ -n "${pid}" ]
then
	result=$(kill -9 ${pid})
	echo "process" ${pid} "is killed"
else
	echo "process not found"
fi
