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
      console.table("\t\t"+index+" "+task.content+"\n")
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
    await fetch(URL+"tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((data) => {
      data.map((task) => {
        if(task.content === closeTask)
        {
            let id = task.id
            fetch(URL+`tasks/${id}/close`, {
              method : "POST",
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              }
            })
            .then(res => res.json())
            .then((data) => {
              console.log(data)
            })
            .catch((err) => {
              console.log(err)
            })
            console.log(`\nThe task ${closeTask} with id ${id} has been closed.\n`)
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

async function deleteATask()
{
    let deleteTask = readlineSync.question("Enter the task you wish to delete : ")
    await fetch(URL+"tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((data) => {
      data.map((task) => {
        if(task.content === deleteTask)
        {
            console.log(task.id)
            let id = task.id
            fetch(URL+`tasks/${id}`, {
              method : "DELETE",
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              }
            })
            .then(res => res.json())
            .then((data) => {
              console.log(data)
            })
            .catch((err) => {
              console.log(err)
            })
            console.log(`\nThe task ${deleteTask} with id ${id} has been deleted.\n`)
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })
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
      console.log("\t\t"+index+" "+project.name+" "+project.id+"\n")
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
    console.log("\tAbove is the Project list\n")
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
              console.log(`\nThe task ${data.content} has been successfully created in ${project.name}.\n`)
          })
          .catch((err) => {
            console.log(err)
          }) 
      }
    }

    
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