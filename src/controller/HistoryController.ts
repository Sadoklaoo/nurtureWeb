import { Request, Response } from "express";
import { getRepository, Raw } from "typeorm";
import { validate } from "class-validator";
import { Admin } from "../entities/Admin";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { History } from "../entities/History";
import { Product } from "../entities/Product";
import { Client } from "../entities/Client";
import { Console } from "console";

class HistoryController {
  static add = async (req: Request, res: Response) => {
    let { SearchString, ProductId, clientId } = req.body;

    const ProductRepository = getRepository(Product);
    const ClientRepository = getRepository(Client);
    const HistoryRepository = getRepository(History);
    let exist = false;
    let client: Client;
    let product: Product;
    let history: History;
    let newHistory = new History();
    var minutes = 5;
    var currentDate = new Date();
    var previousDate = new Date(currentDate.getTime() - minutes * 60000);
    console.log(currentDate);
    console.log(previousDate);
    //Client Search
    try {
      client = await ClientRepository.findOneOrFail(clientId);
    } catch (error) {
      res.status(404).send("Client not found.");
      return;
    }

    // Product Search
    try {
      product = await ProductRepository.findOneOrFail(ProductId);
      //  history = product;
    } catch (error) {
      res.status(404).send("Product not found.");
      return;
    }
    // History Search

    try {
      console.log(previousDate.toISOString().slice(0, 19).replace("T", " "));
      history = await HistoryRepository.findOne({
        where: {
          SearchString: SearchString,
          Client: clientId,
          //  consultedAt: Raw(alias =>`${alias} >= :date `, { date: previousDate.toISOString().slice(0, 19).replace('T', ' ')}),
          consultedAt: Raw(
            (alias) => `TIMESTAMPDIFF(MINUTE,${alias} , NOW())<5`
          ),
        },
        relations: ["ConsultedProducts"],
      });

      if (history) {
        exist = true;
        // res.status(200).send(history);
        console.log("History Found");
      } else {
        console.log("History Not Found");
      }
    } catch (error) {
      res.status(403).send(error);
      return;
    }

    if (!exist) {
      newHistory.SearchString = SearchString;
      newHistory.Client = client;
      newHistory.ConsultedProducts = [product];

      try {
        await HistoryRepository.save(newHistory);
      } catch (error) {
        res.status(520).send("Insertion error.");
        return;
      }

      res.status(201).send("New History inserted.");
    } else {
      try {
        console.log("TEST");
        console.log(history.ConsultedProducts.length);
        history.ConsultedProducts.push(product);
      } catch (error) {
        res.status(404).send(error);
        return;
      }

      try {
        await HistoryRepository.save(history);
      } catch (error) {
        res.status(520).send("Insertion error.");
        return;
      }

      res.status(201).send("History Product inserted.");
    }
  };

  static getAll = async (req: Request, res: Response) => {
    let { clientId } = req.body;

    const ClientRepository = getRepository(Client);
    const HistoryRepository = getRepository(History);
    let client: Client;
    let clientHistory: History[];

    try {
      client = await ClientRepository.findOneOrFail(clientId);
    } catch (error) {
      res.status(404).send("Client not found.");
      return;
    }

    try {
      clientHistory = await HistoryRepository.find({
        where: { Client: clientId },
        relations: ["ConsultedProducts"],
      });

      res.status(200).send(clientHistory);
    } catch (error) {
      res.status(404).send("Histories not found.");
      return;
    }
  };

  static delete = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    const HistoryRepository = getRepository(History);
    let history: History;
    try {
      history = await HistoryRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("History not found.");
      return;
    }
    HistoryRepository.delete(id);
    //After all send a 204 (no content, but accepted) response
    res.status(200).send("History deleted.");
  };
  
}
export default HistoryController;
