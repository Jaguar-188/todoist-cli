const fetch = require("node-fetch");
const chalk = require("chalk");
const regEx = new RegExp("EAI_AGAIN*")
const readlineSync = require("readline-sync")
require("dotenv").config()

const TOKEN = process.env.TOKEN
const URL = "https://api.todoist.com/rest/v1/"

async function getActiveTasks() 
{
    let data = await fetch(URL+"tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch((err) => {
      console.log(err)
    })
    data.map((task,index) => {
      console.table("\t\t"+(index+1)+" "+task.content+"\n")
    })
}

async function createATask()
{
    let taskToCreate = readlineSync.question("Specify the task you wish to create: ")
    let taskTime = readlineSync.question("Specify the task time : ")
    let obj= {
        "content": `${taskToCreate}`, 
        "due_string": `${taskTime}`,
        "due_lang": "en"
    }
    await fetch(URL+"tasks", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
        body:JSON.stringify(obj)
    }).then(res => res.json())
    .then((data) => {
        console.log(`\nThe task ${data.content} has been created successfully.\n`)
    })
    .catch((err) => {
      console.log(err)
    }) 
}

async function closeATask()
{
    let closeTask = readlineSync.question("Enter the task you wish to close : ")
    let tasks = await fetch(URL+"tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      }
    }).then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch((err) => {
      console.log(err)
    })
    for(let task of tasks)
    {
      if(task.content === closeTask)
      {
          let id = task.id
          await fetch(URL+`tasks/${id}/close`, {
            method : "POST",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            }
          })
          .then(res => res.json())
          .catch((err) => {
            console.log(err)
          })
      }
    }
    console.log(`\nThe task ${closeTask} has been closed successfully.\n`)
}

async function deleteATask()
{
    let deleteTask = readlineSync.question("Enter the task you wish to delete : ")
    let tasks = await fetch(URL+"tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      }
    }).then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch((err) => {
      console.log(err)
    })
    for(let task of tasks)
    {
      if(task.content === deleteTask)
      {
          let id = task.id
          await fetch(URL+`tasks/${id}`, {
            method : "DELETE",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            }
          })
          .then(res => res.json())
          .catch((err) => {
            console.log(err)
          })
      }
    }
    console.log(`\nThe task ${deleteTask} has been deleted successfully.\n`)
}

async function getAllProjects() 
{
    let data = await fetch(URL+"projects", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch((err) => {
       if(regEx.test(err.toString()))
       {
          console.log("Error due to Network.Check Your Network Connection")
          process.exit(0)
       }
       else
       {
          console.log(err)
       }
    })
    data.map((project,index) => {
      console.log("\t\t"+index+" "+project.name+"\n")
    })
}

async function createAProject()
{
    let projectToCreate = readlineSync.question("Specify the name of Project you wish to create: ")
    let obj= {
        "name": `${projectToCreate}` 
    }
    await fetch(URL+"projects", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
        body:JSON.stringify(obj)
    }).then(res => res.json())
    .then((data) => {
        console.log(`\nThe Project ${data.name} has been created successfully.\n`)
    })
    .catch((err) => {
      console.log(err)
    }) 
}

