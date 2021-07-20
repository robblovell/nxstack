import 'reflect-metadata';
import { Container, injectable } from 'inversify';
declare const container: Container;
declare const inject: (serviceIdentifier: string | symbol | import("inversify/lib/interfaces/interfaces").interfaces.Newable<any> | import("inversify/lib/interfaces/interfaces").interfaces.Abstract<any>) => (proto: any, key: string) => void;
export { container, injectable, inject };
