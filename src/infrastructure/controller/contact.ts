import { NextFunction, Request, Response } from 'express';
import ContactUseCases from '../../application/contactUseCase';

export default class ContactController {
  constructor(private contactUseCases: ContactUseCases) {}

  getContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.session.passport?.user;
      if (!authorId) throw new Error('No author id');
      const contacts = await this.contactUseCases.getContacts(authorId);
      return res.status(200).json(contacts);
    } catch (error) {
      next(error);
    }
  };
  getContactById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.session.passport!.user;
      const contactId = req.body.contactId;
      const contact = await this.contactUseCases.getContactById(
        authorId,
        contactId
      );
      return res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  };
  getContactByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authorId = req.session.passport!.user;
      const email = req.body.email;
      const contact = await this.contactUseCases.getContactByEmail(
        authorId,
        email
      );
      return res.status(200).json(contact);
    } catch (error) {
      next(error);
    }
  };
  postNewContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newContact = req.body;
      const authorId = req.session.passport?.user;

      const contactCreated = await this.contactUseCases.createContact({
        ...newContact,
        authorId,
      });

      return res.status(201).json(contactCreated);
    } catch (error) {
      next(error);
    }
  };
  updateContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.session.passport!.user;
      const contact = req.body;
      if (!contact.contactId) throw new Error('No contact id');
      if (!contact.email) throw new Error('No email');
      if (!contact.alias) throw new Error('No alias');
      const updatedContact = await this.contactUseCases.updateContact(
        authorId,
        contact
      );
      return res.status(200).json(updatedContact);
    } catch (error) {
      next(error);
    }
  };
  deleteContact = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = req.session.passport!.user;
      const contactId = req.body.contactId;
      const contactDeleted = await this.contactUseCases.deleteContact(
        authorId,
        contactId
      );
      return res.status(200).json(contactDeleted);
    } catch (error) {
      next(error);
    }
  };
}
