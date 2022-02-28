import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import config from "../config/config";
import { validate } from "class-validator";
import { json } from "body-parser";
import { Admin } from "../entities/Admin";
import { Client } from "../entities/Client";
import { User } from "../entities/User";
const clientTwilio = require("twilio")(config.accountSid, config.authToken);
var randomize = require("randomatic");

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    // Type account to determinate if its : CLIENT OR ADMIN OR MANAGER
    let { email, password, typeAccount } = req.body;

    let token;

    console.log(req.body);

    console.log("email   : "+email+" Password : " + password+ " Type Account " +typeAccount);
    if (!(email && password && typeAccount)) {
      res.status(400).send();
    }

    let user;
    if (typeAccount == "ADMIN") {
      //Get user from database
      const adminRepository = getRepository(Admin);
      try {
        user = await adminRepository.findOneOrFail({ where: { email } });
        token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            userName: user.firstName,
            role: user.role,
          },
          config.jwtSecret,
          { expiresIn: "1000h" }
        );
      } catch (error) {
        res.status(401).send();
        console.log("Wrong email");
        return;
      }
    } else if (typeAccount == "CLIENT") {
      //Get user from database
      const clientRepository = getRepository(Client);
      try {
        user = await clientRepository.findOneOrFail({ where: { email } });
        token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            userName: user.firstName,
            role: user.role,
          },
          config.jwtSecret,
          { expiresIn: "1000h" }
        );
      } catch (error) {
        res.status(402).send();
        console.log("Wrong email");
        return;
      }
    }
    if (!user) {
      res.status(401).send();
    }
    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      console.log("Wrong password");
      res.status(403).send("Wrong password");
      return;
    }
    //Sing JWT, valid for 1 hour

    let jsonResponse: any = { token: token, expiresIn: "1000h" };
    //Send the jwt in the response
    console.log(jsonResponse);

    res.status(200).json(jsonResponse);
  };

  /**
   * Compares two Date objects and returns e number value that represents
   * the result:
   * 0 if the two dates are equal.
   * 1 if the first date is greater than second.
   * -1 if the first date is less than second.
   * @param date1 First date object to compare.
   * @param date2 Second date object to compare.
   */
  public static compareDate(date1: Date, date2: Date): number {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    let d1 = new Date(date1);
    let d2 = new Date(date2);

    // Check if the dates are equal
    let same = d1.getTime() === d2.getTime();
    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;

    // Check if the first is less than second
    if (d1 < d2) return -1;
  }

  static loginWeb = async (req: Request, res: Response) => {
    //Check if username and password are set
    // Type account to determinate if its : CLIENT OR ADMIN OR MANAGER
    let { email, password } = req.body;
    let token;
    console.log(req.body);
    //console.log("Phone Number  : "+email+" Password : " + password+ " Type Account " +typeAccount);
    if (!(email && password)) {
      res.status(400).send();
    }
    let user;
    //////if (typeAccount=="ADMIN")
    //Get user from database
    const adminRepository = getRepository(Admin);

    user = await adminRepository.findOne({ where: { email } });

    if (user) {
      try {
        token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            userName: user.firstName,
            role: user.role,
          },
          config.jwtSecret,
          { expiresIn: "1000h" }
        );
      } catch (error) {
        res.status(401).send();
        console.log("Wrong email");
        return;
      }
    }

    if (!user) {
      res.status(401).send();
    }
    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      console.log("Wrong password");
      res.status(403).send("Wrong password");
      return;
    }
    //Sing JWT, valid for 1 hour

    let jsonResponse: any = { token: token, role: user.role };
    //Send the jwt in the response
    console.log(jsonResponse);

    res.status(200).json(jsonResponse);
  };

  static sendRequestCode = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { phoneNumber,email } = req.body;
    let client: Client;
    var number=parseInt(phoneNumber);
    const clientRepository = getRepository(Client);
    client = await clientRepository.findOne({
      where: { email: email, verified: false },
    });

    if (client) {
      console.log("Exist");
      let requestcode = randomize("0", 4);
      client.requestCode = requestcode;
      client.phoneNumber = number;
      var minutesToAdd=60;
      var currentDate = new Date();
      var futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);
      client.requestCodeEndDate = futureDate;
      try {
        await clientRepository.save(client);
      /*  clientTwilio.messages
          .create({
            body: "Open Nurture Cosmetic App and use your code " + requestcode,
            from: "+13344871567",
            to: "+216" + phoneNumber,
          })
          .then((message) => console.log(message.sid));*/
      } catch (e) {
        res.status(400).send("a problem has been occured in saving client");
        return;
      }
      res.status(201).send("New request code is sent");
      return;
    } else {
      
      res.status(404).send("Client not found.");
      console.log("Client not found");
    
    }
  };

  static resendRequestCode = async (req: Request, res: Response) => {
    //Get parameters from the body
    let { email } = req.body;
    let client: Client;
    const clientRepository = getRepository(Client);
    client = await clientRepository.findOne({
      where: { email: email, verified: false },
    });

    if (client) {
      console.log("Exist");
      let requestcode = randomize("0", 4);
      client.requestCode = requestcode;
      var minutesToAdd=60;
      var currentDate = new Date();
      var futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);
      client.requestCodeEndDate = futureDate;
      try {
        await clientRepository.save(client);
      /*  clientTwilio.messages
          .create({
            body: "Open Nurture Cosmetic App and use your code " + requestcode,
            from: "+13344871567",
            to: "+216" + client.phoneNumber,
          })
          .then((message) => console.log(message.sid));*/
      } catch (e) {
        res.status(400).send("a problem has been occured in saving client");
        return;
      }
      res.status(201).send("New request code is sent");
      return;
    } else {
      
      res.status(404).send("Client not found.");
      console.log("Client not found");
    
    }
  };

  static newAccount = async (req: Request, res: Response) => {
    //Get parameters from the body
    // just send date in english format  (YYYY/MM/dd)
    let { firstName, lastName,email, password, birthDate,sexe  } = req.body;
    
    const clientRepository = getRepository(Client);
    

    console.log(firstName, lastName, password, email,birthDate,sexe)
      let client = new Client();
      client.firstName = firstName;
      client.lastName = lastName;
      client.email = email;
      client.birthDate = birthDate;
      client.password = password;
      client.sexe = sexe;
      client.role = "CLIENT";

      //Validade if the parameters are ok
    const errors = await validate(client);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the password, to securely store on DB
    client.hashPassword();
    //Try to save. If fails, the email is already in use
    try {
      await clientRepository.save(client);
    } catch (e) {
      res.status(409).send("Email already in use");
      return;
    }
    //If all ok, send 201 response
    res.sendStatus(201);
     
    
  };

  

  //! VerifyCode Function
  static checkRequestCode = async (req: Request, res: Response) => {
    //Get values from the body
    const { email, requestCode } = req.body;
    let client: Client;
    //Try to find client on database
    const clientRepository = getRepository(Client);

    try {
      client = await clientRepository.findOneOrFail({
        where: { email: email, verified: false },
      });
    } catch (error) {
      res.status(400).send("Please verify your email");
      return;
    }
    if (client.requestCode == requestCode && AuthController.compareDate(new Date(),client.requestCodeEndDate)!=1) {
      client.requestCode = null;
      client.verified = true;
      clientRepository.save(client);
      console.log(client);
      res.status(200).send("Code verified");
      return;
    } else if (client.requestCode != requestCode) {
      res.status(403).send("Please verify Code.");
    }else {
      res.status(405).send("Request Code Expired.");
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;
    let user: User;
    //Get parameters from the body
    const { oldPassword, newPassword, typeAccount } = req.body;
    console.log(req);
    if (!(oldPassword && newPassword)) {
      res.status(403).send();
    }

    if (typeAccount == "ADMIN") {
      //Get user from database
      const adminRepository = getRepository(Admin);
      try {
        user = await adminRepository.findOneOrFail({ where: { id } });
        //!HERE
        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
          res.status(401).send("Old password doesnt match");
          return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
        //Hash the new password and save
        user.hashPassword();
        adminRepository.save(user);
        res.status(200).send("Password updated");
        //!END HERE
      } catch (error) {
        res
          .status(401)
          .send("Problem occured with Token , please retry later or reconnect");
        return;
      }
    } else if (typeAccount == "CLIENT") {
      //Get user from database
      const clientRepository = getRepository(Client);
      try {
        user = await clientRepository.findOneOrFail({ where: { id } });
        //!HERE
        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
          res.status(401).send("Old password doesnt match");
          return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
        //Hash the new password and save
        user.hashPassword();
        clientRepository.save(user);
        res.status(200).send("Password updated");
        //!END HERE
      } catch (error) {
        res
          .status(401)
          .send("Problem occured with Token , please retry later or reconnect");
        return;
      }
    }
  };
}
export default AuthController;