async function createATaskInProject(){
    console.log("Above is the Project list\n")
    let projectName = readlineSync.question("Choose in which Project You wanted to create a task : ")
    let data = await fetch(URL+"projects", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((data) => {
      return data
    })
    .catch((err) => {
      console.log(err)
    })
    for(let project of data)
    {
      if(project.name === projectName)
      {
          let taskToCreate = readlineSync.question("Specify the task you wish to create: ")
          let taskTime = readlineSync.question("Specify the task time : ")
          let obj= {
              "content": `${taskToCreate}`, 
              "due_string": `${taskTime}`,
              "due_lang": "en",
              "project_id" : project.id
          }
          await fetch(URL+"tasks", {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${TOKEN}`,
              },
              body:JSON.stringify(obj)
          }).then(res => res.json())
          .then((data) => {
              console.log(`\nThe task ${data.content} has been created successfully in ${project.name}.\n`)
          })
          .catch((err) => {
            console.log(err)
          }) 
      }
    } 
}

async function closeATaskInProject(){
    console.log("Above is the Project list\n")
    let projectName = readlineSync.question("Choose from which Project You wanted to close a task : ")
    let projects = await fetch(URL+"projects", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((projects) => {
      return projects
    })
    .catch((err) => {
      console.log(err)
    })
    let closeTask = readlineSync.question("Enter the task you wish to close : ")
    let tasks = await fetch(URL+"tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((tasks) => {
      return tasks
    })
    for(let project of projects)
    {
      if(project.name === projectName)
      {
          for(let task of tasks)
          {
              if(task.content === closeTask)
              {
                let id = task.id
                let obj = {
                  "project_id": project.id
                }
                await fetch(URL+`tasks/${id}/close`, {
                  method : "POST",
                  headers: {
                    Authorization: `Bearer ${TOKEN}`,
                  },
                  body : JSON.stringify(obj)
                })
                .then(res => res.json())
                .then((data) => {
                  console.log(data)
                })
                .catch((err) => {
                  console.log(err)
                })
              }
          }
          
      }
    } 
    console.log(`\nThe Task ${closeTask} from project ${projectName} is closed successfully.\n`)
}

async function deleteATaskInProject(){
    console.log("Above is the Project list\n")
    let projectName = readlineSync.question("Choose from which Project You wanted to delete a task : ")
    let projects = await fetch(URL+"projects", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((projects) => {
      return projects
    })
    .catch((err) => {
      console.log(err)
    })
    let deleteTask = readlineSync.question("Enter the task you wish to delete : ")
    let tasks = await fetch(URL+"tasks", {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }).then((res) => res.json())
      .then((tasks) => {
        return tasks
    })
    for(let project of projects)
    {
      if(project.name === projectName)
      {
          for(let task of tasks)
          {
              if(task.content === deleteTask)
              {
                let id = task.id
                let obj = {
                  "project_id": project.id
                }
                await fetch(URL+`tasks/${id}`, {
                  method : "DELETE",
                  headers: {
                    Authorization: `Bearer ${TOKEN}`,
                  },
                  body : JSON.stringify(obj)
                })
                .then(res => res.json())
                .then((data) => {
                  console.log(data)
                })
                .catch((err) => {
                  console.log(err)
                })
              }
          }
      }
    }
    console.log(`\nThe Task ${deleteTask} from project ${projectName} is deleted successfully.\n`)
}



async function todoist(){
  while(true)
  {
    console.log("\t0 - Exit\n")
    console.log("\t1 - Show all active Tasks\n")
    console.log("\t2 - Create a Task\n")
    console.log("\t3 - Close a Task\n")
    console.log("\t4 - Delete a Task\n")
    console.log("\t5 - Show all Projects\n")
    console.log("\t6 - Create a Project\n")
    console.log("\t7 - Create a Task in Project\n")
    console.log("\t8 - Close a Task in Project\n")
    console.log("\t9 - Delete a Task in Project\n")
    let choice = readlineSync.question("Enter the choice : ")
    console.log("\n")
    switch(choice){

        case '1' : {

          await getActiveTasks()
          break

        }

        case '2' : {

          await getActiveTasks()
          await createATask()
          break

        }

        case '3' :{

          await getActiveTasks()
          await closeATask()
          break

        }

        case '4' :{

          await getActiveTasks()
          await deleteATask()
          break

        }

        case '5' :{

          await getAllProjects()
          break

        }

        case '6' :{
          
          await getAllProjects()
          await createAProject()
          break

        }

        case '7' :{

          await getAllProjects()
          await createATaskInProject()
          break

        }

        case '8' :{

          await getAllProjects()
          await closeATaskInProject()
          break

        }

        case '9' :{

          await getAllProjects()
          await deleteATaskInProject()
          break

        }

        case '0' :{

          process.exit(0)

        }

        default : {
          console.log("\tChoose the correct one from list\n")
        }
    }
  }
}

todoist()