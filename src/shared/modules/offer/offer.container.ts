import { IOfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { types } from '@typegoose/typegoose';
import { DefaultOfferService } from './default-offer.service.js';
import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { IController } from '../../libs/rest/index.js';
import OfferController from './offer.controller.js';
import { FavoritesController } from './favorites.controller.js';

export const offerContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<IOfferService>(Component.OfferService).to(DefaultOfferService);
    options.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
    options.bind<IController>(Component.OfferController).to(OfferController).inSingletonScope();
    options.bind<IController>(Component.FavoritesController).to(FavoritesController).inSingletonScope();
  });
