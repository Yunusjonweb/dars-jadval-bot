const TelegramBot = require("node-telegram-bot-api");
const model = require("./model");
const mongo = require("./mongoose");

const TOKEN = "6657335177:AAEkAO8O2qWgkm1vcU5XTOelHsOOQfcGvwI";

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

// bot.on("message", async (message) => {
//   try {
//     if (message.text === "📝 Dushanba Dars Jadval") {
//       await bot.sendMessage(
//         message.from.id,
//         "📝 Dushanba Dars Jadval\n\n1.Jaxon tarix:🧑‍🏫Javohir ustoz\n2.Ona tili:Ozoda ustoz\n3.Ingliz tili:G'ulom ustoz\n4.Fizika:Jahongir ustoz\n5.Rus tili:Marhamat ustoz"
//       );
//       return;
//     } else if (message.text === "📝 Seshanba Dars Jadval") {
//       await bot.sendMessage(
//         message.from.id,
//         "📝 Seshanba Dars Jadval\n\n1.Jaxon tarix:🧑‍🏫Javohir ustoz\n2.Ona tili:Ozoda ustoz\n3.Ingliz tili:G'ulom ustoz\n4.Fizika:Jahongir ustoz\n5.Rus tili:Marhamat ustoz"
//       );
//       return;
//     } else if (message.text === "📝 Chorshanba Dars Jadval") {
//       await bot.sendMessage(
//         message.from.id,
//         "📝 Chorshanba Dars Jadval\n\n1.Jaxon tarix:🧑‍🏫Javohir ustoz\n2.Ona tili:Ozoda ustoz\n3.Ingliz tili:G'ulom ustoz\n4.Fizika:Jahongir ustoz\n5.Rus tili:Marhamat ustoz"
//       );
//       return;
//     }
//     let keyboard = {
//       keyboard: [
//         [
//           {
//             text: "📝 Dushanba Dars Jadval",
//           },
//           {
//             text: "📝 Seshanba Dars Jadval",
//           },
//         ],
//         [
//           {
//             text: "📝 Chorshanba Dars Jadval",
//           },
//         ],
//       ],
//       resize_keyboard: true,
//     };

//     // let keyboard = {
//     //   inline_keyboard: [
//     //     [
//     //       {
//     //         text: "Batafsil malumot",
//     //         callback_data: "batafsil_malumot",
//     //       },
//     //       {
//     //         text: "Batafsil malumot",
//     //         callback_data: "batafsil_malumot",
//     //       },
//     //     ],
//     //     [
//     //       {
//     //         text: "Batafsil malumot",
//     //         callback_data: "batafsil_malumot",
//     //       },
//     //       {
//     //         text: "Batafsil malumot",
//     //         callback_data: "batafsil_malumot",
//     //       },
//     //     ],
//     //   ],
//     // };

//     await bot.sendMessage(
//       message.from.id,
//       `👋 Assalomu alaykum, ${message.from.first_name} yaxshimisiz!\n\nQuyidagi tugmalar orqali dars jadvali haqida ma'lumot olishingiz mumkin.\n\n 🤖 @darstjadvalbot`,
//       {
//         reply_markup: keyboard,
//       }
//     );
//   } catch (e) {
//     await bot.sendMessage(message.from.id, e + "");
//   }
// });

mongo();

bot.on("message", async (message) => {
  try {
    const userId = message.from.id;

    let user = await model.findOne({
      user_id: userId,
    });

    if (!user) {
      user = await model.create({ user_id: userId, step: "name" });
      await bot.sendMessage(userId, "Ismingizni kiriting");
    } else {
      if (user.step === "name") {
        await model.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: "phone_number",
            name: message.text,
          }
        );
        await bot.sendMessage(
          userId,
          message.text + ", telefon raqamingizni qoldiring",
          {
            reply_markup: {
              keyboard: [
                [
                  {
                    text: "Kontakt Yuborish",
                    request_contact: true,
                  },
                ],
              ],
              resize_keyboard: true,
            },
          }
        );
      } else if (user.step === "phone_number" && message.contact) {
        await model.findOneAndUpdate(
          {
            user_id: userId,
          },
          {
            step: "full",
            phone_number: message.contact.phone_number,
          }
        );
        await bot.sendMessage(userId, "Ro'yxatdan o'tdingiz!!!");
      } else if (user.step === "full") {
        await bot.sendMessage(userId, "Yunusbek Xabibullayev");
      }
    }
  } catch (e) {
    console.log(e);
  }
});
