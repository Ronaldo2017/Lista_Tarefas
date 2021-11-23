const express = require('express')
const app = express()
const mysql = require('mysql')

app.set('view engine', 'ejs')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

//conexão com bd
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'lista_tarefas'
})

app.get('/tarefa', function (req, res) {

    connection.query('select * from tarefas;', function (err, resultado) {

        res.render('./tarefa', { dados: resultado })
    })
})

app.post('/tarefa/salvar', function (req, res) {
    const dados = req.body

    connection.query('INSERT INTO tarefas SET ?', dados, function (err, resultado) {
        res.redirect('/tarefa')
    })
})

app.get('/editar/:Id_Tarefa', function (req, res) {

    connection.query('select * from tarefas where Id_Tarefa = ' + req.params.Id_Tarefa, function (err, linha) {
        res.render('editar', {
            Id_Tarefa: linha[0].Id_Tarefa,
            Nome_Tarefa: linha[0].Nome_Tarefa,
            Situacao_Tarefa: linha[0].Situacao_Tarefa
        })
    })
})

app.post('/atualizar/:Id_Tarefa', function (req, res) {
    const dados = req.body

    connection.query('UPDATE tarefas SET ? WHERE Id_Tarefa = ' + req.params.Id_Tarefa, dados, function (err) {
        res.redirect('/tarefa')
    })
})

app.get('/tarefa/deletar/:Id_Tarefa', function (req, res) {
    const id = req.params.Id_Tarefa

    connection.query('DELETE FROM tarefas WHERE Id_Tarefa = ' + id,function (err) {
        res.redirect('/tarefa')
    })
})

connection.connect(function (err) {
    if (err) {
        console.log(err)
    }

    console.log('Servidor no ar! Conectou ao MYSQL')

    app.listen(3000)
})

