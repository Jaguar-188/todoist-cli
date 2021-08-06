const fetch = require("node-fetch");
const chalk = require("chalk");
const readlineSync = require("readline-sync")
require("dotenv").config()

const TOKEN = process.env.TOKEN

async function getActiveTasks() 
{
    await fetch("https://api.todoist.com/rest/v1/tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((data,) => {
      data.map((task,index) => {
        console.log("\t\t"+index+" "+task.content+"\n")
      })
    })
    .catch((err) => {
      console.log(err)
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
    await fetch('https://api.todoist.com/rest/v1/tasks', {
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
    await fetch("https://api.todoist.com/rest/v1/tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((data) => {
      data.map((task) => {
        if(task.content.toLowerCase() === closeTask)
        {
            let id = task.id
            fetch(`https://api.todoist.com/rest/v1/tasks/${id}/close`, {
              method : "POST",
              headers: {
                Authorization: `Bearer ${TOKEN}`,
              }
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
    await fetch("https://api.todoist.com/rest/v1/tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((data) => {
      data.map((task) => {
        if(task.content.toLowerCase() === deleteTask)
        {
            let id = task.id
            fetch(`https://api.todoist.com/rest/v1/tasks/${id}`, {
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

async function todoist(){
  while(true)
  {
    console.log("\t1 - Show all active tasks\n")
    console.log("\t2 - Create a task\n")
    console.log("\t3 - Close a task\n")
    console.log("\t4 - Delete a task\n")
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