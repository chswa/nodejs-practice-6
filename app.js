const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, 'covid19India.db')

let db = null
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Serever Running')
    })
  } catch (e) {
    console.log(e)
    console.log(`DB Error:${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

//get states

app.get('/states/', async (request, response) => {
  const getStatesQuery = `SELECT * FROM state`

  const statesArray = await db.all(getStatesQuery)

  response.send(
    statesArray.map(eachState => {
      return {
        stateId: eachState.state_id,
        stateName: eachState.state_name,
        population: eachState.population,
      }
    }),
  )
})

//get State

app.get('/states/:stateId/', async (request, response) => {
  const {stateId} = request.params

  const getStateQuery = `SELECT * FROM state WHERE state_id=${stateId}`

  const getState = await db.get(getStateQuery)

  response.send(
    getState.map(eachState => {
      return {
        stateId: eachState.state_id,
        stateName: eachState.state_name,
        population: eachState.population,
      }
    }),
  )
})

//create district
