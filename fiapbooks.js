const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/fiapbooks",
{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    serverSelectionTimeoutMS : 20000
});

const UsuarioSchema = new mongoose.Schema({
    nome : {type : String},
    email : {type : String, required : true},
    senha : {type : String}
});

const ProdutoSchema = new mongoose.Schema({
    codigo : {type : String, required : true},
    descricao : {type : String},
    fornecedor : {type : String},
    data_fabricacao : {type : Date},
    qnt_estoque : {type : Number}
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);
const Produto = mongoose.model("Produto", ProdutoSchema);

app.post("/cadastrousuario", async(req, res)=>{
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;

    if(nome == null || email == null || senha == null){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const emailExiste = await Usuario.findOne({email : email})

    if(emailExiste){
        return res.status(400).json({error : "O e-mail cadastrado já existe"})
    }

    const usuario = new Usuario({
        nome : nome,
        email : email,
        senha : senha
    })

    try{
        const newUsuario = await usuario.save()
        res.json({error : null, msg : "Cadastro OK", usuarioId : newUsuario._id});
    }catch(error){
        res.status(400).json({error});
    }
});

app.post("/produtos", async(req, res)=>{
    const codigo = req.body.codigo;
    const descricao = req.body.descricao;
    const fornecedor = req.body.fornecedor;
    const data_fabricacao = req.body.data_fabricacao;
    const qnt_estoque = req.body.qnt_estoque

    if(codigo == null || descricao == null || fornecedor == null || data_fabricacao == null || qnt_estoque == null){
        return res.status(400).json({error : "Preencha todos os campos"})
    }

    const codigoExiste = await Produto.findOne({codigo : codigo})

    if(codigoExiste){
        return res.status(400).json({error : "O código cadastrado já existe"})
    }

    const produto = new Produto({
        codigo : codigo,
        descricao : descricao,
        fornecedor : fornecedor,
        data_fabricacao : data_fabricacao,
        qnt_estoque : qnt_estoque
    });

    try{
        const newProduto = await produto.save()
        res.json({error : null,  msg : "Produtos Cadastrados"})
    }catch(error){
        res.status(400).json({error});
    }
});

app.get("/cadastrousuario", async(req, res)=>{
    res.sendFile(__dirname +"/cadastrousuario.html")
});

app.get("/produtos", async(req, res)=>{
    res.sendFile(__dirname +"/produtos.html")
});

app.get("", async(req, res)=>{
    res.sendFile(__dirname +"/")
});

app.listen(port, ()=>{
    console.log(`O servido está rodando na porta ${port}`);
});