const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// mongoose
//   // .connect(`mongodb://${process.env.DB_URL}`)
//   //   .connect(`mongodb://localhost:27017/myecommerce`)
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(console.log("Connected to db"))
//   .catch((error) => console.error("MongoDb " + error));

// let db = mongoose.connection;

// My try
const cookieParser = require("cookie-parser");

const app = express();

// My try
app.use(cookieParser());

app.use("/static", express.static("static"));
app.set("trust proxy", 1);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5000",
      "https://myecommerce-seven.vercel.app",
      "https://shopkart-v2.vercel.app",
    ],
    methods: ["GET", "HEAD", "POST"],
    credentials: true,
  })
);
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "thisisasecretkey",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    name: "MyEcommerceApp",
    cookie: {
      secure: true,
      maxAge: 3600000, // Session duration in milliseconds (1 hour in this example)
      sameSite: "none",
    },
  })
);

app.get("/", (req, res) => {
  // console.log(req.session);
  res.send("Hello");
});

app.get("/test", (req, res) => {
  console.log(req.session);
  res.send(req.session);
});

app.post("/signup", (req, res) => {
  let mail = req.body.email;

  //   Account.find({ email: mail }, (err, docs) => {
  //     if (docs.length > 0) {
  //       //   res.render("signup.pug", { message: "Email already registered" });
  //       res.send("Email already registered");
  //     } else {
  req.session.username = req.body.name;
  req.session.email = mail;
  //   console.log(req.session.email);
  console.log(req.body);
  //   console.log(req);
  req.session.loggedIn = true;
  if (req.body.admin) {
    req.session.isAdmin = true;
    req.body.isAdmin = true;
  } else {
    req.session.isAdmin = false;
    req.body.isAdmin = false;
  }
  // console.log(req.body);
  console.log(req.session);
  res.send(req.session);

  //   var userData = new Account(req.body);
  //   userData
  //     .save()
  //     .then(() => {
  //       res.status(200).render("index", { session: req.session });
  //     })
  //     .catch(() => {
  //       res.status(400).send("Item was not saved to the database");
  //     });
  //     }
  //   });
});

// app.post("/login", (req, res) => {
//   var email = req.body.email;
//   var password = req.body.password;

//   let view;
//   async function findAcc(email, password) {
//     view = await db
//       .collection("accounts")
//       .find({ $and: [{ email: `${email}` }, { password: `${password}` }] })
//       .toArray();
//     if (view.length > 0) {
//       req.session.username = view[0].name;
//       req.session.email = email;
//       req.session.loggedIn = true;
//       if (view[0].isAdmin == true) {
//         req.session.isAdmin = true;
//       }
//       //   res.status(200).render("index", { session: req.session });
//       res.send("valid Credentials!", { session: req.session });
//     } else res.send("Invalid Credentials!");
//   }
//   findAcc(email, password);
// });

app.get("/logout", (req, res) => {
  req.session.username = "";
  req.session.email = "";
  req.session.loggedIn = false;
  req.session.isAdmin = false;
  res.status(200).redirect("index");
});

// My try
app.get("/verify-cookie", (req, res) => {
  const myCookie = req.cookies.myCookieName; // Replace with your cookie name

  if (myCookie) {
    // The cookie exists, you can verify its value or perform actions based on it
    res.send(`Cookie value: ${myCookie}`);
  } else {
    // The cookie doesn't exist or has an empty value
    res.send("Cookie not found");
  }
});
//

app.get("/MainPage", async (req, res) => {
  try {
    await mongoose
      // .connect(`mongodb://${process.env.DB_URL}`)
      //   .connect(`mongodb://localhost:27017/myecommerce`)
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(console.log("Connected to db"))
      .catch((error) => console.error("MongoDb " + error));

    let db = mongoose.connection;

    const data = await db.collection("availableproducts").find().toArray();
    // console.log(data);
    // return NextResponse.json(data);
    // res.send(JSON.parse(data));
    // res.end(JSON.stringify(data));
    res.send(data);
    // res.send("Ok");
  } catch (error) {
    console.log(error);
    // return NextResponse.json({
    //   error: "Internal server error for get",
    //   message: error,
    // });
  }
});

const port = 5001;
app.listen(port, () => {
  console.log("listening on port " + port);
});
