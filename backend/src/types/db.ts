import { Db, Collection } from 'mongodb';
import { CartItem } from './Cart';

export interface DbCollections {
  carts: Collection<CartItem>;
}

export interface AppDb extends Db {
  collection<T>(name: T): T extends keyof DbCollections ? DbCollections[T] : Collection;
}
