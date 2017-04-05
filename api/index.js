'use strict'

const dotenv = require('dotenv')
const path = require('path')
const db = require('./src/db')
const server = require('./src/server')
const actions = require('./src/server')

dotenv.load({
  path: process.env.dotenv_path || path.join(__dirname, '.env')
})

console.log('env', process.env.PORT)

server(actions(db()))
