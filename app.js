var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var app = express();

/**
 * Conexión a la base de datos Prueba.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Prueba', {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true
    }).then(db => console.log('conexion exitosa'))
    .catch(err => console.log('error: ', err));

/**
 * Crear un nuevo Schema
 */
const clientSchema = new mongoose.Schema({ userId: Number, id: Number, title: String, completed: Boolean });
/**
 * Crear el modelo Client a partir del Schema anterior
 */
const Client = mongoose.model('Client', clientSchema);

/**
 * Uso de politicas CORS
 */
app.use(cors());
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Obtener Clientes de la base de datos.
 */
app.get('/Cliente', function (req, res) {  
	Client.find({}, function(err, docs) { //Client.find es el encargado de buscar todos los datos en el modelo de Client
        if (!err) { 
            res.send(docs);
        }
        else {
            throw err;
        }
    }); 
});

/**
 * Añadir clientes a la base de datos.
 */
app.post('/Cliente', function (req, res) {
    const userId = req.body.userId;
    const id = req.body.id;
    const title = req.body.title;
    const completed = req.body.completed
    mongoCreate(userId, id, title, completed);
	res.send({status: res.status, estado: "Ok"});
});

/**
 * Editar clientes a la base de datos.
 */
app.put('/Cliente/:id', function (req, res) {
    //Busca el cliente para asi poder actualizar los datos dentro de la base de datos.
    Client.findOneAndUpdate({ id: req.params.id},{$set:{title: req.body.title, completed: req.body.completed}},{new:true})   .then((docs)=>{
        if(docs) {
           resolve({success:true,data:docs});
        } else {
           reject({success:false,data:"no such user exist"});
        }
    })
    res.send({status: res.status, estado: "Ok"});
}); 
/**
 * Eliminar un cliente por id.
 */
app.delete('/Cliente/:id', function (req, res) {
    mongoDelete(req.params.id);
	res.send({status: res.status, estado: "Ok"});

});

/**
 * Crea un nuevo dato en el modelo Client en la base de datos.
 * @param {number} userId 
 * @param {number} id 
 * @param {string} title 
 * @param {boolean} completed 
 */
async function mongoCreate(userId, id, title, completed){
    await Client.create({ userId: userId, id: id, title: title, completed: completed});
}
/**
 * Elimina un dato en el modelo Client con respecto al id.
 * @param {number} id 
 */
async function mongoDelete(id){
    Client.deleteOne({ id: id }, function (err) {
    if(err) console.log(err);
    console.log("Successful deletion");
    });
}

app.listen(3000, function () {
  console.log('Server on port 3000!');
});