import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { User } from "../entities/User";
import { Client } from "../entities/Client";
import { Contact } from "../entities/Contact";

class UserController {
  static listAll = async (req: Request, res: Response) => {
    //Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["id", "email", "firstName", "lastName", "phoneNumber", "sexe"], //We dont want to send the passwords on response
    });

    //Send the users object
    res.send(users);
  };

  /* static getOneById = async (req: Request, res: Response) => {
  //Get the ID from the url
  const id =  req.params.id;

  //Get the user from database
  const userRepository = getRepository(user);
  try {
    const user = await userRepository.findOneOrFail(id, {
      select: ["id", "username", "role"] //We dont want to send the password on response
    });
  } catch (error) {
    res.status(404).send("User not found");
  }
}; 
 */
  static edituser = async (req: Request, res: Response) => {
    //Get values from the body
    const { id, firstName, lastName, phoneNumber, email, address } = req.body;

    //Try to find user on database
    const userRepository = getRepository(Client);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("user not found");
      return;
    }

    //Validate the new values on model
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.address = address;
    user.phoneNumber = phoneNumber;

    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Try to safe, if fails, that means phoneNumber already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("phoneNumber already in use");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static getOneByEmail = async (req: Request, res: Response) => {
    //Get the phoneNumber from request body
    let { email } = req.body;
    //Get the user from database
    const userRepository = getRepository(Client);
    try {
      // const user = await  userRepository.findOneOrFail({ phoneNumber });
      const user = await userRepository.findOneOrFail(email, {
        select: ["id", "email", "firstName", "lastName", "phoneNumber", "sexe"], //We dont want to send the password on response
      });
      res.send(user);
    } catch (error) {
      res.status(404).send("user not found");
    }
  };

  static getOneById = async (req: Request, res: Response) => {
    //Get the phoneNumber from request body
    const id = req.params.id;
    //Get the user from database
    const userRepository = getRepository(Client);
    try {
      // const user = await  userRepository.findOneOrFail({ phoneNumber });
      const user = await userRepository.findOneOrFail(id, {
        select: ["id", "email", "firstName", "lastName", "phoneNumber", "sexe"], //We dont want to send the password on response
      });
      res.send(user);
    } catch (error) {
      res.status(404).send("user not found");
    }
  };

  static deleteuser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    const userRepository = getRepository(Client);
    let user: Client;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("user not found");
      return;
    }
    userRepository.delete(id);
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static me = async (req: Request, res: Response) => {
    //Get the phoneNumber from request body
    const token = <string>req.headers["auth"];
    let jwtPayload;
    try {
      jwtPayload = <any>jwt.verify(token, config.jwtSecret);
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      //If token is not valid, respond with 401 (unauthorized)
      res.status(401).send();
      return;
    }

    const { userId } = jwtPayload;
    //Get the user from database
    const userRepository = getRepository(Client);
    try {
      const user = await userRepository.findOneOrFail({
        where: { id: userId },
      });
      res.send(user);
    } catch (error) {
      res.status(404).send("user not found");
    }
  };



  static clientContact = async (req: Request, res: Response) => {
    //Get the storeID,Message from request body
    let { ClientId, Message } = req.body;
    console.log(ClientId, Message);
    //Get the repostories
    const clientRepository = getRepository(Client);
    const contactRepository = getRepository(Contact);

    let client;
    let contactt = new Contact();
    try {
      client = await clientRepository.findOneOrFail({ where: { id: ClientId } })
      contactt.Client = client.id;
      contactt.message = Message;
      contactt = await contactRepository.save(contactt);
      console.log(client)
      res.status(200).send("Success message sent")
    } catch (error) {


      res.status(400).send("Failed message send ");

    }
  };

  static updateClientTokenApp = async (req: Request, res: Response) => {
    //Get values from the body
    const { email, apptoken } = req.body;
    console.log(email, apptoken)
    //Try to find client on database
    const clientRepository = getRepository(Client);
    let client: Client;
    try {
      client = await clientRepository.findOneOrFail({ where: { email: email } });
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("Client(email) not found");
      console.log(error)
      return;
    }
    client.notificationToken = apptoken;
    //Try to safe, if fails, that means phoneNumber already in use
    try {
      await clientRepository.save(client);
    } catch (e) {
      res.status(403).send("A problem has been Occured");
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static editClient = async (req: Request, res: Response) => {
    //Get values from the body
    const { firstName, lastName, phoneNumber, email, address, postalCode, birthDate, city, password, image } = req.body;

    //Try to find client on database
    const clientRepository = getRepository(Client);
    let client: Client;
    try {
      client = await clientRepository.findOneOrFail({ where: { phoneNumber: phoneNumber } });
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("Client(Phone Number) not found");
      console.log(error)
      return;
    }

    //client.phoneNumber=phoneNumber
    client.firstName = firstName;
    client.lastName = lastName;
    client.email = email;

    // if Register   cad  password  exist
    // else continue cad profile edit
    if (password != null) {
      client.password = password;
      client.hashPassword();
    }

    client.birthDate = new Date(birthDate);

    // ! Only for adminstrator
    //client.phoneNumber=newPhoneNumber;
    //Validate the new values on model
    const errors = await validate(client);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Try to safe, if fails, that means phoneNumber already in use
    try {
      await clientRepository.save(client);
    } catch (e) {
      res.status(400).send("A problem has been Occured");
      console.log(e);
      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

}
export default UserController;
