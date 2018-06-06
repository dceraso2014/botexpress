// This loads the environment variables from the .env file
require('dotenv-extended').load();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

// Web app
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
const builder = require('botbuilder');

// Register Bot
//var bot = require('./bot');
  


// Start listening
var port = process.env.port || process.env.PORT || 3978;
app.listen(port, function () {
  console.log('Web Server listening on port %s', port);
});

const connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
  //openIdMetadata: process.env.BotOpenIdMetadata
}); 

const bot = new builder.UniversalBot(connector);
app.post('/api/messages', connector.listen());




let datos_usuario = {nombre:'', sip:''};

bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Hola soy Arcorito")
            .text("Tu asistente virtual.")
            .images([
                 builder.CardImage.create(session, "http://imagizer.imageshack.us/a/img923/2918/22q2kH.png")
            ]);
        //var msg = new builder.Message(session).attachments([card]);
        //session.send(msg);

       // console.log(session.message.user.name);
       // console.log(session.message.user.id);
       // console.log(session.userData);
       var siplargo = session.message.user.id;
       var sipcorto = siplargo.slice(4); 

       datos_usuario.nombre = session.message.user.name;
       datos_usuario.sip = sipcorto;
       
       session.send("Hola Soy Arcorito, tu asistente virtual.")
        session.send("En que te puedo ayudar hoy %s .", session.message.user.name);
        session.send(JSON.stringify(session.message));
        //session.send("Tu correo electronico es: %s ." , sipcorto);
        //session.send("Hi... I'm the Microsoft Bot Framework demo bot for Skype. I can show you everything you can use our Bot Builder SDK to do on Skype.");
        session.beginDialog('/menu');
    },
    function (session, results) {
        // Display menu
        session.beginDialog('/menu');
    }
]);

bot.dialog('/menu', [
    function (session) {
        //builder.Prompts.choice(session, "What demo would you like to run?", "prompts|picture|cards|list|carousel|receipt|actions|(quit)");
        builder.Prompts.choice(session, "Con que te puedo ayudar hoy?", "Problemas con Office?|Problemas con el Correo?|Problemas de impresión?|Su computadora no sirve?|(Salir)", { listStyle: 4 });
    },
    function (session, results) {
        if (results.response && results.response.entity != '(Salir)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endConversation("Ok.. Nos vemos más tarde!");
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
       // session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });


bot.dialog('/Problemas con Office?', [
    function (session, results) {
        //builder.Prompts.choice(session, "What demo would you like to run?", "prompts|picture|cards|list|carousel|receipt|actions|(quit)" );
         builder.Prompts.choice(session, "Indicame con que tenes problemas", "Microsoft Excel?|Microsoft Word?|Microsoft Power Point?|(Salir)", { listStyle: 4 } );
        
    },
  
    function (session, results) {
        session.beginDialog('/' + results.response.entity);
    }
    
    
]);