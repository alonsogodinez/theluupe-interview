const { Router } = require("express");
const { addAsync } = require("@awaitjs/express");
const { compare } = require("bcrypt");
const { generateToken, generateHashPassword } = require("../utils");
const  prisma = require("../lib/prisma");

const router = addAsync(Router());


router.postAsync("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`
    });
  }
  const isPasswordMatch = await compare(password, user.password);
  if (!isPasswordMatch) {
    res.status(401).send({
      success: false,
      message: "Incorrect credentials"
    });
    return;
  }

  res.cookie("jwt", generateToken(user.id, user.firstName), {
    httpOnly: true
    //secure: true,
    //domain: 'luupe.com',
  });

  res.send({
    success: true
  });
});

router.postAsync("/signup", async (req, res) => {
  const { email, password, ...rest } = req.body;
  const doesUserExist = (await prisma.user.findMany({
    where: {
      email
    }
  })).length > 0;
  if (doesUserExist) {
    res.status(400).send({
      success: false,
      message: "Email already associated with another user"
    });
  }
  const hashPassword = await generateHashPassword(password);

  const user = await prisma.user.create({
    data: {
      password: hashPassword,
      email,
      ...rest
    }
  });

  const token = generateToken(user.id, rest.firstName);

  res.cookie("jwt", generateToken(user.id, rest.firstName), {
    httpOnly: true
  });
  res.send({
    token
  });

});

router.postAsync("/logout", async (req, res) => {
  res.clearCookie("jwt");
  res.send({
    success: true
  });
});

module.exports = {
  authRouter: router
};