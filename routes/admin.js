const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
//Pega o model dentro da pasta
require("../models/Categoria");
//cria uma referencia do model para a variável
const Categoria = mongoose.model("categorias");

require("../models/Postagem");
const Postagem = mongoose.model("postagens");

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("Página de posts");
});

//Lista as categorias
router.get("/categorias", (req, res) => {
  Categoria.find()
    .sort({ date: "desc" })
    .lean()
    .then((categorias) => {
      res.render("admin/categorias", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro ao listar as categorias");
      res.redirect("/admin");
    });
});

//adiciona categoria
router.get("/categorias/add", (req, res) => {
  res.render("admin/addcategoria");
});

//rota de nova categoria com autenticação
router.post("/categorias/nova", (req, res) => {
  let erros = [];
  //se o nome for vazio
  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome inválido" });
  }
  //se o slug for vazio
  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "Slug inválido" });
  }
  //se o array tiver algum dado renderiza erros na página add categoria
  if (erros.length > 0) {
    res.render("admin/addcategoria", { erros: erros });
  } else {
    const novaCategotia = {
      nome: req.body.nome,
      slug: req.body.slug,
    };
    new Categoria(novaCategotia)
      .save()
      .then(() => {
        req.flash("success_msg", "Categoria criada com sucesso!");
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash("error_msg", "Erro ao criar categoria!");
        res.redirect("/admin");
      });
  }
});

//deletar
router.get("/categorias/deletar/:id", (req, res) => {
  Categoria.findByIdAndDelete(req.params.id)
    .then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso!");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "Erro ao deletar categoria!");
      res.redirect("/admin/categorias");
    });
});

//editar
router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({ _id: req.params.id })
    .then((categoria) => {
      res.render("admin/editcategorias", { categoria: categoria });
    })
    .catch((err) => {
      req.flash("error_msg", "Essa categoria não existe!");
      res.redirect("/admin/categorias");
    });
});
//editados
router.post("/categorias/edit", (req, res) => {
  Categoria.findOne({ _id: req.body.id })
    .then((categoria) => {
      categoria.nome = req.body.nome;
      categoria.slug = req.body.slug;

      categoria
        .save()
        .then(() => {
          req.flash("success_msg", " Categoria editada com sucesso!");
          res.redirect("/admin/categorias");
        })
        .catch((err) => {
          req.flash("error_msg", "Erro ao editar categoria!");
          res.redirect("/admin/categorias");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao editar a categoria");
      res.redirect("/admin/categorias");
    });
});

//Lista as postagens
router.get("/postagens", (req, res) => {
  Postagem.find()
    .populate("categoria")
    .sort({ data: "desc" })
    .then((postagens) => {
      res.render("admin/postagens", { postagens: postagens });
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro ao listar postagens!");
      res.redirect("/admin");
    });
});

//adiciona postagens
router.get("/postagens/add", (req, res) => {
  //envia todas as categorias criadas para a página postagens
  Categoria.find()
    .then((categorias) => {
      res.render("admin/addpostagem", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", 'Houve um erro ao carregar o formulário"');
      res.redirect("/admin");
    });
});

//postagens cadastradas
router.post("/postagens/nova", (req, res) => {
  let erros = [];
  if (!req.body.categoria) {
    erros.push({ texto: "Categoria inválida, registre uma categoria" });
  } else if (
    req.body.titulo == 0 ||
    req.body.slug == 0 ||
    req.body.descricao == 0 ||
    req.body.conteudo == 0
  ) {
    erros.push({ texto: "Todos os campos devem ser preenchidos!" });
  }

  if (erros.length > 0) {
    res.render("admin/addpostagem", { erros: erros });
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug,
    };
    new Postagem(novaPostagem)
      .save()
      .then(() => {
        req.flash("success_msg", "postagem criada com sucesso!");
        res.redirect("/admin/postagens");
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar postagem!");
        res.redirect("/admin/postagens");
      });
  }
});

//deletar postagens
router.get("/postagens/deletar/:id", (req, res) => {
  Postagem.findByIdAndDelete(req.params.id)
    .then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso!");
      res.redirect("/admin/postagens");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar postagem");
      res.redirect("/admin/postagens");
    });
});

//editar postagens
router.get('/postagens/edit/:id',(req,res)=>{
    Postagem.findOne({_id: req.params.id}).then((postagens)=>{
        res.render('admin/editpostagens',{ postagens: postagens})
    }).catch((err) => {
      req.flash("error_msg", "Essa categoria não existe!");
      res.redirect("/admin/postagens");
    })
})

//postagens editadas
router.get('/postagens/edit',(req,res)=>{
    Postagem.findOne({_id: req.body.id }).then((postagens)=>{
       postagens.titulo = req.body.titulo,
        postagens.descricao = req.body.descricao,
        postagens.conteudo = req.body.conteudo,
        postagens.categoria = req.body.categoria,
        postagens.slug = req.body.slug,

        postagens.save().then(()=>{
            req.flash('success_msg', 'Postagem editada com sucesso!')
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao editar postagem!')
        })

    }).catch((err)=>{
     req.flash("error_msg", "Houve um erro ao editar a postagens");
      res.redirect("/admin/postagens");
    })
})



/* * */
module.exports = router;


