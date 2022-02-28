import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { Client } from "../entities/Client";
import { Allergy } from "../entities/Allergy";
import { isNullOrUndefined, print } from "util";

class AllergyController {
  static add = async (req: Request, res: Response) => {
    let { AllergyName, clientId } = req.body;

    const AllergyRepository = getRepository(Allergy);
    const ClientRepository = getRepository(Client);

    let client: Client;
    let allergy = new Allergy();
    var found = false;

    try {
      client = await ClientRepository.findOneOrFail({
        where: { id: clientId },
      });
    } catch (error) {
      res.status(404).send("Client not found");
      return;
    }

    try {
      const myallergies = await AllergyRepository.find({
        where: { client: clientId },
      });
      myallergies.forEach(async (element) => {
        if (element.AllergyName === AllergyName) {
          found = true;
        }
      });
    } catch (error) {
      res.status(404).send("Client Doesn't have allergies");
      return;
    }

    if (!found) {
      allergy.AllergyName = AllergyName;
      allergy.client = client;
      const errors = await validate(allergy);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      try {
        await AllergyRepository.save(allergy);
      } catch (e) {
        res.status(409).send("Allergy insert error");
        return;
      }
      //If all ok, send 201 response
      res.status(201).send("Allergy inserted.");
    } else {
      res.status(410).send("Allergy Found");
    }
  };

  static addAdmin = async (req: Request, res: Response) => {
    let { AllergyName } = req.body;

    const AllergyRepository = getRepository(Allergy);

    let allergy = new Allergy();
    var found = false;

    
    try {
      const allallergies = await AllergyRepository.find({
        where: { client: null },
      });
      allallergies.forEach(async (element) => {
        if (element.AllergyName === AllergyName) {
          found = true;
        }
      });
    } catch (error) {
      res.status(404).send("Client Doesn't have allergies");
      return;
    }

    if (!found) {
      allergy.AllergyName = AllergyName;
      const errors = await validate(allergy);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      try {
        await AllergyRepository.save(allergy);
      } catch (e) {
        res.status(409).send("Allergy insert error");
        return;
      }
      //If all ok, send 201 response
      res.status(201).send("Allergy inserted.");
    } else {
      res.status(410).send("Allergy Found");
    }
  };

  static editAdmin = async (req: Request, res: Response) => {
    let { AllergyName,NewAllergyName} = req.body;

    const AllergyRepository = getRepository(Allergy);

    
    try {
      const allallergies = await AllergyRepository.find({
        where: { AllergyName: AllergyName },
      });
      allallergies.forEach(async (element) => {
        element.AllergyName = NewAllergyName;
        await  AllergyRepository.save(element);
      });
      res.status(200).send("Allergy Updated.");
    } catch (error) {
      res.status(404).send("Client Doesn't have allergies");
      return;
    }

   
  };

  static getMyAllergies = async (req: Request, res: Response) => {
    let { clientId } = req.body;

    const AllergyRepository = getRepository(Allergy);
    const ClientRepository = getRepository(Client);
    let myallergies;
    let client: Client;
    try {
      client = await ClientRepository.findOneOrFail({
        where: { id: clientId },
      });
    } catch (error) {
      res.status(404).send("Client not found");
      return;
    }

    try {
       myallergies = await AllergyRepository.find({
        where: { client: clientId },
      });
      
    } catch (error) {
      res.status(404).send("Allergie repo error.");
      return;
    }
    if(myallergies){
      res.send(myallergies);
    }else{
      res.status(404).send("No allergies.");
    }

  };
  
  static delete = async (req: Request, res: Response) => {
    let { AllergyName, clientId } = req.body;

    const AllergyRepository = getRepository(Allergy);
    const ClientRepository = getRepository(Client);

    let client: Client;
    let allergy = new Allergy();
    var found = false;

    try {
      client = await ClientRepository.findOneOrFail({
        where: { id: clientId },
      });
    } catch (error) {
      res.status(404).send("Client not found");
      return;
    }

    try {
      const myallergies = await AllergyRepository.find({
        where: { client: clientId },
      });
      myallergies.forEach(async (element) => {
        if (element.AllergyName === AllergyName) {
          found = true;
          allergy = element;
        }
      });
    } catch (error) {
      res.status(404).send("Allergie repo error.");
      return;
    }

    if (found) {
        try {
            AllergyRepository.delete(allergy);
        } catch (e) {
          res.status(409).send("Allergy delete error");
          return;
        }
        //If all ok, send 201 response
        res.status(201).send("Allergy deleted.");
      } else {
        res.status(410).send("Allergy Not Found");
      }
    
  };

  static getAll = async (req: Request, res: Response) => {
    //Get allergies from database
    const AllergyRepository = getRepository(Allergy);
    const allergies = await AllergyRepository.find({relations: ["client"]
    });

    let adminallergies : Array<Allergy> = [];

    allergies.forEach( (element) => {

      if(element.client==null){
        adminallergies.push(element) ;
        
      }
    });
    
    //Send the allergies object
    res.send(adminallergies);
  };


}
export default AllergyController;
