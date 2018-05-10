#!/bin/sh

ps = $(ps -ef | grep 'node www$')

#echo process info : ${ps}

pid = $(echo ${ps} | cut -d " " -f2)

if( [ -n"${pid}" ]
then
	result = $(kill -9 ${pid})
	echo process is killed
else
	echo process not found
fi