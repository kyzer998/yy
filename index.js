const discord = require("discord.js");
const client = new discord.Client()
const { token, prefix, ServerID } = require("./config.json")

client.on("ready", () => {
console.log("Je suis prêt à recevoir et envoyer des courriels :D")


client.user.setActivity("regarde ses message privé")
})

client.on("channelDelete", (channel) => {
    if(channel.parentID == channel.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {
        const person = channel.guild.members.cache.find((x) => x.id == channel.name)

        if(!person) return;

        let yembed = new discord.MessageEmbed()
        .setAuthor("MAIL DELETED", client.user.displayAvatarURL())
        .setColor('RED')
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription("Votre courrier est supprimé par un membre du staff et si vous avez un problème avec cela, vous pouvez ouvrir à nouveau le courrier en envoyant un message ici.")
    return person.send(yembed)
    
    }


})


client.on("message", async message => {
  if(message.author.bot) return;

  let args = message.content.slice(prefix.length).split(' ');
  let command = args.shift().toLowerCase();


  if(message.guild) {
      if(command == "setup") {
          if(!message.member.hasPermission("ADMINISTRATOR")) {
              return message.channel.send("Vous avez besoin des autorisations d'administrateur pour configurer le système modmail!")
          }

          if(!message.guild.me.hasPermission("ADMINISTRATOR")) {
              return message.channel.send("Le bot a besoin des autorisations d'administrateur pour configurer le système modmail!")
          }


          let role = message.guild.roles.cache.find((x) => x.name == "🌟☆Staff")
          let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

          if(!role) {
              role = await message.guild.roles.create({
                  data: {
                      name: "🌟☆Staff",
                      color: "GREEN"
                  },
                  reason: "Rôle nécessaire pour le système ModMail"
              })
          }

          await message.guild.channels.create("MODMAIL", {
              type: "category",
              topic: "Tout le courrier sera ici: D",
              permissionOverwrites: [
                  {
                      id: role.id,
                      allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }, 
                  {
                      id: everyone.id,
                      deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                  }
              ]
          })


          return message.channel.send("La configuration est terminée :D")

      } else if(command == "close") {


        if(message.channel.parentID == message.guild.channels.cache.find((x) => x.name == "MODMAIL").id) {
            
            const person = message.guild.members.cache.get(message.channel.name)

            if(!person) {
                return message.channel.send("Je ne parviens pas à fermer le canal et cette erreur survient car le nom du canal a probablement changé.")
            }

            await message.channel.delete()

            let yembed = new discord.MessageEmbed()
            .setAuthor("MAIL CLOSED", client.user.displayAvatarURL())
            .setColor("RED")
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter("Le courrier est fermé par " + message.author.username)
            if(args[0]) yembed.setDescription(args.join(" "))

            return person.send(yembed)

        }
      } else if(command == "open") {
          const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")

          if(!category) {
              return message.channel.send("Le système de modération n'est pas configuré sur ce serveur, utilisez " + prefix + "setup")
          }

          if(!message.member.roles.cache.find((x) => x.name == "🌟☆Staff")) {
              return message.channel.send("Vous avez besoin du rôle staff pour utiliser cette commande")
          }

          if(isNaN(args[0]) || !args.length) {
              return message.channel.send("Veuillez donner la ID de la personne")
          }

          const target = message.guild.members.cache.find((x) => x.id === args[0])

          if(!target) {
              return message.channel.send("Impossible de trouver cette personne.")
          }


          const channel = await message.guild.channels.create(target.id, {
              type: "text",
            parent: category.id,
            topic: "Le courrier est ouvert directement par **" + message.author.username + "** entrer en contact avec " + message.author.tag
          })

          let nembed = new discord.MessageEmbed()
          .setAuthor("DES DÉTAILS", target.user.displayAvatarURL({dynamic: true}))
          .setColor("BLUE")
          .setThumbnail(target.user.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("NOM", target.user.username)
          .addField("DATE DE CREATION DU COMPTE", target.user.createdAt)
          .addField("Contact direct", "Oui (cela signifie que ce courrier est ouvert par un membre du staff)");

          channel.send(nembed)

          let uembed = new discord.MessageEmbed()
          .setAuthor("COURRIER DIRECT OUVERT")
          .setColor("GREEN")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription("Vous avez été contacté par un membre du staff de **" + message.guild.name + "**, Veuillez attendre qu'il vous envoie un autre message!");
          
          
          target.send(uembed);

          let newEmbed = new discord.MessageEmbed()
          .setDescription("A ouvert le courrier dans: <#" + channel + ">")
          .setColor("GREEN");

          return message.channel.send(newEmbed);
      } else if(command == "help") {
          let embed = new discord.MessageEmbed()
          .setAuthor('𝐊𝐀𝐖𝐀𝐈𝐈', client.user.displayAvatarURL())
          .setColor("GREEN")
          
        .setDescription("Ce bot à était fait par Stupid❤Panda :D")
        .addField(prefix + "setup", "Configurer le système modmail", true)
  
        .addField(prefix + "open", "Vous permet d'ouvrir le courrier pour contacter toute personne avec son identifiant", true)
        .setThumbnail(client.user.displayAvatarURL())
                    .addField(prefix + "close", "Fermez le courrier dans lequel vous utilisez cette commande.", true);

                    return message.channel.send(embed)
          
      }
  } 
  
  
  
  
  
  
  
  if(message.channel.parentID) {

    const category = message.guild.channels.cache.find((x) => x.name == "MODMAIL")
    
    if(message.channel.parentID == category.id) {
        let member = message.guild.members.cache.get(message.channel.name)
    
        if(!member) return message.channel.send('Impossible d\'envoyer le message')
    
        let lembed = new discord.MessageEmbed()
        .setColor("GREEN")
        .setFooter(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription(message.content)
    
        return member.send(lembed)
    }
    
    
      }
  
  
  
  
  
  if(!message.guild) {
      const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => {})
      if(!guild) return;
      const category = guild.channels.cache.find((x) => x.name == "MODMAIL")
      if(!category) return;
      const main = guild.channels.cache.find((x) => x.name == message.author.id)


      if(!main) {
          let mx = await guild.channels.create(message.author.id, {
              type: "text",
              parent: category.id,
              topic: "This mail is created for helping  **" + message.author.tag + " **"
          })

          let sembed = new discord.MessageEmbed()
          .setAuthor("MAIN OPENED")
          .setColor("GREEN")
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription("La conversation est maintenant lancée, vous serez bientôt contacté par un membre du staff :D")

          message.author.send(sembed)


          let eembed = new discord.MessageEmbed()
          .setAuthor("DES DÉTAILS", message.author.displayAvatarURL({dynamic: true}))
          .setColor("BLUE")
          .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
          .setDescription(message.content)
          .addField("NOM", message.author.username)
          .addField("DATE DE CREATION DU COMPTE", message.author.createdAt)
          .addField("Contact direct", "Non (cela signifie que ce courrier est ouvert par une personne qui n'est pas un membre du staff")
        return mx.send(eembed)
      }

      let xembed = new discord.MessageEmbed()
      .setColor("YELLOW")
      .setFooter(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
      .setDescription(message.content)


      main.send(xembed)

  } 
  
  
  
 
})


client.login(token)