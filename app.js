const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const handlebars = require('express-handlebars')

const app = express()

const urlencodeParser = bodyParser.urlencoded({extended:false})
const sql = mysql.createConnection({
    hots: 'localhost' ,
    user: 'root',
    password: '',
    database: 'nodejs',
    port: 3306
})

sql.query('use nodejs')

app.engine('handlebars', handlebars({defaultLayout:'main'}))
app.set('view engine', 'handlebars');

app.use('/css', express.static('css'))
app.use('/js', express.static('js'))

app.get('/', function(req, res){
    res.render('index')
})

app.get('/inserir', (req, res) => {
    res.render('inserir')
})
app.get('/selecionar/:id?', (req, res) => {
    if(!req.params.id){
        sql.query('select * from product', (err,results,fields) => {
            res.render('selecionar', {data:results})
        })
    } else {
        sql.query('select * from product where id=?',[req.params.id], (err,results,fields) => {
            res.render('selecionar', {data:results})
        })
    }
})
app.get('/deletar/:id', (req, res) => {
    sql.query('delete from product where id=?',[req.params.id])
    res.render('deletar')
})
app.get('/atualizar/:id', urlencodeParser, (req, res) => {
    sql.query('select * from product where id=?',[req.params.id], (err, results, fields) => {
        res.render('atualizar',{
            id:req.params.id,
            name:results[0].name,
            date:results[0].date,
            place:results[0].place
        })
    })
})
app.post('/controllerUpdate', urlencodeParser, (req, res) => {
    sql.query('update product set name=?, date=?, place=? where id=?',[
        req.body.name,
        req.body.date,
        req.body.place,
        req.body.id
    ])
    res.render('controllerUpdate')
})
app.post('/controllerForm', urlencodeParser, (req, res) => {
    sql.query('insert into product values (?,?,?,?)', [
        req.body.id,
        req.body.name,
        req.body.date,
        req.body.place
    ])
    res.render('controllerForm')
})

//start server
app.listen(3000, function(){
    console.log(`
        Server Work!
        :3000
    `)
})