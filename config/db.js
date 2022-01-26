if(process.env.NODE_ENV == 'production') {
    module.exports = {mongoURI: "mongodb+srv://usuarioteste:123456ABC@cluster0.fu1c4.mongodb.net/blogapp?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}