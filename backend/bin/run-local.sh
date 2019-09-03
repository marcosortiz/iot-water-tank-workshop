#!/bin/bash

mydir="${0%/*}"
sam local invoke FunctionName --event $mydir/run-local/event.json --env-vars $mydir/run-local/env-vars.json