const fetch = require("node-fetch");
//const chalk = require("chalk");
const readlineSync = require("readline-sync")

const TOKEN = "a8c484f6ab78bb5d8943ed56791c4ce57becff5e";

 function getActiveTasks() {
   return new Promise((res,rej)=>{
    fetch("https://api.todoist.com/rest/v1/tasks", {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }).then((res) => res.json())
    .then((data) => {
      //console.log(data.content)
      data.map((task) => {
        console.log(task.content)
        res(task.content)
      })
    });
   })
  
}

async function createATask(){
let taskToCreate = readlineSync.question("Specify the task you wish to create: ")
let taskTime = readlineSync.question("Specify the task time : ")
let obj= {
    "content": `${taskToCreate}`, 
    "due_string": `${taskTime}`,
    "due_lang": "en"
}
//console.log(JSON.stringify(content))
await fetch('https://api.todoist.com/rest/v1/tasks', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
    },
   body:JSON.stringify(obj)
}).then(res => res.json())
.then((data) => {
    console.log(data)
})
.catch((err) => {
  console.log(err)
})

// console.log(data)
}

async function closeATask(){
  let closeTask = readlineSync.question("Enter the task you wish to close : ")
  await fetch("https://api.todoist.com/rest/v1/tasks", {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }).then((res) => res.json())
  .then((data) => {
    //console.log(data)
    //console.log(deleteTask)
    data.map((task) => {
      //console.log(task.content)
      if(task.content.toLowerCase() === closeTask)
      {
          //console.log(task.id)
          let id = task.id
          fetch(`https://api.todoist.com/rest/v1/tasks/${id}/close`, {
            method : "POST",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            }
          })
          console.log(`The task ${closeTask} with id ${id} has been closed.`)
          // console.log(result)
      }
    })
  })
  .catch((err) => {
    console.log(err)
  });
}

// getActiveTasks();
//createATask();



//console.log(chalk.blue("Hello world!"));
async function todo(){
while(true)
{
  console.log("1 - Show all active tasks\n")
  console.log("2 - Create a task\n")
  console.log("3 - Close a task\n")
  console.log("4 - Delete a task\n")
  let choice = readlineSync.question("Enter the choice : ")
  console.log("\n")
  switch(choice){

      case '1' : {
        //console.log("Hi")
        await getActiveTasks()
        break
      }

      case '2' : {
        await createATask()
        break
      }

      case '3' :
        await getActiveTasks()
        await closeATask()
        break

      case '4' :
        deleteATask()
        break

      case '0' :
        process.exit(1)

      default : console.log("Choose the correct one from list\n")
  }
}


}
todo()