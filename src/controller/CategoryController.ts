import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { Category } from "../entities/Category";

class CategoryController {
  static add = async (req: Request, res: Response) => {
    let { CategoryName, Image } = req.body;
    let category = new Category();
    category.CategoryName = CategoryName;
    category.Image = Image;

    const errors = await validate(category);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    const CategoryRepository = getRepository(Category);

    try {
      await CategoryRepository.save(category);
    } catch (e) {
      res.status(409).send("Category insert error");
      return;
    }
    //If all ok, send 201 response
    res.status(201).send("Category inserted.");
  };

  static delete = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    const categoryRepository = getRepository(Category);
    let category: Category;
    try {
      category = await categoryRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send("category not found.");
      return;
    }
    categoryRepository.delete(id);
    //After all send a 204 (no content, but accepted) response
    res.status(204).send("category deleted.");
  };

  static edit = async (req: Request, res: Response) => {
    //Get values from the body
    const { id, CategoryName, Image } = req.body;

    //Try to find category on database
    const categoryRepository = getRepository(Category);
    let category;
    try {
      category = await categoryRepository.findOneOrFail(id);
      category.CategoryName = CategoryName;
      category.Image = Image;
      categoryRepository.save(category);
      res.status(203).send("category edited");
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("category not found");
      return;
    }
  };

  static getAll = async (req: Request, res: Response) => {
    //Get categorys from database
    const categoryRepository = getRepository(Category);
    const categories = await categoryRepository.find({
    });
  
    //Send the users object
    res.send(categories);
  };
}
export default CategoryController;
