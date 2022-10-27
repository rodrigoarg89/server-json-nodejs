const http = require("http");
const path = require("path");
const fs = require("fs/promises");

const PORT = 8000;

const app = http.createServer(async (req, res) => {
    const requestMethod = req.method;
    const requestURL = req.url;
    console.log(requestURL, requestMethod); 

    const jsonPath = path.resolve("./data.json");
    const jsonFile = await fs.readFile(jsonPath, 'utf8')

    if (requestURL == "/apiv1/tasks") {
        if (requestMethod == "GET") {
            res.setHeader("200", "Content-Type", "application/json")
            res.writeHead("200");
            res.write(jsonFile);
        }
        if (requestMethod == "POST") {
            req.on("data", async (data) => {
                
            const parsed = JSON.parse(data) // body

            const tasksArray = JSON.parse(jsonFile)
            tasksArray.push({ ... parsed, id: getLastId(tasksArray)});
            await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
            res.setHeader("201", "Content-Type", "application/json")
        })
        }
        if (requestMethod == "PUT") {
            req.on("data", async (data) => {
            const {id, status} = JSON.parse(data);
            const tasksArray = JSON.parse(jsonFile);

            const taskIndex = tasksArray.findIndex((task) => task.id == id);
            tasksArray[taskIndex].status = status;
            await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
            res.setHeader("200", "Content-Type", "application/json")
        })
        }
        if (requestMethod == "DELETE") {
            req.on("data", async (data) => {
            const {id, status} = JSON.parse(data);
            const tasksArray = JSON.parse(jsonFile);
            console.log(id)
            const taskIndex = tasksArray.findIndex((task) => task.id == id);
            tasksArray.splice(taskIndex, 1);
            await fs.writeFile(jsonPath, JSON.stringify(tasksArray));
            res.sendStatus(200);

            })
        }


    } else {
        res.writeHead("503") 
    }
    res.end();
});


app.listen(PORT);
console.log('servidor corriendo al 100')

const getLastId = (dataArray) => {
    const lastElementIndex = dataArray.length - 1;
    return dataArray[lastElementIndex].id + 1;
}