import Gantt from './components/Gantt';
import './App.css';
import React from 'react'
import { gantt } from 'dhtmlx-gantt';

var data = {}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      project_id: 2,
      tasks: [],
      dependencies: [],
      members: [],
      taskFlag: false,
      linksFlag: false
    }
  }

  async componentDidMount() {

    gantt.attachEvent("onAfterTaskAdd", async (id,item) => {

      var taskData = {}
      taskData.project_id = this.state.project_id 
      taskData.assigned_to = null
      taskData.task_name = item.text
      taskData.start_date = this.parseTaskDate(item.start_date)
      taskData.duration = item.duration
      taskData.progress = item.progress

      await fetch('http://localhost:3001/tasks', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
      })
      this.fetchData()
    })

    gantt.attachEvent("onAfterTaskUpdate", async (id,item) => {

      var taskData = {}
      taskData.assigned_to = this.getUserID(item.resource)
      taskData.task_name = item.text
      taskData.start_date = this.parseTaskDate(item.start_date)
      taskData.duration = item.duration
      taskData.progress = item.progress

      await fetch(`http://localhost:3001/tasks/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
      })
      this.fetchData()
    })

    gantt.attachEvent("onAfterTaskDelete", async (id,item) => {
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE"
      })
      this.fetchData()
    })

    gantt.attachEvent("onAfterLinkAdd", async (id,item) => {

      var linkData = {}
      linkData.project_id = this.state.project_id 
      linkData.source_task = item.source
      linkData.target_task = item.target

      await fetch('http://localhost:3001/dependencies', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(linkData)
      })
      this.fetchData()
    })

    gantt.attachEvent("onAfterLinkDelete", async (id,item) => {
      await fetch(`http://localhost:3001/dependencies/${id}`, {
        method: "DELETE"
      })
      this.fetchData()
    })
    this.fetchData()
  }

  async fetchData() {
    const response1 = await fetch(`http://localhost:3001/tasks/${this.state.project_id}`)
    const json1 = await response1.json()
    this.setState({tasks:json1})

    const response2 = await fetch(`http://localhost:3001/dependencies/${this.state.project_id}`)
    const json2 = await response2.json()
    this.setState({dependencies:json2})

    const response3 = await fetch(`http://localhost:3001/members/${this.state.project_id}`)
    const json3 = await response3.json()
    this.setState({members:json3})

    this.setTaskData()
    this.setLinkData()
    gantt.clearAll()
    gantt.parse(data)
  }

  setTaskData() {
    var taskArray = []
    var tasks = this.state.tasks
    for (var i = 0; i < tasks.length; i++) {
      var obj = {}
      obj.id = tasks[i].task_id
      obj.text = tasks[i].task_name
      obj.start_date = this.parseDatabaseDate(tasks[i].start_date)
      obj.duration = tasks[i].duration
      obj.progress = tasks[i].progress
      obj.resource = this.getResource(tasks[i].assigned_to)
      taskArray.push(obj)
    }
    data.data = taskArray
    this.setState({taskFlag:true})
  }

  setLinkData() {
    var linkArray = []
    var links = this.state.dependencies
    for (var i = 0; i < links.length; i++) {
      var obj = {}
      obj.id = links[i].dependency_id
      obj.source = links[i].source_task
      obj.target = links[i].target_task
      obj.type = '0'
      linkArray.push(obj)
    }
    data.links = linkArray
    this.setState({linksFlag:true})
  }

  parseDatabaseDate(databaseDate) {
    var date = new Date(databaseDate)
    return date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()
  }

  parseTaskDate(taskDate) {
    var date = new Date(taskDate)
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
  }

  getResource(user_id) {
    for (var i = 0; i < this.state.members.length; i++) {
      if (user_id === this.state.members[i].user_id) {
        return this.state.members[i].first_name
      }
    }
  }

  getUserID(resource) {
    if (resource === undefined) {
      return null
    } else {
      for (var i = 0; i < this.state.members.length; i++) {
        if (this.state.members[i].first_name.toUpperCase() === resource.toUpperCase()) {
          return this.state.members[i].user_id
        }
      }
      alert(resource+' is not a member of this project team.')
      return null
    }
  }

  render () {
    return (
      <div>
        {this.state.taskFlag && this.state.linksFlag ? 
          (<div className="gantt-container">
            <Gantt 
              tasks={data}
            />
          </div>) : (null)
        }
      </div>
    )
  }
}

export default App;
