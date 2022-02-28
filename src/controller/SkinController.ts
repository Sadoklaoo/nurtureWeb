import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Skin } from "../entities/Skin";
import { Client } from "../entities/Client";

class SkinController {
  static addOrEdit = async (req: Request, res: Response) => {
    let {
      SkinDescription,
      SkinType,
      Nature,
      Hydratation,
      Imperfection,
      Sensitivity,
      Eclat,
      AntiAge,
      clientId,
    } = req.body;

    const SkinRepository = getRepository(Skin);
    const ClientRepository = getRepository(Client);

    let client: Client;
    let skinFound: Skin;
    let skin = new Skin();

    try {
      client = await ClientRepository.findOneOrFail({
        where: { id: clientId },
      });
    } catch (error) {
      res.status(404).send("Client not found");
      return;
    }

    try {
      skinFound = await SkinRepository.findOne({
        where: { Client: clientId },
      });

      if (skinFound) {
        console.log("Skin Found");
        skin = skinFound;
        skin.SkinDescription = SkinDescription;
        skin.SkinType = SkinType;
        skin.Nature = Nature;
        skin.Hydratation = Hydratation;
        skin.Imperfection = Imperfection;
        skin.Sensitivity = Sensitivity;
        skin.Eclat = Eclat;
        skin.AntiAge = AntiAge;
        skin.Client = client;
      } else {
        console.log("Skin Not found");
        skin.SkinDescription = SkinDescription;
        skin.SkinType = SkinType;
        skin.Nature = Nature;
        skin.Hydratation = Hydratation;
        skin.Imperfection = Imperfection;
        skin.Sensitivity = Sensitivity;
        skin.Eclat = Eclat;
        skin.AntiAge = AntiAge;
        skin.Client = client;
      }
    } catch (error) {
      res.status(404).send("A problem has been occured in skin repo");
    }

    const errors = await validate(skin);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    try {
      await SkinRepository.save(skin);
    } catch (e) {
      res.status(409).send("Skin insert error");
      return;
    }
    //If all ok, send 201 response
    res.status(201).send("Skin inserted.");
  };
  static get = async (req: Request, res: Response) => {
    let { clientId } = req.body;
    const SkinRepository = getRepository(Skin);
    let skin: Skin;
    try {
      skin = await SkinRepository.findOneOrFail({
        where: { Client: clientId },
      });
    } catch (error) {
      res.status(404).send("Skin not found.");
      return;
    }
    res.status(200).send(skin);
  };
  static delete = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    const SkinRepository = getRepository(Skin);
    let skin: Skin;
    try {
      skin = await SkinRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("Skin not found.");
      return;
    }
    SkinRepository.delete(id);
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static getAll = async (req: Request, res: Response) => {
    //Get Skins from database
    const SkinRepository = getRepository(Skin);
    const skins = await SkinRepository.find({});

    //Send the users object
    res.send(skins);
  };
  static getmyAll = async (req: Request, res: Response) => {
    let { clientId } = req.body;
    //Get Skins from database
    const SkinRepository = getRepository(Skin);
    const skins = await SkinRepository.find({
      where: { Client: clientId },
    });

    //Send the users object
    res.send(skins);
  };
}
export default SkinController;
