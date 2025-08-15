// Exporta um objeto com a função eAdmin como middleware
module.exports = {
    // Função middleware para verificar se o usuário é admin
    eAdmin: function(req, res, next) {
        // Verifica se o usuário está autenticado e se possui a propriedade eAdmin igual a 1
        if (req.isAuthenticated() && req.user.eAdmin == 1) {
            // Se for admin, permite que a requisição continue para a próxima função/middleware
            return next()
        }
        // Se não for admin, exibe uma mensagem de erro usando flash
        req.flash('error_msg', 'Você Precisa ser um admin!')
        // Redireciona o usuário para a página inicial
        res.redirect('/')
    }
}