import { Router } from 'express';
import PostgresContactRepository from '../repository/postgresContactRepository';
import ContactUseCases from '../../application/contactUseCase';
import ContactController from '../controller/contact';
import prismaClient from '../config/prisma-client';

export const contactRouter = Router();

const prisma = prismaClient.getInstance();
const postgresContactRepository = PostgresContactRepository.getInstance(prisma);
const contactUseCases = ContactUseCases.getInstance(postgresContactRepository);

const contactsController = new ContactController(contactUseCases);

contactRouter.get('/', contactsController.getContacts);
contactRouter.get('/id', contactsController.getContactById);
contactRouter.get('/email', contactsController.getContactByEmail);
contactRouter.post('/new', contactsController.postNewContact);
contactRouter.patch('/update', contactsController.updateContact);
contactRouter.delete('/delete', contactsController.deleteContact);
