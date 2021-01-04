const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const cors = require('cors');
app.use(cors())
app.options('*', cors())
const port = 3001

app.use(bodyParser.json())

const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'project_management_db',
    password: 'Reality5!',
    port: 5432
})

// Gets Tasks By Project_ID
app.get('/tasks/:project_id', (req, res) => {
    pool.query('SELECT * FROM Task WHERE Project_ID = $1 ORDER BY Task_ID', [req.params.project_id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Gets Dependencies By Project_ID
app.get('/dependencies/:project_id', (req, res) => {
    pool.query('SELECT * FROM Dependency WHERE Project_ID = $1 ORDER BY Dependency_ID', [req.params.project_id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Gets Team Members By Project_ID
app.get('/members/:project_id', (req, res) => {
    pool.query('SELECT * FROM Team_Member tm JOIN App_User au ON tm.User_ID = au.User_ID WHERE tm.Project_ID = $1', [req.params.project_id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Inserts New Task Into Database
app.post('/tasks', (req, res) => {
    pool.query('INSERT INTO Task (project_id, assigned_to, task_name, start_date, duration, progress) VALUES ($1, $2, $3, $4, $5, $6)',
    [req.body.project_id, req.body.assigned_to, req.body.task_name, req.body.start_date, req.body.duration, req.body.progress], 
    (error, results) => {
        if (error) {
            throw error
        }
    res.status(200).json(results.rows)
    })
})

// Updates Task In Database By Task_ID
app.post('/tasks/update/:task_id', (req, res) => {
    pool.query('UPDATE Task SET Assigned_To = $1, Task_Name = $2, Start_Date = $3, Duration = $4, Progress = $5 WHERE Task_ID = $6',
    [req.body.assigned_to, req.body.task_name, req.body.start_date, req.body.duration, req.body.progress, req.params.task_id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Deletes Task In Database By Task_ID
app.delete('/tasks/:task_id', (req, res) => {
    pool.query('DELETE FROM Task WHERE Task_ID = $1', [req.params.task_id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

// Inserts New Dependency Into Database
app.post('/dependencies', (req, res) => {
    pool.query('INSERT INTO Dependency (project_id, source_task, target_task) VALUES ($1, $2, $3)',
    [req.body.project_id, req.body.source_task, req.body.target_task], (error, results) => {
        if (error) {
            throw error
        }
    res.status(200).json(results.rows)
    })
})

// Deletes Dependency In Database By Dependency_ID
app.delete('/dependencies/:dependency_id', (req, res) => {
    pool.query('DELETE FROM Dependency WHERE Dependency_ID = $1', [req.params.dependency_id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))